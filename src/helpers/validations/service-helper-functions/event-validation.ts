import { BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { EventInstance } from '../../../event/entities/event-instance.entity';
import { ERROR_FILE_PATH } from '../../../helpers/constants/constants';
import { QueryRunner } from 'typeorm';
import { Event } from '../../../event/entities/event.entity';

export async function getEventInstance(
  eventInstanceId: string,
  i18n: I18nService,
  queryRunner: QueryRunner,
  locale: string,
): Promise<EventInstance> {
  const eventInstance = await queryRunner.manager
    .getRepository(EventInstance)
    .findOne({
      where: { id: eventInstanceId },
    });

  if (!eventInstance) {
    throw new BadRequestException(
      i18n.translate(`${ERROR_FILE_PATH}.EVENT_INSTANCE_NOT_FOUND`, {
        lang: locale,
      }),
    );
  }

  return eventInstance;
}

export async function getEvent(
  eventId: string,
  i18n: I18nService,
  queryRunner: QueryRunner,
  locale: string,
): Promise<Event> {
  const event = await queryRunner.manager.getRepository(Event).findOne({
    where: { id: eventId },
  });

  if (!event) {
    throw new BadRequestException(
      i18n.translate(`${ERROR_FILE_PATH}.EVENT_NOT_FOUND`, {
        lang: locale,
      }),
    );
  }

  return event;
}
