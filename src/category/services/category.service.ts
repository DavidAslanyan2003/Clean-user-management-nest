import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryDto } from '../dtos/category.dto';
import { I18nContext } from 'nestjs-i18n';
import {
  SUCCESS_FILE_NAME,
  ERROR_FILE_NAME,
} from 'src/helpers/constants/constants';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import { User } from 'src/user/user.entity';
import {
  assignLanguageToCategory,
  checkCategoryExistance,
} from 'src/helpers/validations/service-validations/category-validations';
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

      await queryRunner.commitTransaction();

      savedCategory = assignLanguageToCategory(locale, savedCategory);

      const message = i18n.translate(`${SUCCESS_FILE_NAME}.SUCCESS_MESSAGE`, {
        lang: locale,
      });

      return new CustomResponse<Category>(message, savedCategory, null, null);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      const message = i18n.translate(`${ERROR_FILE_NAME}.ERROR_MESSAGE`, {
        lang: locale,
      });

      const errorMessage = i18n.translate(
        `${ERROR_FILE_NAME}.FAILED_CREATE_CATEGORY`,
        {
          lang: locale,
        },
      );

      return new CustomResponse<Category>(
        message,
        null,
        error.message,
        errorMessage,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getCategories(
    locale: string,
    dataObject?: any,
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

      if (dataObject) {
        const { name, id } = dataObject;
        if (name) {
          query = query.andWhere('category.name ->> :locale = :name', {
            locale,
            name,
          });
        } else if (id) {
          query = query.andWhere('category.id = :id', { id });
        }
      }
      const categories: Category[] = await query.getMany();

      await queryRunner.commitTransaction();

      checkCategoryExistance(categories);

      for (let category of categories) {
        category = assignLanguageToCategory(locale, category);
      }

      const message = i18n.translate(`${SUCCESS_FILE_NAME}.SUCCESS_MESSAGE`, {
        lang: locale,
      });

      return new CustomResponse<Category[]>(message, categories, null, null);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      const message = i18n.translate(`${ERROR_FILE_NAME}.ERROR_MESSAGE`, {
        lang: locale,
      });

      const errorMessage = i18n.translate(
        `${ERROR_FILE_NAME}.FAILED_GET_CATEGORY`,
        {
          lang: locale,
        },
      );

      return new CustomResponse<Category[]>(
        message,
        null,
        error.message,
        errorMessage,
      );
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

      checkCategoryExistance(categories);

      await queryRunner.commitTransaction();

      for (let category of categories) {
        category = assignLanguageToCategory(locale, category);
      }

      const message = i18n.translate(`${SUCCESS_FILE_NAME}.SUCCESS_MESSAGE`, {
        lang: locale,
      });

      return new CustomResponse<Category[]>(message, categories, null, null);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      const message = i18n.translate(`${ERROR_FILE_NAME}.ERROR_MESSAGE`, {
        lang: locale,
      });

      const errorMessage = i18n.translate(
        `${ERROR_FILE_NAME}.FAILED_GET_CATEGORY`,
        {
          lang: locale,
        },
      );

      return new CustomResponse<Category[]>(
        message,
        null,
        error.message,
        errorMessage,
      );
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

      checkCategoryExistance([category]);

      (category.name = newCategorie.name),
        (category.description = newCategorie.description),
        (category.category_icon = newCategorie.category_icon),
        (category.category_image = newCategorie.category_image),
        (category.updated_at = new Date());

      savedCategory = await this.categoryRepository.save(category);

      await queryRunner.commitTransaction();

      savedCategory = assignLanguageToCategory(locale, savedCategory);

      const message = i18n.translate(`${SUCCESS_FILE_NAME}.SUCCESS_MESSAGE`, {
        lang: locale,
      });

      return new CustomResponse<Category>(message, savedCategory, null, null);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      const message = i18n.translate(`${ERROR_FILE_NAME}.ERROR_MESSAGE`, {
        lang: locale,
      });

      const errorMessage = i18n.translate(
        `${ERROR_FILE_NAME}.FAILED_UPDATE_CATEGORY`,
        {
          lang: locale,
        },
      );

      return new CustomResponse<Category>(
        message,
        null,
        error.message,
        errorMessage,
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

      checkCategoryExistance([category]);

      (category.status =
        newStatus.status.toLowerCase() === ACTIVE_STATUS.toLowerCase()
          ? CategoryStatus.Active
          : CategoryStatus.Inactive),
        (category.updated_at = new Date());

      savedCategory = await this.categoryRepository.save(category);

      await queryRunner.commitTransaction();

      savedCategory = assignLanguageToCategory(locale, savedCategory);

      const message = i18n.translate(`${SUCCESS_FILE_NAME}.SUCCESS_MESSAGE`, {
        lang: locale,
      });

      return new CustomResponse<Category>(message, savedCategory, null, null);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      const message = i18n.translate(`${ERROR_FILE_NAME}.ERROR_MESSAGE`, {
        lang: locale,
      });

      const errorMessage = i18n.translate(
        `${ERROR_FILE_NAME}.FAILED_UPDATE_STATUS`,
        {
          lang: locale,
        },
      );

      return new CustomResponse<Category>(
        message,
        null,
        error.message,
        errorMessage,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
