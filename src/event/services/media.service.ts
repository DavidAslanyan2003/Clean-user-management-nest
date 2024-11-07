import { Injectable, Scope, Inject, BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import { CreateEventMediaDto } from '../dtos/create-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventMedia } from '../entities/event-media.entity';
import { Repository } from 'typeorm';
import { getEvent } from '../../helpers/validations/service-helper-functions/event-validation';
import {
  translatedErrorResponse,
  translatedSuccessResponse,
} from '../../helpers/validations/service-helper-functions/category-helper-functions';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';

@Injectable({ scope: Scope.REQUEST })
export class EventMediaService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly i18n: I18nService,
    @InjectRepository(EventMedia)
    private readonly eventMediaRepository: Repository<EventMedia>,
  ) {}

  async createMedia(
    createEventMediaDto: CreateEventMediaDto,
  ): Promise<CustomResponse<EventMedia>> {
    const queryRunner =
      this.eventMediaRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const locale = this.request['language'];

    try {
      const event = await getEvent(
        createEventMediaDto.eventId,
        this.i18n,
        queryRunner,
        locale,
      );

      const mediaWithGivenEventId = await queryRunner.manager
        .getRepository(EventMedia)
        .findOne({
          where: { event: { id: event.id } },
        });

      if (mediaWithGivenEventId) {
        throw new BadRequestException(
          this.i18n.translate(`${ERROR_FILE_PATH}.EVENT_MEDIA_EXISTS`, {
            lang: locale,
          }),
        );
      }

      const eventMedia = queryRunner.manager.getRepository(EventMedia).save({
        event: event,
        cover_image: createEventMediaDto.coverImage,
        version: 1,
        video_link: createEventMediaDto.videoLink,
        images: createEventMediaDto.images,
      });

      await queryRunner.commitTransaction();

      return translatedSuccessResponse<EventMedia>(
        this.i18n,
        locale,
        'SUCCESSED_CREATE_EVENT_MEDIA',
        eventMedia,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse<EventMedia>(
        this.i18n,
        locale,
        'FAILED_CREATE_EVENT_MEDIA',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
