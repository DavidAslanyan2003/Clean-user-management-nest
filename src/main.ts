import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

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
  await app.listen(3000);
}
bootstrap();
