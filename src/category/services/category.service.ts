import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryDto } from '../dtos/category.dto';
import { I18nContext } from 'nestjs-i18n';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import { User } from 'src/user/user.entity';
import {
  fliterCategoryByLanguage,
  checkItemExistance,
  returnSuccessMassage,
  translatedErrorResponse,
} from 'src/helpers/validations/service-helper-functions/category-helper-functions';
import { UpdateStatusDto } from '../dtos/update-status.dto';
import {
  ACTIVE_STATUS,
  INACTIVE_STATUS,
  CategoryStatus,
} from 'src/helpers/constants/status';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async createCategory(
    locale: string,
    newCategory: CategoryDto,
  ): Promise<CustomResponse<Category>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const i18n = I18nContext.current();

    try {
      const users = await queryRunner.manager.getRepository(User).find();

      const category = queryRunner.manager.getRepository(Category).create({
        name: newCategory.name,
        description: newCategory.description,
        category_icon: newCategory.category_icon,
        category_image: newCategory.category_image,
        user: users[0],
      });
      const savedCategory = await this.categoryRepository.save(category);
      const resultedCategory = fliterCategoryByLanguage(locale, savedCategory);

      const message = returnSuccessMassage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<Category>(message, resultedCategory);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse(
        i18n,
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
    locale: string,
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

    const i18n = I18nContext.current();

    try {
      const [categories, total] = await queryRunner.manager
        .getRepository(Category)
        .createQueryBuilder('category')
        .where('category.status = :ACTIVE_STATUS', { ACTIVE_STATUS })
        .orderBy(`category.${orderBy}`, sortOrder)
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      const filteredCategories = categories.reduce((acc, category) => {
        acc.push(fliterCategoryByLanguage(locale, category));
        return acc;
      }, []);

      const message = returnSuccessMassage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<{ categories: Category[]; total: number }>(
        message,
        { categories: filteredCategories, total },
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse(
        i18n,
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
    locale: string,
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

    const i18n = I18nContext.current();

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

      const filteredCategories = categories.reduce((acc, category) => {
        acc.push(fliterCategoryByLanguage(locale, category));
        return acc;
      }, []);

      const message = returnSuccessMassage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<{ categories: Category[]; total: number }>(
        message,
        { categories: filteredCategories, total },
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse(
        i18n,
        locale,
        'FAILED_GET_CATEGORY',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getCategoryById(
    locale: string,
    id: string,
    allLanguages: boolean,
  ): Promise<CustomResponse<Category>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const i18n = I18nContext.current();

    try {
      let category = await queryRunner.manager
        .getRepository(Category)
        .createQueryBuilder('category')
        .where('category.id = :id', { id })
        .getOne();
      checkItemExistance(category, i18n);

      if (allLanguages) {
        category = fliterCategoryByLanguage(locale, category);
      }
      const message = returnSuccessMassage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<Category>(message, category);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return translatedErrorResponse(
        i18n,
        locale,
        'FAILED_GET_CATEGORY',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getInactiveCategories(
    locale: string,
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

    const i18n = I18nContext.current();

    try {
      const [categories, total] = await queryRunner.manager
        .getRepository(Category)
        .createQueryBuilder('category')
        .where('category.status = :INACTIVE_STATUS', { INACTIVE_STATUS })
        .orderBy(`category.${orderBy}`, sortOrder)
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      const filteredCategories = categories.reduce((acc, category) => {
        acc.push(fliterCategoryByLanguage(locale, category));
        return acc;
      }, []);

      const message = returnSuccessMassage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<{ categories: Category[]; total: number }>(
        message,
        { categories: filteredCategories, total },
        null,
        null,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse(
        i18n,
        locale,
        'FAILED_GET_CATEGORY',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateCategory(
    locale: string,
    id: string,
    newCategory: CategoryDto,
  ): Promise<CustomResponse<Category>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const i18n = I18nContext.current();

    try {
      const category = await queryRunner.manager
        .getRepository(Category)
        .findOne({
          where: { id: id },
        });
      checkItemExistance(category, i18n);

      category.name = newCategory.name;
      category.description = newCategory.description;
      category.category_icon = newCategory.category_icon;
      category.category_image = newCategory.category_image;
      category.updated_at = new Date();

      const savedCategory = await this.categoryRepository.save(category);
      const resultedCategory = fliterCategoryByLanguage(locale, savedCategory);

      const message = returnSuccessMassage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<Category>(message, resultedCategory);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse(
        i18n,
        locale,
        'FAILED_UPDATE_CATEGORY',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateStatus(
    locale: string,
    id: string,
    newStatus: UpdateStatusDto,
  ): Promise<CustomResponse<Category>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const i18n = I18nContext.current();

    try {
      const category = await queryRunner.manager
        .getRepository(Category)
        .findOne({
          where: { id: id },
        });
      checkItemExistance(category, i18n);

      (category.status =
        newStatus.status.toLowerCase() === ACTIVE_STATUS.toLowerCase()
          ? CategoryStatus.Active
          : CategoryStatus.Inactive),
        (category.updated_at = new Date());

      const savedCategory = await this.categoryRepository.save(category);
      const resultedCategory = fliterCategoryByLanguage(locale, savedCategory);

      const message = returnSuccessMassage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<Category>(message, resultedCategory);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse(
        i18n,
        locale,
        'FAILED_UPDATE_STATUS',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
