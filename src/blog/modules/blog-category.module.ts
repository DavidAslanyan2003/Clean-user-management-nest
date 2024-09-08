import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategory } from '../entities/blog-category.entity';
import { BlogCategoryController } from '../controllers/blog-category.controller';
import { BlogCategoryService } from '../services/blog-category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogCategory])
  ],
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService]
})
export class BlogCategoryModule {};
