import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class BlogCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  category: Record<string, string>;
}