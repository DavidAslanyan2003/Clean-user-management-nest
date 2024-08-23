import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { Category } from '../entities/category.entity';
import { CategoryDto } from '../dtos/category.dto';
import { Locale } from 'src/helpers/constants/locale';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import { UpdateStatusDto } from '../dtos/update-status.dto';
import { CATEGORY_NOT_FOUND } from 'src/helpers/constants/constants';
import { CheckUUIDPipe } from 'src/helpers/validations/pipes/check-uuid-pipe';

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
    description: 'Invalid data provided for creating the category.',
  })
  @ApiResponse({
    description: 'Response',
    type: Category,
  })
  async create(
    @Locale() locale: string,
    @Body() createCategoryDto: CategoryDto,
  ): Promise<CustomResponse<Category>> {
    return this.categoryService.createCategory(locale, createCategoryDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieves all categories',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CATEGORY_NOT_FOUND,
  })
  @ApiResponse({
    description: 'Response',
    type: Category,
  })
  async getAllCategories(
    @Locale() locale: string,
  ): Promise<CustomResponse<Category[]>> {
    return this.categoryService.getCategories(locale);
  }

  @Get('name/:name')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieves categories by name',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CATEGORY_NOT_FOUND,
  })
  @ApiResponse({
    description: 'Response',
    type: Category,
  })
  async getCategoriesByName(
    @Locale() locale: string,
    @Param('name') name: string,
  ): Promise<CustomResponse<Category[]>> {
    return this.categoryService.getCategories(locale, name);
  }

  @Get('/inactive')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieves all inactive categories',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CATEGORY_NOT_FOUND,
  })
  @ApiResponse({
    description: 'Response',
    type: Category,
  })
  async getInactiveCategories(
    @Locale() locale: string,
  ): Promise<CustomResponse<Category[]>> {
    return this.categoryService.getInactiveCategories(locale);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieves categories by id',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CATEGORY_NOT_FOUND,
  })
  @ApiResponse({
    description: 'Response',
    type: Category,
  })
  async getCategoriesById(
    @Locale() locale: string,
    @Param('id', CheckUUIDPipe) id: string,
  ): Promise<CustomResponse<Category>> {
    return this.categoryService.getCategoryById(locale, id);
  }

  @Put(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updates an existing category',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CATEGORY_NOT_FOUND,
  })
  @ApiResponse({
    description: 'Response',
    type: Category,
  })
  async updateCategory(
    @Param('id', CheckUUIDPipe) id: string,
    @Locale() locale: string,
    @Body() updateCategoryDto: CategoryDto,
  ): Promise<CustomResponse<Category>> {
    return this.categoryService.updateCategory(locale, id, updateCategoryDto);
  }

  @Patch(':id/status')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updates category status',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CATEGORY_NOT_FOUND,
  })
  @ApiResponse({
    description: 'Response',
    type: Category,
  })
  async updateStatus(
    @Param('id', CheckUUIDPipe) id: string,
    @Locale() locale: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<CustomResponse<Category>> {
    return this.categoryService.updateStatus(locale, id, updateStatusDto);
  }
}
