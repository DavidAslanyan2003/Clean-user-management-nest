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

@Injectable({ scope: Scope.REQUEST })
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly i18n: I18nService,
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
          category_icon: newCategory.category_icon,
          category_image: newCategory.category_image,
          user: users[0],
        });
      const savedCategory = await this.categoryRepository.save(
        newCategoryEntity,
      );
      const localizedCategory = fliterCategoryByLanguage(locale, savedCategory);

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

    try {
      const [categories, total] = await queryRunner.manager
        .getRepository(Category)
        .createQueryBuilder('category')
        .where('category.status = :ACTIVE_STATUS', { ACTIVE_STATUS })
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

    try {
      const [categories, total] = await queryRunner.manager
        .getRepository(Category)
        .createQueryBuilder('category')
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
      let category = await queryRunner.manager
        .getRepository(Category)
        .createQueryBuilder('category')
        .where('category.id = :id', { id })
        .getOne();
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

    try {
      const [categories, total] = await queryRunner.manager
        .getRepository(Category)
        .createQueryBuilder('category')
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
      newCategoryEntity.category_icon = newCategory.category_icon;
      newCategoryEntity.category_image = newCategory.category_image;
      newCategoryEntity.updated_at = new Date();

      const savedCategory = await this.categoryRepository.save(
        newCategoryEntity,
      );
      const localizedCategory = fliterCategoryByLanguage(locale, savedCategory);

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
