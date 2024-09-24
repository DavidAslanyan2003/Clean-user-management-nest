import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsPositive } from 'class-validator';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';
import { IsValidLocaleRecord } from '../../helpers/validations/decorators/validate-locale-record';
import { IsValidUrl } from '../../helpers/validations/decorators/validate-url';

export class UpdateBlogDto {
  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Title of blog in different languages',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidLocaleRecord()
  title: Record<string, string>;

  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Short Description of blog in different languages',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidLocaleRecord()
  shortDescription: Record<string, string>;

  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Description of blog in different languages',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidLocaleRecord()
  description: Record<string, string>;

  @ApiProperty()
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  categories: string[];

  @ApiProperty()
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsPositive()
  viewsCount: number;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'Blog image large url',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidUrl()
  imageLarge: string;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'Blog image small url',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidUrl()
  imageSmall: string;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'Blog images urls',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidUrl()
  @IsArray()
  images: string[];
}
