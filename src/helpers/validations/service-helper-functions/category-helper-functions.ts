import { BadRequestException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Category } from 'src/category/entities/category.entity';
import {
  DEFAULT_LANGUAGE,
  ERROR_FILE_PATH,
  SUCCESS_FILE_PATH,
} from 'src/helpers/constants/constants';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';

export function checkItemExistance(
  item: any,
  i18n: I18nContext<Record<string, any>>,
): void {
  if (!item) {
    const message = i18n.translate(`${ERROR_FILE_PATH}.ITEM_NOT_FOUND`, {
      lang: i18n.lang,
    });

    throw new BadRequestException(message);
  }
}

export function fliterCategoryByLanguage(
  locale: string,
  category: Category,
): Category {
  if (category.name[locale]) {
    category.name = category.name[locale];
    if (category.description) {
      category.description = category.description[locale];
    }
  } else {
    category.name = category.name[DEFAULT_LANGUAGE];
    if (category.description) {
      category.description = category.description[DEFAULT_LANGUAGE];
    }
  }

  return category;
}

export function translatedErrorResponse(
  i18n: I18nContext<Record<string, any>>,
  locale: string,
  errorName: string,
  error: any,
): any {
  const message = i18n.translate(`${ERROR_FILE_PATH}.ERROR_MESSAGE`, {
    lang: locale,
  });

  const errorMessage = i18n.translate(`${ERROR_FILE_PATH}.${errorName}`, {
    lang: locale,
  });

  return new CustomResponse<Category>(message, error.message, errorMessage);
}

export function createSuccessMessage(
  i18n: I18nContext<Record<string, any>>,
  locale: string,
): string {
  return i18n.translate(`${SUCCESS_FILE_PATH}.SUCCESS_MESSAGE`, {
    lang: locale,
  });
}
