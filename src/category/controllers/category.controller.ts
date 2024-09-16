import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
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
import { CustomResponse } from '../../helpers/response/custom-response.dto';
import { UpdateStatusDto } from '../dtos/update-status.dto';
import { CATEGORY_NOT_FOUND } from '../../helpers/constants/constants';
import { CheckUUIDPipe } from '../../helpers/validations/pipes/check-uuid-pipe';

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
    @Body() createCategoryDto: CategoryDto,
  ): Promise<CustomResponse<Category>> {
    return this.categoryService.createCategory(createCategoryDto);
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
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: string,
  ): Promise<CustomResponse<{ categories: Category[]; total: number }>> {
    return this.categoryService.getInactiveCategories(
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
    @Param('id', CheckUUIDPipe) id: string,
    @Query('allLanguages') allLanguages?: string,
  ): Promise<CustomResponse<Category>> {
    return this.categoryService.getCategoryById(id, allLanguages);
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
    @Body() updateCategoryDto: CategoryDto,
  ): Promise<CustomResponse<Category>> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
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
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<CustomResponse<Category>> {
    return this.categoryService.updateStatus(id, updateStatusDto);
  }
}
