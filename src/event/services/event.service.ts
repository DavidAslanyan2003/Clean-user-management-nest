import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { BasicInfo } from '../entities/basic-info.entity';
import { REQUEST } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { EventDetailsDto } from '../dtos/event-details.dto';
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
  ) {}

  async createEvent(
    eventDetailsDto: EventDetailsDto,
    userId: string,
  ): Promise<CustomResponse<Event>> {
    const eventQueryRunner =
      this.eventRepository.manager.connection.createQueryRunner();
    await eventQueryRunner.connect();
    await eventQueryRunner.startTransaction();

    const basicInfoQueryRunner =
      this.basicInfoRepository.manager.connection.createQueryRunner();
    await basicInfoQueryRunner.connect();
    await basicInfoQueryRunner.startTransaction();

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

      const tags = await Promise.all(
        (
          await this.tagService.createTags(eventDetailsDto.tagNames)
        ).data,
      );

      const event = eventQueryRunner.manager.getRepository(Event).create({
        version: 1,
        slug: generatedSlug,
        user: user,
        categories: categories,
        tags: tags,
      });

      await Promise.all(
        (
          await this.faqService.createFaq(eventDetailsDto.FAQs, event)
        ).data,
      );

      const eventBasicInfo = basicInfoQueryRunner.manager
        .getRepository(BasicInfo)
        .create({
          event: { id: event.id },
          event_title: eventDetailsDto.eventTitle,
          event_description: eventDetailsDto.eventDescription,
          version: 1,
        });
      await basicInfoQueryRunner.manager
        .getRepository(BasicInfo)
        .save(eventBasicInfo);

      const resultedEvent = await eventQueryRunner.manager
        .getRepository(Event)
        .save(event);

      await eventQueryRunner.commitTransaction();
      await basicInfoQueryRunner.commitTransaction();

      return translatedSuccessResponse<Event>(
        this.i18n,
        locale,
        'SUCCESSED_CREATE_EVENT',
        resultedEvent,
      );
    } catch (error) {
      await eventQueryRunner.rollbackTransaction();
      await basicInfoQueryRunner.rollbackTransaction();

      return translatedErrorResponse<Event>(
        this.i18n,
        locale,
        'FAILED_CREATE_EVENT',
        error,
      );
    } finally {
      await eventQueryRunner.release();
      await basicInfoQueryRunner.release();
    }
  }
}
