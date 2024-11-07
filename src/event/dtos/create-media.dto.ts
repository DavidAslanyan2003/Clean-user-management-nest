import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';
import { IsValidUrl } from '../../helpers/validations/decorators/validate-url';
import { IsValidUrlArray } from '../../helpers/validations/decorators/validate-url-array';

export class CreateEventMediaDto {
  @ApiProperty({
    example: 'da65b18e-b2e4-44d2-9295-8126494c8512',
    description: 'event id',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsUUID('4', { message: `${ERROR_FILE_PATH}.ITEM_NOT_FOUND` })
  eventId: string;

  @ApiProperty({
    example: 'https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'The cover image of the event',
  })
  @IsString({ each: true, message: `${ERROR_FILE_PATH}.IS_NOT_STRING` })
  @IsValidUrl()
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  coverImage: string;

  @ApiProperty({
    example: ['https://s3.amazonaws.com/bucket-name/path-to-image'],
    description: 'The images of the event',
  })
  @IsString({ each: true })
  @IsArray({ message: `${ERROR_FILE_PATH}.IS_NOT_ARRAY` })
  @IsValidUrlArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: 'https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'The video link of the event',
  })
  @IsValidUrl()
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  videoLink: string;
}
