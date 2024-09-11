import { Command, CommandRunner } from 'nest-commander';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Category } from '../../../category/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { ACTIVE_STATUS } from '../../../helpers/constants/status';
import { fliterCategoryByLanguage } from '../../../helpers/validations/service-helper-functions/category-helper-functions';
import { generateActiveCategoriesCacheKey } from '../../../helpers/constants/constants';

@Command({
  name: 'update-categories',
  description: 'Fetch active categories from DB and store them in cache',
})
export class AddCategoriesToRedisCommand extends CommandRunner {
  private paramsFilePath = path.join(
    'src/helpers/constants/params-config.json',
  );

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super();
  }

  async run(): Promise<void> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const paramsConfig = await this.loadParamsConfig();
    if (!paramsConfig) {
      console.error('Failed to load parameters configuration.');
      return;
    }

    try {
      for (const params of paramsConfig.paramBasicVersions) {
        await this.processParams(params, queryRunner);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async loadParamsConfig(): Promise<{
    paramBasicVersions: any[];
  } | null> {
    try {
      const data = await fs.readFile(this.paramsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading parameters configuration file:', error);
      return null;
    }
  }

  private async processParams(
    params: any,
    queryRunner: QueryRunner,
  ): Promise<void> {
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
}
