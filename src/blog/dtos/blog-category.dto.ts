import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ERROR_FILE_PATH } from "src/helpers/constants/constants";
import { IsValidLocaleRecord } from "src/helpers/validations/decorators/validate-locale-record";

export class BlogCategoryDto {
  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Blog Category in different languages',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidLocaleRecord()
  category: Record<string, string>;
}