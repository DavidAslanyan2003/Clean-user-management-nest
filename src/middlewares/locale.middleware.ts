import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DEFAULT_LANGUAGE } from '../helpers/constants/constants';

@Injectable()
export class LocaleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['language'] = req.headers['content-language'] || DEFAULT_LANGUAGE;

    next();
  }
}
