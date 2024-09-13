import { Module } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { CategoryService } from '../services/category.service';
import { CategoryController } from '../controllers/category.controller';
import { AddCategoriesToRedisModule } from '../../helpers/classes/commander/categoryRedisServices/update-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, User]),
    AddCategoriesToRedisModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [TypeOrmModule],
})
export class CategoryModule {}
