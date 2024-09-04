import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class BlogDto {
  @ApiProperty()
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  title: Record<string, string>;

  @ApiProperty()
  @IsNotEmpty()
  shortDescription: Record<string, string>;

  @ApiProperty()
  @IsNotEmpty()
  description: Record<string, string>;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  categories: string[];

  @ApiProperty()
  @IsNotEmpty()
  imageLarge: string;

  @ApiProperty()
  @IsNotEmpty()
  imageSmall: string
}

