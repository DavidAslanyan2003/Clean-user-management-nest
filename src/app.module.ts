import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  I18nModule,
  I18nJsonLoader,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { LocaleMiddleware } from './middlewares/locale.middleware';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/typeorm';
import { MediaModule } from './media/media.module';
import { CategoryModule } from './category/modules/category.module';
import { UserModule } from './user/user.module';
import { DEFAULT_LANGUAGE } from './helpers/constants/constants';
import { BlogModule } from './blog/modules/blog.module';
import { BlogCategoryModule } from './blog/modules/blog-category.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { UpdateCategoriesCacheModule } from './helpers/commander/categoryRedisServices/add-categories-to-redis.module';
import { RedisModule } from './helpers/redis/redis.module';
import { FormsModule } from './forms/modules/forms.module';
import { EventModule } from './event/modules/event.module';

@Module({
  imports: [
    BlogModule,
    BlogCategoryModule,
    CategoryModule,
    FormsModule,
    UserModule,
    EventModule,
    UpdateCategoriesCacheModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),
    I18nModule.forRoot({
      fallbackLanguage: DEFAULT_LANGUAGE,
      loaderOptions: {
        path: path.join(__dirname, '../src/i18n/'),
        watch: true,
      },
      loader: I18nJsonLoader,
      resolvers: [
        new QueryResolver(['lang', 'locale', 'l']),
        new HeaderResolver(['content-language']),
      ],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 0,
    }),
    MediaModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LocaleMiddleware).forRoutes('*');
  }
}
