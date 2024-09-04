import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogCategory } from "../entities/blog-category.entity";
import { LanguageEnum } from "src/helpers/enums/language.enum";
import { BlogCategoryStatus } from "../../helpers/enums/blogCategoryStatus.enum";
import { BlogCategoryDto } from "../dtos/blog-category.dto";
import { REQUEST } from "@nestjs/core";
import { Inject } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { translatedErrorResponse, translatedSuccessResponse } from "src/helpers/validations/service-helper-functions/category-helper-functions";


export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private categoryRepository: Repository<BlogCategory>,

    @Inject(REQUEST)
    private readonly request: Request,
    private readonly i18n: I18nService,
  ) {};

  async getBlogCategory(
    language: LanguageEnum,
    categoryId: string
  ) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const locale = this.request['language'];

    try {
      const singleCategory = await queryRunner.manager.getRepository(BlogCategory).findOne({ where: { id: categoryId } });

      if (!singleCategory || singleCategory.status === BlogCategoryStatus.INACTIVE) {
        return translatedErrorResponse<BlogCategory>(
          this.i18n,
          locale,
          'CATEGORY_NOT_FOUND',
          null,
        );
      };

      const filteredCategory = await this.filterByLanguage(singleCategory, language);
      await queryRunner.commitTransaction();
      return translatedSuccessResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORY_FETCHED',
        filteredCategory,
      );
    } catch(error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORIES_FETCH_FAIL',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  };


  async getAllBlogCategories(language: LanguageEnum) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const locale = this.request['language'];

    try {
      const conditions = { where: { status: BlogCategoryStatus.ACTIVE } };
      const categories = await queryRunner.manager.getRepository(BlogCategory).find(conditions);

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
        const categoryResult = await this.filterByLanguage(category, language);
        filteredCategories.push(categoryResult);
      });

      await queryRunner.commitTransaction();
      return translatedSuccessResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORIES_FETCHED',
        filteredCategories,
      );
    } catch(error) {
      await queryRunner.rollbackTransaction();
      return translatedErrorResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORIES_FETCH_FAIL',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  };


  async createBlogCategory(categoryDto: BlogCategoryDto) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
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

      const newCateogry = new BlogCategory();

      const newCategoryTitle: Record<string, string> = {
        en: categoryDto.category.en,
        ru: categoryDto.category.ru,
        hy: categoryDto.category.hy
      };

      newCateogry.category = newCategoryTitle;
      await queryRunner.manager.getRepository(BlogCategory).save(newCateogry);
      await queryRunner.commitTransaction();

      return translatedSuccessResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORY_CREATED',
        newCateogry,
      );
    } catch(error) {
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
  };


  async updateBlogCategory(updateCategoryDto: BlogCategoryDto, categoryId: string) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const locale = this.request['language'];

    try {
      const singleCategory = await queryRunner.manager.getRepository(BlogCategory).findOne({ 
        where: { id: categoryId } 
      })

      if (!singleCategory) {
        return translatedErrorResponse<BlogCategory>(
          this.i18n,
          locale,
          'CATEGORY_NOT_FOUND',
          null,
        );
      };

      if (!updateCategoryDto.category.en) {
        return translatedErrorResponse<BlogCategory>(
          this.i18n,
          locale,
          'ENGLISH_ERROR',
          null,
        );
      }

      const newCategoryTitle: Record<string, string> = {
        en: updateCategoryDto.category.en,
        ru: updateCategoryDto.category.ru,
        hy: updateCategoryDto.category.hy
      };

      singleCategory.category = newCategoryTitle;
      await queryRunner.manager.getRepository(BlogCategory).save(singleCategory);
      await queryRunner.commitTransaction();

      return translatedSuccessResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEGORY_UPDATED',
        singleCategory,
      );
    } catch(error) {
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
  };


  async deleteBlogPostCategory(categoryId: string) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const locale = this.request['language'];

    try {
      const singleCategory = await queryRunner.manager.getRepository(BlogCategory).findOne({ 
        where: { id: categoryId } 
      })

      if (!singleCategory) {
        return translatedErrorResponse<BlogCategory>(
          this.i18n,
          locale,
          'CATEGORY_NOT_FOUND',
          null,
        );
      };

      singleCategory.status = BlogCategoryStatus.INACTIVE;
      await queryRunner.manager.getRepository(BlogCategory).save(singleCategory);
      await queryRunner.commitTransaction();

      return translatedSuccessResponse<BlogCategory>(
        this.i18n,
        locale,
        'CATEOGRY_DELETED',
        singleCategory,
      );
    } catch(error) {
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
  };

  async filterByLanguage(mainCategory: BlogCategory, language: LanguageEnum) {
    if (mainCategory.category[language]) {
      return  { 
        ...mainCategory, 
        category: mainCategory.category[language],
      };
    } 
      
    return { 
      ...mainCategory, 
      category: mainCategory.category[LanguageEnum.EN],
    };
  };
};
