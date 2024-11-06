import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  IsTimeZone,
  IsOptional,
  IsString,
} from 'class-validator';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';
import { IsEndTimeAfterStartTime } from '../../helpers/validations/decorators/validate-end-time';
import { IsValidLocaleRecord } from '../../helpers/validations/decorators/validate-locale-record';
import { IsValidUrl } from '../../helpers/validations/decorators/validate-url';

export class CreateSlotDto {
  @ApiProperty({
    example: '12:00',
    description: 'The startTime of the event in HH:mm format',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: `${ERROR_FILE_PATH}.INVALID_TIME_FORMAT`,
  })
  startTime: string;

  @ApiProperty({
    example: '13:00',
    description: 'The endTime of the event in HH:mm format',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: `${ERROR_FILE_PATH}.INVALID_TIME_FORMAT`,
  })
  @IsEndTimeAfterStartTime('startTime')
  endTime: string;

  @ApiProperty({
    example: 'UTC',
    description: 'The time zone of the event',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsTimeZone({ message: `${ERROR_FILE_PATH}.INVALID_TIME_ZONE` })
  timezone: string;

  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidLocaleRecord()
  @ApiProperty({
    example: { EN: 'Title', HY: 'Վերնագիր' },
  })
  title: Record<string, string>;

  @IsOptional()
  @IsValidLocaleRecord()
  @ApiProperty({
    example: { EN: 'Title', HY: 'Վերնագիր' },
  })
  description?: Record<string, string>;

  @IsOptional()
  @IsString({ each: true, message: `${ERROR_FILE_PATH}.IS_NOT_STRING` })
  @ApiProperty({
    example: 'Aram Khachaturian Concert Hall',
  })
  location?: string;

  @IsOptional()
  @IsValidLocaleRecord()
  @ApiProperty({
    example: { EN: 'Title', HY: 'Վերնագիր' },
  })
  speakerName?: Record<string, string>;

  @IsOptional()
  @IsValidLocaleRecord()
  @ApiProperty({
    example: { EN: 'Title', HY: 'Վերնագիր' },
  })
  speakerProfession?: Record<string, string>;

  @IsOptional()
  @IsString({ each: true, message: `${ERROR_FILE_PATH}.IS_NOT_STRING` })
  @IsValidUrl()
  @ApiProperty({
    example: 'image url',
  })
  imageURL?: string;
}
