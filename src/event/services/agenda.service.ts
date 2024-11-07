import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { QueryRunner } from 'typeorm';
import { Agenda } from '../entities/agenda.entity';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import { CreateAgendaDto } from '../dtos/create-agenda.dto';
import { SlotService } from './slot.service';
import {
  translatedSuccessResponse,
  translatedErrorResponse,
} from '../../helpers/validations/service-helper-functions/category-helper-functions';
import { getEventInstance } from '../../helpers/validations/service-helper-functions/event-validation';

@Injectable({ scope: Scope.REQUEST })
export class AgendaService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly i18n: I18nService,
    private readonly slotService: SlotService,
  ) {}

  async createAgenda(
    createAgendaDto: CreateAgendaDto,
    eventInstanceId: string,
    queryRunner: QueryRunner,
  ): Promise<Agenda> {
    const locale = this.request['language'];

    const eventInstance = await getEventInstance(
      eventInstanceId,
      this.i18n,
      queryRunner,
      locale,
    );

    const agenda = queryRunner.manager.getRepository(Agenda).create({
      eventInstance: eventInstance,
      date: createAgendaDto.agendaDate,
      version: 1,
    });

    const resultedAgenda = await queryRunner.manager
      .getRepository(Agenda)
      .save(agenda);

    await this.slotService.createSlots(
      createAgendaDto.slots,
      resultedAgenda.id,
      queryRunner,
    );

    console.log(resultedAgenda);

    return resultedAgenda;
  }
}
