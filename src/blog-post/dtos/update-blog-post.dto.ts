import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateBlogPostDto {
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
  categories: string[];

  @ApiProperty()
  @IsNotEmpty()
  viewsCount: number;

  @ApiProperty()
  @IsNotEmpty()
  imageLarge: string;

  @ApiProperty()
  @IsNotEmpty()
  imageSmall: string
}

