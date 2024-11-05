import { BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ERROR_FILE_PATH } from 'src/helpers/constants/constants';

export function checkTagName(
  tagName: string,
  locale: string,
  i18n: I18nService,
) {
  if (!tagName) {
    throw new BadRequestException(
      i18n.translate(`${ERROR_FILE_PATH}.INVALID_INPUT`, {
        lang: locale,
      }),
    );
  }
}

export function checkTagInfo(tagInfo: any, locale: string, i18n: I18nService) {
  if (!tagInfo) {
    throw new BadRequestException(
      i18n.translate(`${ERROR_FILE_PATH}.ITEM_NOT_FOUND`, {
        lang: locale,
      }),
    );
  }
}
