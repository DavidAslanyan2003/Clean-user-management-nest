import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogCategory } from '../entities/blog-category.entity';
import { LanguageEnum } from '../../helpers/enums/language.enum';
import { BlogCategoryStatus } from '../../helpers/enums/blogCategoryStatus.enum';
import { BlogCategoryDto } from '../dtos/blog-category.dto';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  translatedErrorResponse,
  translatedSuccessResponse,
} from '../../helpers/validations/service-helper-functions/category-helper-functions';
import { checkBlogCategoryUniqueness } from 'src/helpers/validations/service-helper-functions/blog-helper-functions';

export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private categoryRepository: Repository<BlogCategory>,

    @Inject(REQUEST)
    private readonly request: Request,
    private readonly i18n: I18nService,
  ) {}

  async getBlogCategory(categoryId: string) {
    const locale = this.request['language'];

    try {
      const singleCategory = await this.categoryRepository.findOne({ where: { id: categoryId } });

      if (
        !singleCategory ||
        singleCategory.status === BlogCategoryStatus.INACTIVE
      ) {
        return translatedErrorResponse<BlogCategory>(
          this.i18n,
          locale,
          'CATEGORY_NOT_FOUND',
          null,
        );
      }

      return translatedSuccessResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORY_FETCHED',
        singleCategory,
      );
    } catch (error) {
      return translatedErrorResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORIES_FETCH_FAIL',
        error,
      );
    } 
  }

  async getAllBlogCategories() {
    const locale = this.request['language'];

    try {
      const conditions = { where: { status: BlogCategoryStatus.ACTIVE } };
      const categories = await this.categoryRepository.find(conditions);

      if (!categories) {
        return translatedErrorResponse<BlogCategory>(
          this.i18n,
          locale,
          'CATEGORIES_FETCH_FAIL',
          null,
        );
      }

      let filteredCategories = [];
      categories.forEach(async (category) => {
        const categoryResult = await this.filterByLanguage(category, locale);
        filteredCategories.push(categoryResult);
      });

      return translatedSuccessResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORIES_FETCHED',
        filteredCategories,
      );
    } catch (error) {
      return translatedErrorResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORIES_FETCH_FAIL',
        error,
      );
    }
  }

  async createBlogCategory(categoryDto: BlogCategoryDto) {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const locale = this.request['language'];

    try {
      if (!categoryDto.category.en) {
        return translatedErrorResponse<BlogCategory>(
          this.i18n,
          locale,
          'ENGLISH_ERROR',
          null,
        );
      }

      await checkBlogCategoryUniqueness(
        queryRunner,
        categoryDto.category,
        this.i18n,
        locale
      );

      const newCateogry = new BlogCategory();
      newCateogry.category = categoryDto.category;

      await queryRunner.manager.getRepository(BlogCategory).save(newCateogry);

      const singleLangCategory = await this.filterByLanguage(
        newCateogry,
        locale,
      );

      await queryRunner.commitTransaction();

      return translatedSuccessResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORY_CREATED',
        singleLangCategory,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return translatedErrorResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORY_CREATE_FAIL',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateBlogCategory(
    updateCategoryDto: BlogCategoryDto,
    categoryId: string,
  ) {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const locale = this.request['language'];

    try {
      const singleCategory = await queryRunner.manager
        .getRepository(BlogCategory)
        .findOne({
          where: { id: categoryId },
        });

      if (!singleCategory) {
        return translatedErrorResponse<BlogCategory>(
          this.i18n,
          locale,
          'CATEGORY_NOT_FOUND',
          null,
        );
      }

      if (!updateCategoryDto.category.en) {
        return translatedErrorResponse<BlogCategory>(
          this.i18n,
          locale,
          'ENGLISH_ERROR',
          null,
        );
      }

      singleCategory.category = updateCategoryDto.category;
      await queryRunner.manager
        .getRepository(BlogCategory)
        .save(singleCategory);
      await queryRunner.commitTransaction();

      return translatedSuccessResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORY_UPDATED',
        singleCategory,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return translatedErrorResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORY_UPDATE_FAIL',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteBlogPostCategory(categoryId: string) {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const locale = this.request['language'];

    try {
      const singleCategory = await queryRunner.manager
        .getRepository(BlogCategory)
        .findOne({
          where: { id: categoryId },
        });

      if (!singleCategory) {
        return translatedErrorResponse<BlogCategory>(
          this.i18n,
          locale,
          'CATEGORY_NOT_FOUND',
          null,
        );
      }

      singleCategory.status = BlogCategoryStatus.INACTIVE;
      await queryRunner.manager
        .getRepository(BlogCategory)
        .save(singleCategory);

      const singleLangCategory = await this.filterByLanguage(
        singleCategory,
        locale,
      );

      await queryRunner.commitTransaction();

      return translatedSuccessResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORY_DELETED',
        singleLangCategory,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return translatedErrorResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORY_DELETE_FAIL',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async filterByLanguage(mainCategory: BlogCategory, language: LanguageEnum) {
    if (mainCategory.category[language]) {
      return {
        ...mainCategory,
        category: mainCategory.category[language],
      };
    }

    return {
      ...mainCategory,
      category: mainCategory.category[LanguageEnum.EN],
    };
  }
}
