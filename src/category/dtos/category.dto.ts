import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ERROR_FILE_NAME } from 'src/helpers/constants/constants';
import { IsValidLocaleRecord } from 'src/helpers/validations/decorators/validate-locale-record';
import { IsValidUrl } from 'src/helpers/validations/decorators/validate-url';

export class CategoryDto {
  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Name of the category in different languages',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_NAME}.IS_EMPTY` })
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
  @IsValidLocaleRecord()
  description: Record<string, string>;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image>',
    description: 'Category image url',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_NAME}.IS_EMPTY` })
  @IsValidUrl()
  category_image: string;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'Category icon url',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_NAME}.IS_EMPTY` })
  @IsValidUrl()
  category_icon: string;
}
