import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsValidLocaleRecord } from 'src/helpes/validations/decorators/validate-locale-record';
import { IsValidUrl } from 'src/helpes/validations/decorators/validate-url';

export class CreateCategoryDto {
  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Name of the category in different languages',
  })
  @IsNotEmpty({ message: 'error.isEmpty' })
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
  @IsNotEmpty({ message: 'error.isEmpty' })
  @IsValidUrl()
  category_image: string;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'Category icon url',
  })
  @IsNotEmpty({ message: 'error.isEmpty' })
  @IsValidUrl()
  category_icon: string;
}
