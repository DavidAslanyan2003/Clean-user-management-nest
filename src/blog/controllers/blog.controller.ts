import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BlogService } from '../services/blog.service';
import { RESPONSE_MESSAGES } from '../../helpers/response/response-messages';
import { Blog } from '../entities/blog.entity';
import { BlogDto } from '../dtos/blog.dto';
import { UpdateBlogDto } from '../dtos/update-blog.dto';
import { CheckUUIDPipe } from '../../helpers/validations/pipes/check-uuid-pipe';

@Controller('api/v1/blog')
@ApiTags('Blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get('list')
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.GET_BLOG_POSTS_SUCCESS,
    type: Blog,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.GET_BLOG_POSTS_FAIL,
  })
  @ApiOperation({
    summary: 'Get all blogs',
    description: 'Endpoint to get all blogs',
  })
  async getAllBlogPosts(@Query('short') short?: boolean) {
    return this.blogService.getAllBlogs(short);
  }

  @Get()
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.BLOG_POST_FETCHED,
    type: Blog,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.INVALID_REQUEST,
  })
  @ApiOperation({
    summary: 'Get a blog post',
    description: 'Endpoint to get a blog post',
  })
  @ApiQuery({ name: 'blogId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'forEdit', required: false })
  async getBlogPost(
    @Query('blogId', CheckUUIDPipe) blogId?: string,
    @Query('categoryId', CheckUUIDPipe) categoryId?: string,
    @Query('userId', CheckUUIDPipe) userId?: string,
    @Query('short') short?: boolean,
    @Query('forEdit') forEdit?: boolean,
  ) {
    return this.blogService.getBlog(blogId, categoryId, userId, short, forEdit);
  }

  @Post()
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.BLOG_POST_CREATED,
    type: Blog,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.INVALID_REQUEST,
  })
  @ApiOperation({
    summary: 'Create a blog post',
    description: 'Endpoint to create a blog post',
  })
  async createBlogPost(@Body() blogDto: BlogDto) {
    const userId = '60bbd60c-ce41-4a71-bd60-ee61648a1bcf';
    return this.blogService.createBlog(blogDto, userId);
  }

  @Post('/publish/:id')
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.BLOG_PUBLISHED,
    type: Blog,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.INVALID_REQUEST,
  })
  @ApiOperation({
    summary: 'Publish a blog post',
    description: 'Endpoint to publish a blog post',
  })
  async publishBlogPost(@Param('id', CheckUUIDPipe) blogId: string) {
    return this.blogService.publishBlog(blogId);
  }

  @Put(':id')
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.BLOG_POST_UPDATED,
    type: Blog,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.INVALID_REQUEST,
  })
  @ApiOperation({
    summary: 'Update a blog post',
    description: 'Endpoint to update a blog post',
  })
  async updateBlogPost(
    @Param('id', CheckUUIDPipe) blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(updateBlogDto, blogId);
  }

  @Delete(':id')
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.BLOG_POST_DELETED,
    type: Blog,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.INVALID_REQUEST,
  })
  @ApiOperation({
    summary: 'Delete a blog post',
    description: 'Endpoint to delete a blog post',
  })
  async deleteBlogPost(@Param('id', CheckUUIDPipe) id: string) {
    return this.blogService.deleteBlog(id);
  }
}
