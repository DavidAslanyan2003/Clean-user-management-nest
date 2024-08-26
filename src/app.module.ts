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

@Module({
  imports: [
    CategoryModule,
    UserModule,
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
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['content-language', 'lang']),
      ],
    }),
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LocaleMiddleware).forRoutes('*');
  }
}
