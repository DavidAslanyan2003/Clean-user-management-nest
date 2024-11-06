import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsArray } from 'class-validator';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';
import { IsNotBeforeToday } from '../../helpers/validations/decorators/validate-date';
import { CreateSlotDto } from './create-slot.dto';

export class CreateAgendaDto {
  @ApiProperty({
    example: '2025-01-02',
    description: 'Date of the event in YYYY-MM-DD format',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsDateString({}, { message: `${ERROR_FILE_PATH}.IS_NOT_DATE` })
  @IsNotBeforeToday()
  agendaDate: Date;

  @ApiProperty({
    example: {
      startTime: '16:00',
      endTime: '17:00',
      timezone: 'UTC',
      title: {
        EN: 'Title',
        HY: 'Վերնագիր',
      },
      description: {
        EN: 'Title',
        HY: 'Վերնագիր',
      },
      location: 'Aram Khachaturian Concert Hall',
      speakerName: {
        EN: 'Title',
        HY: 'Վերնագիր',
      },
      speakerProfession: {
        EN: 'Title',
        HY: 'Վերնագիր',
      },
      imageURL: 'https://s3.amazonaws.com/bucket-name/path-to-image',
    },
    description: 'Agenda slots',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsArray({ message: `${ERROR_FILE_PATH}.IS_NOT_ARRAY` })
  slots: CreateSlotDto[];
}
