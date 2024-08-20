import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LocaleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const language = req.headers['Content-language'] as string | undefined;

    if (language) {
      req['language'] = language.split(',')[0];
    } else {
      req['language'] = 'en';
    }

    next();
  }
}
