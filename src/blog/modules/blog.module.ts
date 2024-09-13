import { Module } from '@nestjs/common';
import { Blog } from '../entities/blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../../user/user.entity';
import { BlogController } from '../controllers/blog.controller';
import { BlogService } from '../services/blog.service';
import { BlogCategory } from '../entities/blog-category.entity';
import { BlogCategoryService } from '../services/blog-category.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Blog, User, BlogCategory]),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogCategoryService],
  exports: [TypeOrmModule],
})
export class BlogModule {}
