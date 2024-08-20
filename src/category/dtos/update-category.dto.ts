import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsValidLocaleRecord } from 'src/helper/validations/decorators/has-required-locales';
import { IsValidUrl } from 'src/helper/validations/decorators/validate-aws-s3-path';

export class UpdateCategoryDto {
  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Name of the category in different languages',
  })
  @IsNotEmpty()
  @IsValidLocaleRecord()
  name: string;

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
  description: string;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image>',
    description: 'Category image url',
  })
  @IsNotEmpty()
  @IsValidUrl()
  category_image: string;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'Category icon url',
  })
  @IsNotEmpty()
  @IsValidUrl()
  category_icon: string;
}
