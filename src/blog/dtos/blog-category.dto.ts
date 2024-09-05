import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { IsValidLocaleRecord } from "src/helpers/validations/decorators/validate-locale-record";

export class BlogCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsValidLocaleRecord()
  category: Record<string, string>;
}