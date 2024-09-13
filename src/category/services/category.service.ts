import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryDto } from '../dtos/category.dto';
import { I18nService } from 'nestjs-i18n';
import { CustomResponse } from '../../helpers/response/custom-response.dto';
import { User } from '../../user/user.entity';
import {
  fliterCategoryByLanguage,
  checkItemExistance,
  translatedErrorResponse,
  checkNameUniqueness,
  translatedSuccessResponse,
} from '../../helpers/validations/service-helper-functions/category-helper-functions';
import { UpdateStatusDto } from '../dtos/update-status.dto';
import {
  ACTIVE_STATUS,
  INACTIVE_STATUS,
  CategoryStatus,
} from '../../helpers/constants/status';
import { REQUEST } from '@nestjs/core';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { UpdateCategoriesCacheCommand } from '../../helpers/classes/commander/categoryRedisServices/add-categories-to-redis.service';
import {
  generateActiveCategoriesCacheKey,
  generateNamedCategoriesCacheKey,
  generateInactiveCategoriesCacheKey,
} from '../../helpers/constants/constants';

@Injectable({ scope: Scope.REQUEST })
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly i18n: I18nService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly updateCategoriesCommand: UpdateCategoriesCacheCommand,
  ) {}

  async createCategory(
    newCategory: CategoryDto,
  ): Promise<CustomResponse<Category>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const locale = this.request['language'];

    try {
      const users = await queryRunner.manager.getRepository(User).find();

      await checkNameUniqueness(
        queryRunner,
        newCategory.name,
        this.i18n,
        locale,
      );

      const newCategoryEntity = queryRunner.manager
        .getRepository(Category)
        .create({
          name: newCategory.name,
          description: newCategory.description,
          category_icon: newCategory.categoryIcon,
          category_image: newCategory.categoryImage,
          user: users[0],
        });
      const savedCategory = await this.categoryRepository.save(
        newCategoryEntity,
      );
      const resultedCategory = await this.categoryRepository.findOne({
        where: { id: savedCategory.id },
        relations: ['user'],
      });
      const localizedCategory = fliterCategoryByLanguage(
        locale,
        resultedCategory,
      );

      await this.updateCategoriesCommand.run([
        '--active',
        '--inactive',
        '--named',
      ]);

      await queryRunner.commitTransaction();

      return translatedSuccessResponse<Category>(
        this.i18n,
        locale,
        'CATEGORY_CREATED_SUCCESS',
        localizedCategory,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse<Category>(
        this.i18n,
        locale,
        'FAILED_CREATE_CATEGORY',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getActiveCategories(
    page: number,
    limit: number,
    orderBy: string,
    order: string,
  ): Promise<CustomResponse<{ categories: Category[]; total: number }>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    page = page || 1;
    limit = limit || 10;
    const offset = (page - 1) * limit;
    orderBy = orderBy || 'id';
    const sortOrder = order === 'descend' ? 'DESC' : 'ASC';

    const locale = this.request['language'];
    const cacheKey = generateActiveCategoriesCacheKey(
      page,
      limit,
      orderBy,
      sortOrder,
      locale,
    );

    try {
      let cachedCategories = await this.cacheManager.get<{
        categories: Category[];
        total: number;
      }>(cacheKey);

      if (cachedCategories) {
        return translatedSuccessResponse<{
          categories: Category[];
          total: number;
        }>(this.i18n, locale, 'CATEGORY_FETCHED_SUCCESS', cachedCategories);
      }

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

      await queryRunner.commitTransaction();

      return translatedSuccessResponse<{
        categories: Category[];
        total: number;
      }>(this.i18n, locale, 'CATEGORY_FETCHED_SUCCESS', {
        categories: localizedCategory,
        total,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse<{ categories: Category[]; total: number }>(
        this.i18n,
        locale,
        'FAILED_GET_CATEGORY',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getCategoryByName(
    page: number,
    limit: number,
    orderBy: string,
    order: string,
    name: string,
  ): Promise<CustomResponse<{ categories: Category[]; total: number }>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    page = page || 1;
    limit = limit || 10;
    const offset = (page - 1) * limit;
    orderBy = orderBy || 'id';
    const sortOrder = order === 'descend' ? 'DESC' : 'ASC';

    name = name.replaceAll('-', ' ');

    const locale = this.request['language'];
    const cacheKey = generateNamedCategoriesCacheKey(
      page,
      limit,
      orderBy,
      sortOrder,
      locale,
      name,
    );

    try {
      let cachedCategories = await this.cacheManager.get<{
        categories: Category[];
        total: number;
      }>(cacheKey);

      if (cachedCategories) {
        return translatedSuccessResponse<{
          categories: Category[];
          total: number;
        }>(this.i18n, locale, 'CATEGORY_FETCHED_SUCCESS', cachedCategories);
      }

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

      await queryRunner.commitTransaction();

      return translatedSuccessResponse<{
        categories: Category[];
        total: number;
      }>(this.i18n, locale, 'CATEGORY_FETCHED_SUCCESS', {
        categories: localizedCategory,
        total,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse<{ categories: Category[]; total: number }>(
        this.i18n,
        locale,
        'FAILED_GET_CATEGORY',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getCategoryById(
    id: string,
    allLanguages: string,
  ): Promise<CustomResponse<Category>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const locale = this.request['language'];

    const hasAllLanguages = allLanguages === 'true' ? true : false;

    try {
      let category = await queryRunner.manager.getRepository(Category).findOne({
        where: { id: id },
        relations: ['user'],
      });
      checkItemExistance(category, this.i18n, locale);

      if (!hasAllLanguages) {
        category = fliterCategoryByLanguage(locale, category);
      }

      await queryRunner.commitTransaction();

      return translatedSuccessResponse<Category>(
        this.i18n,
        locale,
        'CATEGORY_FETCHED_SUCCESS',
        category,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return translatedErrorResponse<Category>(
        this.i18n,
        locale,
        'FAILED_GET_CATEGORY',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getInactiveCategories(
    page: number,
    limit: number,
    orderBy: string,
    order: string,
  ): Promise<CustomResponse<{ categories: Category[]; total: number }>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    page = page || 1;
    limit = limit || 10;
    const offset = (page - 1) * limit;
    orderBy = orderBy || 'id';
    const sortOrder = order === 'descend' ? 'DESC' : 'ASC';

    const locale = this.request['language'];
    const cacheKey = generateInactiveCategoriesCacheKey(
      page,
      limit,
      orderBy,
      sortOrder,
      locale,
    );

    try {
      let cachedCategories = await this.cacheManager.get<{
        categories: Category[];
        total: number;
      }>(cacheKey);

      if (cachedCategories) {
        return translatedSuccessResponse<{
          categories: Category[];
          total: number;
        }>(this.i18n, locale, 'CATEGORY_FETCHED_SUCCESS', cachedCategories);
      }

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

      await queryRunner.commitTransaction();

      return translatedSuccessResponse<{
        categories: Category[];
        total: number;
      }>(this.i18n, locale, 'CATEGORY_FETCHED_SUCCESS', {
        categories: localizedCategory,
        total,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse<{ categories: Category[]; total: number }>(
        this.i18n,
        locale,
        'FAILED_GET_CATEGORY',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateCategory(
    id: string,
    newCategory: CategoryDto,
  ): Promise<CustomResponse<Category>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const locale = this.request['language'];

    try {
      const newCategoryEntity = await queryRunner.manager
        .getRepository(Category)
        .findOne({
          where: { id: id },
          relations: ['user'],
        });
      checkItemExistance(newCategoryEntity, this.i18n, locale);

      await checkNameUniqueness(
        queryRunner,
        newCategory.name,
        this.i18n,
        locale,
        newCategoryEntity.id,
      );

      newCategoryEntity.name = newCategory.name;
      newCategoryEntity.description = newCategory.description;
      newCategoryEntity.category_icon = newCategory.categoryIcon;
      newCategoryEntity.category_image = newCategory.categoryImage;
      newCategoryEntity.updated_at = new Date();

      const savedCategory = await this.categoryRepository.save(
        newCategoryEntity,
      );
      const localizedCategory = fliterCategoryByLanguage(locale, savedCategory);

      await this.updateCategoriesCommand.run(['--active', '', '--named']);

      await queryRunner.commitTransaction();

      return translatedSuccessResponse<Category>(
        this.i18n,
        locale,
        'CATEGORY_UPDATED_SUCCESS',
        localizedCategory,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse<Category>(
        this.i18n,
        locale,
        'FAILED_UPDATE_CATEGORY',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateStatus(
    id: string,
    newStatus: UpdateStatusDto,
  ): Promise<CustomResponse<Category>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const locale = this.request['language'];

    try {
      const newCategoryEntity = await queryRunner.manager
        .getRepository(Category)
        .findOne({
          where: { id: id },
          relations: ['user'],
        });
      checkItemExistance(newCategoryEntity, this.i18n, locale);

      (newCategoryEntity.status =
        newStatus.status.toLowerCase() === ACTIVE_STATUS.toLowerCase()
          ? CategoryStatus.Active
          : CategoryStatus.Inactive),
        (newCategoryEntity.updated_at = new Date());

      const savedCategory = await this.categoryRepository.save(
        newCategoryEntity,
      );
      const localizedCategory = fliterCategoryByLanguage(locale, savedCategory);

      await this.updateCategoriesCommand.run(['', '--inactive', '']);

      await queryRunner.commitTransaction();

      return translatedSuccessResponse<Category>(
        this.i18n,
        locale,
        'CATEGORY_UPDATED_SUCCESS',
        localizedCategory,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse<Category>(
        this.i18n,
        locale,
        'FAILED_UPDATE_STATUS',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
