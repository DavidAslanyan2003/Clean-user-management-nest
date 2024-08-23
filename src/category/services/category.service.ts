import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryDto } from '../dtos/category.dto';
import { I18nContext } from 'nestjs-i18n';
import { SUCCESS_FILE_NAME } from 'src/helpers/constants/constants';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import { User } from 'src/user/user.entity';
import {
  assignLanguageToCategory,
  checkCategoriesExistance,
  checkSingleCategoryExistance,
  localizedErrorResponse,
  successMessage,
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
    newCategorie: CategoryDto,
  ): Promise<CustomResponse<Category>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const i18n = I18nContext.current();

    try {
      let savedCategory: Category;
      const users = await queryRunner.manager.getRepository(User).find();

      const category = queryRunner.manager.getRepository(Category).create({
        name: newCategorie.name,
        description: newCategorie.description,
        category_icon: newCategorie.category_icon,
        category_image: newCategorie.category_image,
        user: users[0],
      });

      savedCategory = await this.categoryRepository.save(category);

      savedCategory = assignLanguageToCategory(locale, savedCategory);

      const message = successMessage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<Category>(message, savedCategory, null, null);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return localizedErrorResponse(
        i18n,
        locale,
        'FAILED_CREATE_CATEGORY',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getCategories(
    locale: string,
    name?: any,
  ): Promise<CustomResponse<Category[]>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const i18n = I18nContext.current();

    try {
      let query = queryRunner.manager
        .getRepository(Category)
        .createQueryBuilder('category')
        .where('category.status = :ACTIVE_STATUS', { ACTIVE_STATUS })
        .andWhere('category.name ? :locale', { locale });

      if (name) {
        query = query.andWhere('category.name ->> :locale = :name', {
          locale,
          name,
        });
      }
      const categories: Category[] = await query.getMany();

      checkCategoriesExistance(categories, i18n);

      for (let category of categories) {
        category = assignLanguageToCategory(locale, category);
      }

      const message = successMessage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<Category[]>(message, categories, null, null);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return localizedErrorResponse(i18n, locale, 'FAILED_GET_CATEGORY', error);
    } finally {
      await queryRunner.release();
    }
  }

  async getCategoryById(
    locale: string,
    id: string,
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
        .where('category.status = :ACTIVE_STATUS', { ACTIVE_STATUS })
        .andWhere('category.name ? :locale', { locale })
        .andWhere('category.id = :id', { id })
        .getOne();

      checkSingleCategoryExistance(category, i18n);

      category = assignLanguageToCategory(locale, category);

      const message = successMessage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<Category>(message, category, null, null);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return localizedErrorResponse(i18n, locale, 'FAILED_GET_CATEGORY', error);
    } finally {
      await queryRunner.release();
    }
  }

  async getInactiveCategories(
    locale: string,
  ): Promise<CustomResponse<Category[]>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const i18n = I18nContext.current();

    try {
      const categories = await queryRunner.manager
        .getRepository(Category)
        .createQueryBuilder('category')
        .where('category.status = :INACTIVE_STATUS', { INACTIVE_STATUS })
        .andWhere('category.name ? :locale', { locale })
        .getMany();

      checkCategoriesExistance(categories, i18n);

      for (let category of categories) {
        category = assignLanguageToCategory(locale, category);
      }

      const message = successMessage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<Category[]>(message, categories, null, null);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return localizedErrorResponse(i18n, locale, 'FAILED_GET_CATEGORY', error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateCategory(
    locale: string,
    id: string,
    newCategorie: CategoryDto,
  ): Promise<CustomResponse<Category>> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const i18n = I18nContext.current();

    try {
      let savedCategory: Category;
      const category = await queryRunner.manager
        .getRepository(Category)
        .findOne({
          where: { id: id },
        });

      checkSingleCategoryExistance(category, i18n);

      (category.name = newCategorie.name),
        (category.description = newCategorie.description),
        (category.category_icon = newCategorie.category_icon),
        (category.category_image = newCategorie.category_image),
        (category.updated_at = new Date());

      savedCategory = await this.categoryRepository.save(category);

      savedCategory = assignLanguageToCategory(locale, savedCategory);

      const message = successMessage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<Category>(message, savedCategory, null, null);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return localizedErrorResponse(
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
      let savedCategory: Category;
      const category = await queryRunner.manager
        .getRepository(Category)
        .findOne({
          where: { id: id },
        });

      checkSingleCategoryExistance(category, i18n);

      (category.status =
        newStatus.status.toLowerCase() === ACTIVE_STATUS.toLowerCase()
          ? CategoryStatus.Active
          : CategoryStatus.Inactive),
        (category.updated_at = new Date());

      savedCategory = await this.categoryRepository.save(category);

      savedCategory = assignLanguageToCategory(locale, savedCategory);

      const message = successMessage(i18n, locale);

      await queryRunner.commitTransaction();

      return new CustomResponse<Category>(message, savedCategory, null, null);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return localizedErrorResponse(
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
