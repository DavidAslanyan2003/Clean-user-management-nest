import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { BlogCategoryService } from '../services/blog-category.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RESPONSE_MESSAGES } from 'src/helpers/response/response-messages';
import { BlogCategory } from '../entities/blog-category.entity';
import { BlogCategoryDto } from '../dtos/blog-category.dto';
import { CheckUUIDPipe } from 'src/helpers/validations/pipes/check-uuid-pipe';

@Controller('api/v1/blog-category')
export class BlogCategoryController {
  constructor(private blogCategoryService: BlogCategoryService) {}

  @Get('list')
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.CATEGORIES_FETCHED,
    type: BlogCategory,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.INVALID_REQUEST,
  })
  @ApiOperation({
    summary: 'Get categories list',
    description: 'Endpoint to get categories list',
  })
  async getAllCategories() {
    return this.blogCategoryService.getAllBlogCategories();
  }

  @Get(':id')
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.CATEGORY_FETCHED,
    type: BlogCategory,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.INVALID_REQUEST,
  })
  @ApiOperation({
    summary: 'Get a single category',
    description: 'Endpoint to get a single category',
  })
  async getCategory(@Param('id', CheckUUIDPipe) id: string) {
    return this.blogCategoryService.getBlogCategory(id);
  }

  @Post()
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.CATEGORY_CREATED,
    type: BlogCategory,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.INVALID_REQUEST,
  })
  @ApiOperation({
    summary: 'Create new category',
    description: 'Endpoint to create a new category',
  })
  async createCategory(@Body() categoryDto: BlogCategoryDto) {
    return this.blogCategoryService.createBlogCategory(categoryDto);
  }

  @Put(':id')
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.CATEGORY_UPDATED,
    type: BlogCategory,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.INVALID_REQUEST,
  })
  @ApiOperation({
    summary: 'Update a category',
    description: 'Endpoint to update a category',
  })
  async updateCategory(
    @Param('id', CheckUUIDPipe) id: string,
    @Body() updateCategoryDto: BlogCategoryDto,
  ) {
    return this.blogCategoryService.updateBlogCategory(updateCategoryDto, id);
  }

  @Delete(':id')
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.CATEOGRY_DELETED,
    type: BlogCategory,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.INVALID_REQUEST,
  })
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Endpoint to delete a category',
  })
  async deleteCategory(@Param('id', CheckUUIDPipe) id: string) {
    return this.blogCategoryService.deleteBlogPostCategory(id);
  }
}
