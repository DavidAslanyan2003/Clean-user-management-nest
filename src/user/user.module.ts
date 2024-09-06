import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class UserModule {}
