import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DEFAULT_LANGUAGE } from './constants';

export const RequiredLocale: string[] = ['en', 'hy'];

export const Locale = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.headers['accept-language'] || DEFAULT_LANGUAGE;
  },
);
