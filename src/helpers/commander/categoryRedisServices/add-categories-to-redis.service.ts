import { Command, CommandRunner } from 'nest-commander';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { promises as fs } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { Category } from '../../../category/entities/category.entity';
import {
  generateActiveCategoriesCacheKey,
  generateInactiveCategoriesCacheKey,
  generateCategoriesWithGivenNameCacheKey,
  activeCategoryParamsFilePath,
  inactiveCategoryParamsFilePath,
  categoriesWithGivenNameParamsFilePath,
} from 'src/helpers/constants/constants';
import {
  ACTIVE_STATUS,
  INACTIVE_STATUS,
} from '../../../helpers/constants/status';
import { fliterCategoryByLanguage } from '../../../helpers/validations/service-helper-functions/category-helper-functions';

@Command({
  name: 'update-categories',
  description: 'Fetch active categories from DB and store them in cache',
})
export class UpdateCategoriesCacheCommand extends CommandRunner {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const updateActiveCategories = passedParams.includes('--active');
    const updateInactiveCategories = passedParams.includes('--inactive');
    const updateCategoriesWithGivenNamed = passedParams.includes('--named');

    try {
      if (updateActiveCategories) {
        const activeCategoryParams = await this.loadCategoryParamsConfig(
          activeCategoryParamsFilePath,
        );

        for (const params of activeCategoryParams.paramBasicVersions) {
          await this.updateActiveCategories(params, queryRunner);
        }
      }
      if (updateInactiveCategories) {
        const inactiveCategoriesParams = await this.loadCategoryParamsConfig(
          inactiveCategoryParamsFilePath,
        );

        for (const params of inactiveCategoriesParams.paramBasicVersions) {
          await this.updateInactiveCategories(params, queryRunner);
        }
      }
      if (updateCategoriesWithGivenNamed) {
        const categoriesWithGivenNameParams =
          await this.loadCategoryParamsConfig(
            categoriesWithGivenNameParamsFilePath,
          );

        for (const params of categoriesWithGivenNameParams.paramBasicVersions) {
          await this.updateCategroiesWithGivenName(params, queryRunner);
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async loadCategoryParamsConfig(paramsFilePath: string): Promise<{
    paramBasicVersions: any[];
  } | null> {
    const data = await fs.readFile(paramsFilePath, 'utf8');
    return JSON.parse(data);
  }

  private async updateActiveCategories(params: any, queryRunner: QueryRunner) {
    const { page, limit, orderBy, order, locale } = params;

    const offset = (page - 1) * limit;
    const sortOrder = order === 'descend' ? 'DESC' : 'ASC';

    const cacheKey = generateActiveCategoriesCacheKey(
      page,
      limit,
      orderBy,
      sortOrder,
      locale,
    );

    const [categories, total] = await queryRunner.manager
      .getRepository(Category)
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.user', 'user')
      .where('category.status = :ACTIVE_STATUS', { ACTIVE_STATUS })
      .orderBy(`category.${orderBy}`, sortOrder)
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const localizedCategory = categories.reduce((acc, category) => {
      acc.push(fliterCategoryByLanguage(locale, category));
      return acc;
    }, []);

    await this.cacheManager.set(cacheKey, {
      categories: localizedCategory,
      total,
    });
  }

  private async updateInactiveCategories(
    params: any,
    queryRunner: QueryRunner,
  ) {
    const { page, limit, orderBy, order, locale } = params;

    const offset = (page - 1) * limit;
    const sortOrder = order === 'descend' ? 'DESC' : 'ASC';

    const cacheKey = generateInactiveCategoriesCacheKey(
      page,
      limit,
      orderBy,
      sortOrder,
      locale,
    );

    const [categories, total] = await queryRunner.manager
      .getRepository(Category)
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.user', 'user')
      .where('category.status = :INACTIVE_STATUS', { INACTIVE_STATUS })
      .orderBy(`category.${orderBy}`, sortOrder)
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const localizedCategory = categories.reduce((acc, category) => {
      acc.push(fliterCategoryByLanguage(locale, category));
      return acc;
    }, []);

    await this.cacheManager.set(cacheKey, {
      categories: localizedCategory,
      total,
    });
  }

  private async updateCategroiesWithGivenName(
    params: any,
    queryRunner: QueryRunner,
  ) {
    const { page, limit, orderBy, order, locale, name } = params;

    const offset = (page - 1) * limit;
    const sortOrder = order === 'descend' ? 'DESC' : 'ASC';
    const cacheKey = generateCategoriesWithGivenNameCacheKey(
      page,
      limit,
      orderBy,
      sortOrder,
      locale,
      name,
    );

    const [categories, total] = await queryRunner.manager
      .getRepository(Category)
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.user', 'user')
      .where('category.name ->> :locale = :name', {
        locale,
        name,
      })
      .orderBy(`category.${orderBy}`, sortOrder)
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const localizedCategory = categories.reduce((acc, category) => {
      acc.push(fliterCategoryByLanguage(locale, category));
      return acc;
    }, []);

    await this.cacheManager.set(cacheKey, {
      categories: localizedCategory,
      total,
    });
  }
}
