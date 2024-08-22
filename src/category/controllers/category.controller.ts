import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { Category } from '../entities/category.entity';

@Controller('api/v1/category')
@ApiTags('Categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Creates a new tag',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided for creating the tag.',
  })
  //   @ApiResponse({
  //     description: 'Response',
  //     type: BannerType,
  //   })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.createCategories(createCategoryDto);
  }
}
