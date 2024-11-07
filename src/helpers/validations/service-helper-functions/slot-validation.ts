import { BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Agenda } from 'src/event/entities/agenda.entity';
import { Slot } from 'src/event/entities/slot.entity';
import { ERROR_FILE_PATH } from 'src/helpers/constants/constants';
import { QueryRunner } from 'typeorm';

export function isTimeAvailable(
  slots: Slot[],
  date: Date,
  startTime: string,
  endTime: string,
  slotId?: string,
): boolean {
  const targetDate = new Date(date);

  const startTimeDate = new Date(`${targetDate.toDateString()} ${startTime}`);
  const endTimeDate = new Date(`${targetDate.toDateString()} ${endTime}`);

  if (!slots) {
    return true;
  }
  for (const slot of slots) {
    if (slotId && slotId === slot.id) {
      continue;
    }
    const slotStartTimeDate = new Date(
      `${targetDate.toDateString()} ${slot.start_time}`,
    );
    const slotEndTimeDate = new Date(
      `${targetDate.toDateString()} ${slot.end_time}`,
    );

    if (
      (startTimeDate >= slotStartTimeDate && startTimeDate < slotEndTimeDate) ||
      (endTimeDate > slotStartTimeDate && endTimeDate <= slotEndTimeDate) ||
      (startTimeDate <= slotStartTimeDate && endTimeDate >= slotEndTimeDate)
    ) {
      return false;
    }
  }
  return true;
}

export async function getAgenda(
  agendaId: string,
  i18n: I18nService,
  queryRunner: QueryRunner,
  locale: string,
): Promise<Agenda> {
  const agenda = await queryRunner.manager.getRepository(Agenda).findOne({
    where: { id: agendaId },
  });

  if (!agenda) {
    throw new BadRequestException(
      i18n.translate(`${ERROR_FILE_PATH}.AGENDA_NOT_FOUND`, {
        lang: locale,
      }),
    );
  }

  return agenda;
}
