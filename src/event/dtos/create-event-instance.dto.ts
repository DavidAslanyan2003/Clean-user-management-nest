import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsDateString,
  Matches,
  IsArray,
} from 'class-validator';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';
import { IsNotBeforeToday } from '../../helpers/validations/decorators/validate-date';
import { IsEndTimeAfterStartTime } from '../../helpers/validations/decorators/validate-end-time';
import { CreateSlotDto } from './create-slot.dto';

export class CreateEventInstanceDto {
  @ApiProperty({
    example: 'da65b18e-b2e4-44d2-9295-8126494c8512',
    description: 'event id',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsUUID('4', { message: `${ERROR_FILE_PATH}.ITEM_NOT_FOUND` })
  eventId: string;

  @ApiProperty({
    example: '2022-01-01',
    description: 'Start date of the event in YYYY-MM-DD format',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsDateString({}, { message: `${ERROR_FILE_PATH}.IS_NOT_DATE` })
  @IsNotBeforeToday()
  eventStartDate: Date;

  @ApiProperty({
    example: '2022-01-02',
    description: 'End date of the event in YYYY-MM-DD format',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsDateString({}, { message: `${ERROR_FILE_PATH}.IS_NOT_DATE` })
  @IsNotBeforeToday()
  eventEndDate: Date;

  @ApiProperty({
    example: '12:00',
    description: 'The startTime of the event in HH:mm format',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: `${ERROR_FILE_PATH}.INVALID_TIME_FORMAT`,
  })
  eventStartTime: string;

  @ApiProperty({
    example: '13:00',
    description: 'The endTime of the event in HH:mm format',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: `${ERROR_FILE_PATH}.INVALID_TIME_FORMAT`,
  })
  @IsEndTimeAfterStartTime('eventStartTime')
  eventEndTime: string;

  @ApiProperty({
    example: '2025-01-02',
    description: 'Date of the event in YYYY-MM-DD format',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsDateString({}, { message: `${ERROR_FILE_PATH}.IS_NOT_DATE` })
  @IsNotBeforeToday()
  agendaDate: Date;

  @ApiProperty({
    example: [
      {
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
    ],
    description: 'Agenda slots',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsArray({ message: `${ERROR_FILE_PATH}.IS_NOT_ARRAY` })
  slots: CreateSlotDto[];
}
