import { BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BlogCategory } from 'src/blog/entities/blog-category.entity';
import { ERROR_FILE_PATH } from 'src/helpers/constants/constants';
import { QueryRunner } from 'typeorm';

export async function checkBlogCategoryUniqueness(
  queryRunner: QueryRunner,
  name: Record<string, any>,
  i18n: I18nService<Record<string, any>>,
  locale: string,
  id?: string,
): Promise<void> {
  const queryBuilder = queryRunner.manager
    .getRepository(BlogCategory)
    .createQueryBuilder('blogCategory');

  Object.entries(name).forEach(([key, value]) => {
    queryBuilder.andWhere(`blogCategory.category ->> :key = :value`, {
      key,
      value,
    });
  });

  if (id) {
    queryBuilder.andWhere('blogCategory.id != :id', { id });
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
