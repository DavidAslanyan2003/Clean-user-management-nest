import { Command, CommandRunner } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { Category } from '../../../category/entities/category.entity';
import {
  ACTIVE_STATUS,
  INACTIVE_STATUS,
} from '../../../helpers/constants/status';
import { fliterCategoryByLanguage } from '../../../helpers/validations/service-helper-functions/category-helper-functions';
import {
  generateActiveCategoriesCacheKey,
  generateInactiveCategoriesCacheKey,
  generateCategoriesWithGivenNameCacheKey,
  extractParamsFromUrl,
  extractParamsFromUrlWithName,
} from './category-redis-helpers';
import { RedisService } from '../../../helpers/redis/redis.service';

@Command({
  name: 'update-categories',
  description: 'Fetch active categories from DB and store them in cache',
})
export class UpdateCategoriesCacheCommand extends CommandRunner {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly redisService: RedisService,
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

    const { activeKeys, inactiveKeys, givenByNameKeys } =
      await this.categorizeRedisKeys();

    try {
      if (updateActiveCategories && activeKeys.length) {
        for (const key of activeKeys) {
          const params = extractParamsFromUrl(key);
          await this.updateActiveCategories(params, queryRunner);
        }
      }
      if (updateInactiveCategories && inactiveKeys.length) {
        for (const key of inactiveKeys) {
          const params = extractParamsFromUrl(key);
          await this.updateInactiveCategories(params, queryRunner);
        }
      }
      if (updateCategoriesWithGivenNamed && givenByNameKeys.length) {
        for (const key of givenByNameKeys) {
          const params = extractParamsFromUrlWithName(key);
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

    await this.redisService.setCache(
      cacheKey,
      JSON.stringify({
        categories: localizedCategory,
        total,
      }),
    );
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

    await this.redisService.setCache(
      cacheKey,
      JSON.stringify({
        categories: localizedCategory,
        total,
      }),
    );
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

    await this.redisService.setCache(
      cacheKey,
      JSON.stringify({
        categories: localizedCategory,
        total,
      }),
    );
  }

  private async categorizeRedisKeys(): Promise<{
    activeKeys: string[];
    inactiveKeys: string[];
    givenByNameKeys: string[];
  }> {
    const redis = this.redisService.getClient();

    const allKeys: string[] = [];

    let cursor = '0';
    do {
      const [newCursor, keys] = await redis.scan(
        cursor,
        'MATCH',
        'http://api.icketi.am/api/v1/category*',
        'COUNT',
        100,
      );
      cursor = newCursor;
      allKeys.push(...keys);
    } while (cursor !== '0');

    const activeKeys: string[] = [];
    const inactiveKeys: string[] = [];
    const givenByNameKeys: string[] = [];

    allKeys.forEach((key) => {
      if (key.includes('/inactive')) {
        inactiveKeys.push(key);
      } else if (key.includes('/category/')) {
        givenByNameKeys.push(key);
      } else {
        activeKeys.push(key);
      }
    });
    return { activeKeys, inactiveKeys, givenByNameKeys };
  }
}
