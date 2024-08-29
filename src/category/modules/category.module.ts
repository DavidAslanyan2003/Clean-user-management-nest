import { Module } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { CategoryService } from '../services/category.service';
import { CategoryController } from '../controllers/category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [TypeOrmModule],
})
export class CategoryModule {}
