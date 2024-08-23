import { BadRequestException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Category } from 'src/category/entities/category.entity';
import {
  ERROR_FILE_NAME,
  SUCCESS_FILE_NAME,
} from 'src/helpers/constants/constants';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';

export function checkCategoriesExistance(
  categories: Category[],
  i18n: I18nContext<Record<string, any>>,
): void {
  if (categories.length === 0) {
    const message = i18n.translate(`${ERROR_FILE_NAME}.ITEM_NOT_FOUND`, {
      lang: i18n.lang,
    });

    throw new BadRequestException(message);
  }
}

export function checkSingleCategoryExistance(
  categories: Category,
  i18n: I18nContext<Record<string, any>>,
): void {
  if (!categories) {
    const message = i18n.translate(`${ERROR_FILE_NAME}.ITEM_NOT_FOUND`, {
      lang: i18n.lang,
    });

    throw new BadRequestException(message);
  }
}

export function assignLanguageToCategory(
  locale: string,
  category: Category,
): Category {
  category.name = category.name[locale];
  if (category.description) {
    category.description = category.description[locale];
  }

  return category;
}

export function localizedErrorResponse(
  i18n: I18nContext<Record<string, any>>,
  locale: string,
  errorName: string,
  error: any,
): any {
  const message = i18n.translate(`${ERROR_FILE_NAME}.ERROR_MESSAGE`, {
    lang: locale,
  });

  const errorMessage = i18n.translate(`${ERROR_FILE_NAME}.${errorName}`, {
    lang: locale,
  });

  return new CustomResponse<Category>(
    message,
    null,
    error.message,
    errorMessage,
  );
}

export function successMessage(
  i18n: I18nContext<Record<string, any>>,
  locale: string,
): string {
  return i18n.translate(`${SUCCESS_FILE_NAME}.SUCCESS_MESSAGE`, {
    lang: locale,
  });
}
