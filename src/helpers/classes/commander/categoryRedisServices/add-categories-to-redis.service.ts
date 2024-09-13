import { Command, CommandRunner } from 'nest-commander';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Category } from '../../../../category/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { ACTIVE_STATUS, INACTIVE_STATUS } from '../../../constants/status';
import { fliterCategoryByLanguage } from '../../../validations/service-helper-functions/category-helper-functions';
import {
  generateActiveCategoriesCacheKey,
  generateNamedCategoriesCacheKey,
  generateInactiveCategoriesCacheKey,
} from '../../../constants/constants';

@Command({
  name: 'update-categories',
  description: 'Fetch active categories from DB and store them in cache',
})
export class UpdateCategoriesCacheCommand extends CommandRunner {
  private activeCategoryParamsFilePath = path.join(
    'src/helpers/constants/active-category-params.json',
  );
  private namedCategoryParamsPath = path.join(
    'src/helpers/constants/named-category-params.json',
  );
  private inactiveCategoryParamsFilePath = path.join(
    'src/helpers/constants/inactive-category-params.json',
  );

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

    const updateActive = passedParams.includes('--active');
    const updateInactive = passedParams.includes('--inactive');
    const updateNamed = passedParams.includes('--named');

    try {
      if (updateActive) {
        const activeCategoryParams = await this.loadCategoryParamsConfig(
          this.activeCategoryParamsFilePath,
        );

        for (const params of activeCategoryParams.paramBasicVersions) {
          await this.saveActiveCategories(params, queryRunner);
        }
      }
      if (updateInactive) {
        const inactiveCategoriesParams = await this.loadCategoryParamsConfig(
          this.inactiveCategoryParamsFilePath,
        );

        for (const params of inactiveCategoriesParams.paramBasicVersions) {
          await this.saveInactiveCategories(params, queryRunner);
        }
      }
      if (updateNamed) {
        const categoriesWithGivenNameParams =
          await this.loadCategoryParamsConfig(this.namedCategoryParamsPath);

        for (const params of categoriesWithGivenNameParams.paramBasicVersions) {
          await this.saveNamedCategroies(params, queryRunner);
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

  private async saveActiveCategories(params: any, queryRunner: QueryRunner) {
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

  private async saveInactiveCategories(params: any, queryRunner: QueryRunner) {
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

  private async saveNamedCategroies(params: any, queryRunner: QueryRunner) {
    const { page, limit, orderBy, order, locale, name } = params;

    const offset = (page - 1) * limit;
    const sortOrder = order === 'descend' ? 'DESC' : 'ASC';
    const cacheKey = generateNamedCategoriesCacheKey(
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
