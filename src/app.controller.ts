import { Controller, Get, Req } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(private readonly i18n: I18nService) {}

  // @Get()
  // getHello(@Req() req: Request): string {
  //   const lang = req['language'];

  //   return this.i18n.translate('test.HELLO', { lang });
  // }
}
