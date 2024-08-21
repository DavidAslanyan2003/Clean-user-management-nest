import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch(HttpException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const i18n = I18nContext.current();

    const status = exception.getStatus();

    const errors = exception['errors'];

    const errorFileKeys: any[] = [];
    for (const error of errors) {
      errorFileKeys.push({
        [error['property']]: Object.values(error['constraints']),
      });
    }

    const errorMessages = this.getErrorMessage(errorFileKeys, i18n);

    response.status(status).json({
      statusCode: status,
      message: exception.getResponse(),
      ...errorMessages,
    });
  }

  private getErrorMessage(
    errorFileKeys: any[],
    i18n: I18nContext,
  ): { errors?: string[] } {
    const errorMessages: string[] = [];
    errorFileKeys.forEach((errors) => {
      const property = Object.keys(errors)[0];

      const messages: string[] = errors[property];
      messages.forEach((fileName) =>
        errorMessages.push(
          i18n.translate(fileName, {
            lang: i18n.lang,
            args: {
              property: property,
            },
          }),
        ),
      );
    });

    return { errors: errorMessages };
  }
}
