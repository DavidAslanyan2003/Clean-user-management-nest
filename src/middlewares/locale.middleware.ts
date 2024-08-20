import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LocaleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const acceptLanguage = req.headers['locale'] as string | undefined;

    if (acceptLanguage) {
      req['language'] = acceptLanguage.split(',')[0];
    } else {
      req['language'] = 'en';
    }

    next();
  }
}
