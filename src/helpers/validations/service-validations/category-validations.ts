import { BadRequestException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Category } from 'src/category/entities/category.entity';
import { ERROR_FILE_NAME } from 'src/helpers/constants/constants';

export function checkCategoryExistance(categories: Category[]): void {
  if (!categories || categories.length === 0 || !categories[0]) {
    const i18n = I18nContext.current();

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
