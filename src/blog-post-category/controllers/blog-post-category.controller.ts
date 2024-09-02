import { Controller, Get, HttpStatus, Headers, Param, Post, Body, Put, Delete } from "@nestjs/common";
import { BlogPostCategoryService } from "../services/blog-post-category.service";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { RESPONSE_MESSAGES } from "src/helpers/response/response-messages";
import { BlogPostCategory } from "../entities/blog-post-category.entity";
import { BlogPostCategoryDto } from "../dtos/blog-post-category.dto";


@Controller('api/v1/blog-post-category')
export class BlogPostCategoryController {
  constructor(private blogPostCategoryService: BlogPostCategoryService) {}

  @Get('list')
  @ApiOkResponse({ 
    status: HttpStatus.CREATED, 
    description: RESPONSE_MESSAGES.CATEGORIES_FETCHED ,
    type: BlogPostCategory,
  })
  @ApiBadRequestResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: RESPONSE_MESSAGES.INVALID_REQUEST 
  })
  @ApiOperation({ summary: 'Get categories list', description: 'Endpoint to get categories list' })
  async getAllCategories(@Headers() headers: any,) {
    return this.blogPostCategoryService.getAllBlogPostCategories(headers.locale);
  };


  @Get(':id')
  @ApiOkResponse({ 
    status: HttpStatus.CREATED, 
    description: RESPONSE_MESSAGES.CATEGORY_FETCHED ,
    type: BlogPostCategory,
  })
  @ApiBadRequestResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: RESPONSE_MESSAGES.INVALID_REQUEST 
  })
  @ApiOperation({ summary: 'Get a single category', description: 'Endpoint to get a single category' })
  async getCategory(
    @Headers() headers: any,
    @Param('id') id: string
  ) {
    return this.blogPostCategoryService.getBlogPostCategory(headers.locale, id);
  };


  @Post()
  @ApiOkResponse({ 
    status: HttpStatus.CREATED, 
    description: RESPONSE_MESSAGES.CATEGORY_CREATED ,
    type: BlogPostCategory,
  })
  @ApiBadRequestResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: RESPONSE_MESSAGES.INVALID_REQUEST 
  })
  @ApiOperation({ summary: 'Create new category', description: 'Endpoint to create a new category' })
  async createCategory(@Body() categoryDto: BlogPostCategoryDto) {
    return this.blogPostCategoryService.createBlogPostCategory(categoryDto);
  };


  @Put(':id')
  @ApiOkResponse({ 
    status: HttpStatus.CREATED, 
    description: RESPONSE_MESSAGES.CATEGORY_UPDATED ,
    type: BlogPostCategory,
  })
  @ApiBadRequestResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: RESPONSE_MESSAGES.INVALID_REQUEST 
  })
  @ApiOperation({ summary: 'Update a category', description: 'Endpoint to update a category' })
  async updateCategory(
    @Param('id') id: string, 
    @Body() updateCategoryDto: BlogPostCategoryDto
  ) {
    return this.blogPostCategoryService.updateBlogPostCategory(updateCategoryDto, id);
  };


  @Delete(':id')
  @ApiOkResponse({ 
    status: HttpStatus.CREATED, 
    description: RESPONSE_MESSAGES.CATEOGRY_DELETED ,
    type: BlogPostCategory,
  })
  @ApiBadRequestResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: RESPONSE_MESSAGES.INVALID_REQUEST 
  })
  @ApiOperation({ summary: 'Delete a category', description: 'Endpoint to delete a category' })
  async deleteCategory(@Param('id') id: string) {
    return this.blogPostCategoryService.deleteBlogPostCategory(id)
  };

};

