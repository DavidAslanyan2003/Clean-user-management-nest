import { BadRequestException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Category } from 'src/category/entities/category.entity';
import {
  DEFAULT_LANGUAGE,
  ERROR_FILE_PATH,
  SUCCESS_FILE_PATH,
} from 'src/helpers/constants/constants';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from 'src/helpers/constants/status';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import { QueryRunner } from 'typeorm';

export function checkItemExistance(
  item: any,
  i18n: I18nService<Record<string, any>>,
  locale: string,
): void {
  if (!item) {
    const message = i18n.translate(`${ERROR_FILE_PATH}.ITEM_NOT_FOUND`, {
      lang: locale,
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

export function translatedSuccessResponse<T>(
  i18n: I18nService<Record<string, any>>,
  locale: string,
  successName: string,
  data: any,
): CustomResponse<T> {
  const successMessage = i18n.translate(`${SUCCESS_FILE_PATH}.${successName}`, {
    lang: locale,
  });

  return new CustomResponse<T>(SUCCESS_MESSAGE, data, null, successMessage);
}

export function translatedErrorResponse<T>(
  i18n: I18nService<Record<string, any>> | I18nContext<Record<string, any>>,
  locale: string,
  errorName: string,
  error?: any,
): CustomResponse<T> {
  const errorMessage = i18n.translate(`${ERROR_FILE_PATH}.${errorName}`, {
    lang: locale,
  });
  const message = error ? error.message : null;

  return new CustomResponse<T>(ERROR_MESSAGE, message, errorMessage);
}

export async function checkNameUniqueness(
  queryRunner: QueryRunner,
  name: Record<string, any>,
  i18n: I18nService<Record<string, any>>,
  locale: string,
  id?: string,
): Promise<void> {
  const queryBuilder = queryRunner.manager
    .getRepository(Category)
    .createQueryBuilder('category');

  Object.entries(name).forEach(([key, value]) => {
    queryBuilder.andWhere(`category.name ->> :key = :value`, { key, value });
  });

  if (id) {
    queryBuilder.andWhere('category.id != :id', { id });
  }
  const count = await queryBuilder.getCount();

  if (count > 0) {
    throw new BadRequestException(
      i18n.translate(`${ERROR_FILE_PATH}.DUPLICATE_NAME`, {
        lang: locale,
      }),
    );
  }
}
