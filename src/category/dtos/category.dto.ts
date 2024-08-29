import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';
import { MatchDescriptionKeysInName } from '../../helpers/validations/decorators/validate-description';
import { IsValidLocaleRecord } from '../../helpers/validations/decorators/validate-locale-record';
import { IsValidUrl } from '../../helpers/validations/decorators/validate-url';

export class CategoryDto {
  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Name of the category in different languages',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidLocaleRecord()
  name: Record<string, string>;

  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Description of the category in different languages',
  })
  @IsOptional()
  @MatchDescriptionKeysInName('name')
  description: Record<string, string>;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image>',
    description: 'Category image url',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidUrl()
  category_image: string;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'Category icon url',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidUrl()
  category_icon: string;
}
