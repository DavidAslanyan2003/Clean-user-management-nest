import { Module } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class CategoryModule {}
