import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';
import { ERROR_FILE_NAMES_PATH } from 'src/helpers/constants/constants';

@Injectable()
export class CheckUUIDPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (value != undefined && !isUUID(value)) {
      const i18n = I18nContext.current();

      const message = i18n.translate(
        `${ERROR_FILE_NAMES_PATH}.ITEM_NOT_FOUND`,
        {
          lang: i18n.lang,
        },
      );

      throw new BadRequestException(message);
    }
    return value;
  }
}
