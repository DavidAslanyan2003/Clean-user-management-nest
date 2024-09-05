import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive } from "class-validator";
import { IsValidLocaleRecord } from "src/helpers/validations/decorators/validate-locale-record";
import { IsValidUrl } from "src/helpers/validations/decorators/validate-url";

export class UpdateBlogDto {
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
  categories: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  viewsCount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsValidUrl()
  imageLarge: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsValidUrl()
  imageSmall: string
}

