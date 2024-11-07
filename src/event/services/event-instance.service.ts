import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventInstance } from '../entities/event-instance.entity';
import { Dates } from '../entities/dates.entity';
import { Event } from '../entities/event.entity';
import { REQUEST } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import { CreateEventInstanceDto } from '../dtos/create-event-instance.dto';
import {
  translatedErrorResponse,
  translatedSuccessResponse,
} from '../../helpers/validations/service-helper-functions/category-helper-functions';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from '../dtos/create-agenda.dto';
import { getEvent } from 'src/helpers/validations/service-helper-functions/event-validation';

@Injectable({ scope: Scope.REQUEST })
export class EventInstanceService {
  constructor(
    @InjectRepository(EventInstance)
    private readonly eventInstanceRepository: Repository<EventInstance>,
    @InjectRepository(Dates)
    private readonly eventDatesRepository: Repository<Dates>,
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly i18n: I18nService,
    private readonly agendaService: AgendaService,
  ) {}

  async createEventInstance(
    eventInstanceDto: CreateEventInstanceDto,
  ): Promise<CustomResponse<EventInstance>> {
    const eventInstanceQueryRunner =
      this.eventInstanceRepository.manager.connection.createQueryRunner();
    await eventInstanceQueryRunner.connect();
    await eventInstanceQueryRunner.startTransaction();

    const locale = this.request['language'];

    try {
      const event = await getEvent(
        eventInstanceDto.eventId,
        this.i18n,
        eventInstanceQueryRunner,
        locale,
      );

      const eventInstance = eventInstanceQueryRunner.manager
        .getRepository(EventInstance)
        .create({
          event: event,
          version: 1,
        });

      await eventInstanceQueryRunner.manager
        .getRepository(EventInstance)
        .save(eventInstance);

      const date = eventInstanceQueryRunner.manager
        .getRepository(Dates)
        .create({
          eventInstance: eventInstance,
          start_date: eventInstanceDto.eventStartDate,
          start_time: eventInstanceDto.eventStartTime,
          end_date: eventInstanceDto.eventEndDate,
          end_time: eventInstanceDto.eventEndTime,
          version: 1,
        });

      const createAgendaDto: CreateAgendaDto = {
        agendaDate: eventInstanceDto.agendaDate,
        slots: eventInstanceDto.slots,
      };

      await this.agendaService.createAgenda(
        createAgendaDto,
        eventInstance.id,
        eventInstanceQueryRunner,
      );

      const storedDates = await eventInstanceQueryRunner.manager
        .getRepository(Dates)
        .save(date);

      const resultedEventInstance = await eventInstanceQueryRunner.manager
        .getRepository(EventInstance)
        .findOne({
          where: { id: eventInstance.id },
          relations: ['agendas'],
        });
      resultedEventInstance['dates'] = storedDates;

      await eventInstanceQueryRunner.commitTransaction();

      return translatedSuccessResponse<EventInstance>(
        this.i18n,
        locale,
        'SUCCESSED_CREATE_EVENT_INSTANCE',
        resultedEventInstance,
      );
    } catch (error) {
      await eventInstanceQueryRunner.rollbackTransaction();

      return translatedErrorResponse<EventInstance>(
        this.i18n,
        locale,
        'FAILED_CREATE_EVENT_INSTANCE',
        error,
      );
    } finally {
      await eventInstanceQueryRunner.release();
    }
  }
}
