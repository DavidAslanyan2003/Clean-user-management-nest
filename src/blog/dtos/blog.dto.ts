import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";
import { IsValidLocaleRecord } from "src/helpers/validations/decorators/validate-locale-record";
import { IsValidUrl } from "src/helpers/validations/decorators/validate-url";

export class BlogDto {
  @ApiProperty()
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsValidLocaleRecord()
  title: Record<string, string>;

  @ApiProperty()
  @IsNotEmpty()
  @IsValidLocaleRecord()
  shortDescription: Record<string, string>;

  @ApiProperty()
  @IsNotEmpty()
  @IsValidLocaleRecord()
  description: Record<string, string>;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  categories: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsValidUrl()
  imageLarge: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsValidUrl()
  imageSmall: string
}

