import { Controller, Get, HttpStatus, Headers, Query, Post, Body, Request, Param, Put, Delete } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { BlogPostService } from "../services/blog-post.service";
import { RESPONSE_MESSAGES } from "src/helpers/response/response-messages";
import { BlogPost } from "../entities/blog-post.entity";
import { BlogPostDto } from "../dtos/blog-post.dto";
import { UpdateBlogPostDto } from "../dtos/update-blog-post.dto";


@Controller('api/v1/blog-post')
@ApiTags('Blog-post')
export class BlogPostController {
  constructor(private blogPostService: BlogPostService) {}

  @Get('list')
  @ApiOkResponse({ 
    status: HttpStatus.CREATED, 
    description: RESPONSE_MESSAGES.GET_BLOG_POSTS_SUCCESS ,
    type: BlogPost,
  })
  @ApiBadRequestResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: RESPONSE_MESSAGES.GET_BLOG_POSTS_FAIL
  })
  @ApiOperation({ summary: 'Get all blog posts', description: 'Endpoint to get all blog posts' })
  async getAllBlogPosts(
    @Headers() headers: any,
    @Query('short') short?: boolean
  ) {
    return this.blogPostService.getAllBlogPosts(headers.locale, short);
  };


  @Get()
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.BLOG_POST_FETCHED,
    type: BlogPost,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.INVALID_REQUEST,
  })
  @ApiOperation({ summary: 'Get a blog post', description: 'Endpoint to get a blog post' })
  @ApiQuery({ name: 'blogPostId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'forEdit', required: false })
  async getBlogPost(
    @Headers() headers: any,
    @Query('blogPostId') blogPostId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('userId') userId?: string,
    @Query('short') short?: boolean,
    @Query('forEdit') forEdit?: boolean
  ) {
    return this.blogPostService.getBlogPost(headers.locale, blogPostId, categoryId, userId, short, forEdit);
  };


  @Post()
  @ApiOkResponse({ 
    status: HttpStatus.CREATED, 
    description: RESPONSE_MESSAGES.BLOG_POST_CREATED ,
    type: BlogPost,
  })
  @ApiBadRequestResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: RESPONSE_MESSAGES.INVALID_REQUEST 
  })
  @ApiOperation({ summary: 'Create a blog post', description: 'Endpoint to create a blog post' })
  async createBlogPost(@Request() request: any, @Body() blogPostDto: BlogPostDto) {
    const userId = "60bbd60c-ce41-4a71-bd60-ee61648a1bcf"; 
    return this.blogPostService.createBlogPost(blogPostDto, userId);
  };


  @Post('/publish/:id')
  @ApiOkResponse({ 
    status: HttpStatus.CREATED, 
    description: RESPONSE_MESSAGES.BLOG_PUBLISHED ,
    type: BlogPost,
  })
  @ApiBadRequestResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: RESPONSE_MESSAGES.INVALID_REQUEST 
  })
  @ApiOperation({ summary: 'Publish a blog post', description: 'Endpoint to publish a blog post' })
  async publishBlogPost(
    @Param('id') blogPostId: string,
  ) {
    return this.blogPostService.publishBLogPost(blogPostId);
  };


  @Put(':id')
  @ApiOkResponse({ 
    status: HttpStatus.CREATED, 
    description: RESPONSE_MESSAGES.BLOG_POST_UPDATED ,
    type: BlogPost,
  })
  @ApiBadRequestResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: RESPONSE_MESSAGES.INVALID_REQUEST 
  })
  @ApiOperation({ summary: 'Update a blog post', description: 'Endpoint to update a blog post' })
  async updateBlogPost(
    @Param('id') blogPostId: string, 
    @Body() updateBlogPostDto: UpdateBlogPostDto
  ) {
    return this.blogPostService.updateBlogPost(updateBlogPostDto, blogPostId);
  };


  @Delete(':id')
  @ApiOkResponse({ 
    status: HttpStatus.CREATED, 
    description: RESPONSE_MESSAGES.BLOG_POST_DELETED ,
    type: BlogPost,
  })
  @ApiBadRequestResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: RESPONSE_MESSAGES.INVALID_REQUEST 
  })
  @ApiOperation({ summary: 'Delete a blog post', description: 'Endpoint to delete a blog post' })
  async deleteBlogPost(@Param('id') id: string) {
    return this.blogPostService.deleteBlogPost(id);
  };
}