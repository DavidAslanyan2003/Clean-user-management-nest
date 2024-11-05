import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Category } from '../category/entities/category.entity';
import { Event } from '../event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, Event])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class UserModule {}
