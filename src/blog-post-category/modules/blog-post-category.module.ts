import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPostCategory } from '../entities/blog-post-category.entity';
import { BlogPostCategoryController } from '../controllers/blog-post-category.controller';
import { BlogPostCategoryService } from '../services/blog-post-category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogPostCategory])
  ],
  controllers: [BlogPostCategoryController],
  providers: [BlogPostCategoryService]
})
export class BlogPostCategoryModule {};
