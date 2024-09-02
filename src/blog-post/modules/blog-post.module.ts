import { Module } from '@nestjs/common';
import { BlogPost } from '../entities/blog-post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { BlogPostCategory } from 'src/blog-post-category/entities/blog-post-category.entity';
import { BlogPostController } from '../controllers/blog-post.controller';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPostCategoryService } from 'src/blog-post-category/services/blog-post-category.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([BlogPost, User, BlogPostCategory])
  ],
  controllers: [BlogPostController],
  providers: [BlogPostService, BlogPostCategoryService],
  exports: [TypeOrmModule],

})
export class BlogPostModule {};
