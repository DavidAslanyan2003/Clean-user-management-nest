import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
    description: 'Creates a new category',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided for creating the category.',
  })
  @ApiResponse({
    description: 'Response',
    type: Category,
  })
  @ApiBody({ type: CategoryDto })
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
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  @ApiQuery({ name: 'order', required: false })
  async getAllCategories(
    @Locale() locale: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: string,
  ): Promise<CustomResponse<{ categories: Category[]; total: number }>> {
    return this.categoryService.getActiveCategories(
      page,
      limit,
      orderBy,
      order,
      locale,
    );
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
  @ApiParam({ name: 'name', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  @ApiQuery({ name: 'order', required: false })
  async getCategoriesByName(
    @Locale() locale: string,
    @Param('name') name: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: string,
  ): Promise<CustomResponse<{ categories: Category[]; total: number }>> {
    return this.categoryService.getCategoryByName(
      page,
      limit,
      orderBy,
      order,
      locale,
      name,
    );
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
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  @ApiQuery({ name: 'order', required: false })
  async getInactiveCategories(
    @Locale() locale: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: string,
  ): Promise<CustomResponse<{ categories: Category[]; total: number }>> {
    return this.categoryService.getInactiveCategories(
      locale,
      page,
      limit,
      orderBy,
      order,
    );
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
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'allLanguages', required: true })
  async getCategoriesById(
    @Locale() locale: string,
    @Param('id', CheckUUIDPipe) id: string,
    @Query('allLanguages', ParseBoolPipe) allLanguages: boolean,
  ): Promise<CustomResponse<Category>> {
    return this.categoryService.getCategoryById(locale, id, allLanguages);
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
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: CategoryDto })
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
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateStatusDto })
  async updateStatus(
    @Param('id', CheckUUIDPipe) id: string,
    @Locale() locale: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<CustomResponse<Category>> {
    return this.categoryService.updateStatus(locale, id, updateStatusDto);
  }
}