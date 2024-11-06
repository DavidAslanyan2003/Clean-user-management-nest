import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { QueryRunner, Repository } from 'typeorm';
import { Slot } from '../entities/slot.entity';
import { CreateSlotDto } from '../dtos/create-slot.dto';
import {
  getAgenda,
  isTimeAvailable,
} from '../../helpers/validations/service-helper-functions/slot-validation';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';

@Injectable({ scope: Scope.REQUEST })
export class SlotService {
  constructor(
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly i18n: I18nService,
  ) {}

  async createSlots(
    createSlotDtos: CreateSlotDto[],
    agendaId: string,
    queryRunner: QueryRunner,
  ): Promise<Slot[]> {
    const locale = this.request['language'];

    const slots: Slot[] = [];

    const agenda = await getAgenda(agendaId, this.i18n, queryRunner, locale);

    for (const createSlotDto of createSlotDtos) {
      if (
        !isTimeAvailable(
          agenda.slots,
          agenda.date,
          createSlotDto.startTime,
          createSlotDto.endTime,
        )
      ) {
        throw new BadRequestException(
          this.i18n.translate(`${ERROR_FILE_PATH}.UNAVAILABLE_TIME`, {
            lang: locale,
          }),
        );
      }

      const slot = queryRunner.manager.getRepository(Slot).create({
        start_time: createSlotDto.startTime,
        end_time: createSlotDto.endTime,
        timezone: createSlotDto.timezone,
        title: createSlotDto.title,
        description: createSlotDto.description,
        location: createSlotDto.location,
        speaker_name: createSlotDto.speakerName,
        speaker_profession: createSlotDto.speakerProfession,
        image_url: createSlotDto.imageURL,
        agenda: agenda,
        version: 1,
      });

      const savedSlot = await queryRunner.manager
        .getRepository(Slot)
        .save(slot);

      slots.push(savedSlot);
    }

    return slots;
  }
}
