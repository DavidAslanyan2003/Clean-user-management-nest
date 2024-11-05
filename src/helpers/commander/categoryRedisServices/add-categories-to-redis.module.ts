import { Module } from '@nestjs/common';
import { UpdateCategoriesCacheCommand } from './add-categories-to-redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../../category/entities/category.entity';
import { User } from '../../../user/user.entity';
import { RedisModule } from '../../../helpers/redis/redis.module';
import { Event } from '../../../event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User, Event]), RedisModule],
  controllers: [],
  providers: [UpdateCategoriesCacheCommand],
  exports: [UpdateCategoriesCacheCommand],
})
export class UpdateCategoriesCacheModule {}
