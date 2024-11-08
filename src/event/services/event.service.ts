import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { BasicInfo } from '../entities/basic-info.entity';
import { REQUEST } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { CreateEventDetailsDto } from '../dtos/create-event.dto';
import { CustomResponse } from '../../helpers/response/custom-response.dto';
import { Category } from '../../category/entities/category.entity';
import { TagService } from './tag.service';
import { FaqService } from './faq.service';
import {
  translatedSuccessResponse,
  translatedErrorResponse,
  checkItemExistance,
} from '../../helpers/validations/service-helper-functions/category-helper-functions';
import { slugifyText } from '../../helpers/validations/service-helper-functions/slugify';
import {
  getEvent,
  getEventBasicInfo,
} from 'src/helpers/validations/service-helper-functions/event-validation';
import { ERROR_FILE_PATH } from 'src/helpers/constants/constants';
import { CategoryService } from '../../category/services/category.service';

@Injectable({ scope: Scope.REQUEST })
export class EventService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(BasicInfo)
    private readonly basicInfoRepository: Repository<BasicInfo>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly i18n: I18nService,
    private readonly tagService: TagService,
    private readonly faqService: FaqService,
    private readonly categoryService: CategoryService,
  ) {}

  async createEvent(
    eventDetailsDto: CreateEventDetailsDto,
    userId: string,
  ): Promise<CustomResponse<Event>> {
    const eventQueryRunner =
      this.eventRepository.manager.connection.createQueryRunner();
    await eventQueryRunner.connect();
    await eventQueryRunner.startTransaction();

    const locale = this.request['language'];
    try {
      const user = await this.userRepository.manager
        .getRepository(User)
        .findOne({
          where: { id: userId },
        });

      // checkItemExistance(user, this.i18n, locale);

      const categories = await Promise.all(
        eventDetailsDto.categories.map(async (categoryId) => {
          const category = await this.categoryRepository.manager
            .getRepository(Category)
            .findOne({ where: { id: categoryId } });

          checkItemExistance(category, this.i18n, locale, 'CATEGORY_NOT_FOUND');

          return category;
        }),
      );

      const generatedSlug = slugifyText(
        eventDetailsDto.eventTitle.en,
        new Date(),
      );

      const tags = await this.tagService.createTags(
        eventDetailsDto.tagNames,
        eventQueryRunner,
      );

      const event = eventQueryRunner.manager.getRepository(Event).create({
        version: 1,
        slug: generatedSlug,
        user: user,
        categories: categories,
        tags: tags,
      });

      const resultedEvent = await eventQueryRunner.manager
        .getRepository(Event)
        .save(event);

      await this.faqService.createFaq(
        eventDetailsDto.FAQs,
        event.id,
        eventQueryRunner,
      );

      const eventBasicInfo = eventQueryRunner.manager
        .getRepository(BasicInfo)
        .create({
          event: event,
          event_title: eventDetailsDto.eventTitle,
          event_description: eventDetailsDto.eventDescription,
          version: 1,
        });

      const resultedEventBasicInfo = await eventQueryRunner.manager
        .getRepository(BasicInfo)
        .save(eventBasicInfo);

      resultedEvent['basicInfo'] = resultedEventBasicInfo;

      await eventQueryRunner.commitTransaction();

      return translatedSuccessResponse<Event>(
        this.i18n,
        locale,
        'SUCCESSED_CREATE_EVENT',
        resultedEvent,
      );
    } catch (error) {
      await eventQueryRunner.rollbackTransaction();

      return translatedErrorResponse<Event>(
        this.i18n,
        locale,
        'FAILED_CREATE_EVENT',
        error,
      );
    } finally {
      await eventQueryRunner.release();
    }
  }

  async getEvent(
    eventId: string,
    allLanguages: string,
  ): Promise<CustomResponse<Event>> {
    const queryRunner =
      this.eventRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const locale = this.request['language'];
    const hasAllLanguages = allLanguages === 'true' ? true : false;

    try {
      let event: Event;

      event = await queryRunner.manager.getRepository(Event).findOne({
        where: { id: eventId },
        relations: ['faqs', 'tags', 'categories'],
      });

      if (!event) {
        throw new BadRequestException(
          this.i18n.translate(`${ERROR_FILE_PATH}.EVENT_NOT_FOUND`, {
            lang: locale,
          }),
        );
      }

      const eventBasicInfo = await getEventBasicInfo(
        eventId,
        this.i18n,
        queryRunner,
        locale,
      );
      event['basicInfo'] = eventBasicInfo;

      if (!hasAllLanguages) {
        const faqResponse = await this.faqService.getFaqs(event.id);

        if (faqResponse.error) {
          throw new BadRequestException(faqResponse.error);
        }

        event.faqs = faqResponse.data;
      }
      return translatedSuccessResponse<Event>(
        this.i18n,
        locale,
        'SUCCESSED_FETCH_EVENT',
        event,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse<Event>(
        this.i18n,
        locale,
        'FAILED_FETCH_EVENT',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getEventList(
    createdAt?: Date,
    categoryId?: string,
    userId?: string,
    page?: number,
    limit?: number,
    orderBy?: string,
    order?: string,
  ): Promise<CustomResponse<Event[]>> {
    const queryRunner =
      this.eventRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const locale = this.request['language'];
    page = page || 1;
    limit = limit || 10;
    const offset = (page - 1) * limit;
    orderBy = orderBy || 'id';
    const sortOrder = order === 'descend' ? 'DESC' : 'ASC';

    try {
      let events: Event[];

      if (createdAt) {
        events = await queryRunner.manager.getRepository(Event).find({
          where: { created_at: MoreThanOrEqual(createdAt) },
          relations: ['faqs', 'tags', 'categories'],
          skip: offset,
          take: limit,
          order: {
            [orderBy]: sortOrder as 'ASC' | 'DESC',
          },
        });
      } else if (categoryId) {
        events = await queryRunner.manager.getRepository(Event).find({
          where: { categories: { id: In([categoryId]) } },
          relations: ['faqs', 'tags', 'categories'],
          skip: offset,
          take: limit,
          order: {
            [orderBy]: sortOrder as 'ASC' | 'DESC',
          },
        });
      } else if (userId) {
        events = await queryRunner.manager.getRepository(Event).find({
          where: { user: { id: userId } },
          relations: ['faqs', 'tags', 'categories'],
          skip: offset,
          take: limit,
          order: {
            [orderBy]: sortOrder as 'ASC' | 'DESC',
          },
        });
      } else {
        events = await queryRunner.manager.getRepository(Event).find({
          relations: ['faqs', 'tags', 'categories'],
          skip: offset,
          take: limit,
          order: {
            [orderBy]: sortOrder as 'ASC' | 'DESC',
          },
        });
      }
      if (!events) {
        throw new BadRequestException(
          this.i18n.translate(`${ERROR_FILE_PATH}.EVENT_NOT_FOUND`, {
            lang: locale,
          }),
        );
      }

      return translatedSuccessResponse<Event[]>(
        this.i18n,
        locale,
        'SUCCESSED_FETCH_EVENT',
        events,
      );
    } catch (error) {
      return translatedErrorResponse<Event[]>(
        this.i18n,
        locale,
        'FAILED_FETCH_EVENT',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
