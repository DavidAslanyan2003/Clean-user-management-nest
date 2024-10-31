import { Module } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { CategoryService } from '../services/category.service';
import { CategoryController } from '../controllers/category.controller';
import { UpdateCategoriesCacheModule } from '../../helpers/commander/categoryRedisServices/add-categories-to-redis.module';
import { RedisModule } from 'src/helpers/redis/redis.module';
import { Event } from '../../event/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, User, Event]),
    UpdateCategoriesCacheModule,
    RedisModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [TypeOrmModule],
})
export class CategoryModule {}
