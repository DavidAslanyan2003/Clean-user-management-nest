import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class BlogPostCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  category: Record<string, string>;
}