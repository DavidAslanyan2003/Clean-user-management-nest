import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AddCategoriesToRedisCommand } from './helpers/classes/commander/add-categories-to-redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorFormatter(errors) {
        return errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints),
        }));
      },
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Icketi API')
    .setDescription('The Icketi API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const updateCategoriesCommand = app.get(AddCategoriesToRedisCommand);
  await updateCategoriesCommand.run();

  await app.listen(3000);
}
bootstrap();
