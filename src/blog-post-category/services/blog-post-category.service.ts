import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogPostCategory } from "../entities/blog-post-category.entity";
import { LanguageEnum } from "src/helpers/enums/language.enum";
import { CustomResponse } from "src/helpers/response/custom-response.dto";
import { BlogPostCategoryStatus } from "src/helpers/enums/blogPostCategoryStatus.enum";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "src/helpers/constants/status";
import { RESPONSE_MESSAGES } from "src/helpers/response/response-messages";
import { BlogPostCategoryDto } from "../dtos/blog-post-category.dto";


export class BlogPostCategoryService {
  constructor(
    @InjectRepository(BlogPostCategory)
    private categoryRepository: Repository<BlogPostCategory>,
  ) {};

  async getBlogPostCategory(
    language: LanguageEnum,
    categoryId: string
  ) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const singleCategory = await queryRunner.manager.getRepository(BlogPostCategory).findOne({ where: { id: categoryId } });

      if (!singleCategory || singleCategory.status === BlogPostCategoryStatus.INACTIVE) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.CATEGORY_NOT_FOUND
        );
      };

      const filteredCategory = await this.filterByLanguage(singleCategory, language);

      await queryRunner.commitTransaction();
      return new CustomResponse(
        SUCCESS_MESSAGE,
        filteredCategory,
        null,
        RESPONSE_MESSAGES.CATEGORY_FETCHED
      );
    } catch(error) {
      await queryRunner.rollbackTransaction();

      return new CustomResponse(
        ERROR_MESSAGE,
        null,
        error,
        RESPONSE_MESSAGES.CATEGORIES_FETCH_FAIL
      );
    } finally {
      await queryRunner.release();
    }
  };


  async getAllBlogPostCategories(language: LanguageEnum) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const conditions = { where: { status: BlogPostCategoryStatus.ACTIVE } };
      const categories = await queryRunner.manager.getRepository(BlogPostCategory).find(conditions);

      if (!categories) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.CATEGORIES_FETCH_FAIL
        );
      }

      let filteredCategories = [];
      categories.forEach(async (category) => {
        const categoryResult = await this.filterByLanguage(category, language);
        filteredCategories.push(categoryResult);
      });

      await queryRunner.commitTransaction();
      return new CustomResponse(
        SUCCESS_MESSAGE,
        filteredCategories,
        null,
        RESPONSE_MESSAGES.CATEGORIES_FETCHED
      );

    } catch(error) {
      await queryRunner.rollbackTransaction();

      return new CustomResponse(
        ERROR_MESSAGE,
        null,
        error,
        RESPONSE_MESSAGES.CATEGORIES_FETCH_FAIL
      );
    } finally {
      await queryRunner.release();
    }
  };


  async createBlogPostCategory(categoryDto: BlogPostCategoryDto) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!categoryDto.category.en) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.ENGLISH_ERROR
        );
      }

      const newCateogry = new BlogPostCategory();

      const newCategoryTitle: Record<string, string> = {
        en: categoryDto.category.en,
        ru: categoryDto.category.ru,
        hy: categoryDto.category.hy
      };

      newCateogry.category = newCategoryTitle;
      await queryRunner.manager.getRepository(BlogPostCategory).save(newCateogry);

      await queryRunner.commitTransaction();
      return new CustomResponse(
        SUCCESS_MESSAGE,
        newCateogry,
        null,
        RESPONSE_MESSAGES.CATEGORY_CREATED
      );
    } catch(error) {
      await queryRunner.rollbackTransaction();

      return new CustomResponse(
        ERROR_MESSAGE,
        null,
        error,
        RESPONSE_MESSAGES.CATEGORY_CREATE_FAIL
      );
    } finally {
      await queryRunner.release();
    }
  };


  async updateBlogPostCategory(updateCategoryDto: BlogPostCategoryDto, categoryId: string) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const singleCategory = await queryRunner.manager.getRepository(BlogPostCategory).findOne({ 
        where: { id: categoryId } 
      })

      if (!singleCategory) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.CATEGORY_NOT_FOUND
        )
      };

      if (!updateCategoryDto.category.en) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.ENGLISH_ERROR
        );
      }

      const newCategoryTitle: Record<string, string> = {
        en: updateCategoryDto.category.en,
        ru: updateCategoryDto.category.ru,
        hy: updateCategoryDto.category.hy
      };

      singleCategory.category = newCategoryTitle;
      await queryRunner.manager.getRepository(BlogPostCategory).save(singleCategory);

      await queryRunner.commitTransaction();
      return new CustomResponse(
        SUCCESS_MESSAGE,
        singleCategory,
        null,
        RESPONSE_MESSAGES.CATEGORY_UPDATED
      );
    } catch(error) {
      await queryRunner.rollbackTransaction();

      return new CustomResponse(
        ERROR_MESSAGE,
        null,
        error,
        RESPONSE_MESSAGES.CATEGORY_UPDATE_FAIL
      );
    } finally {
      await queryRunner.release();
    }
  };


  async deleteBlogPostCategory(categoryId: string) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const singleCategory = await queryRunner.manager.getRepository(BlogPostCategory).findOne({ 
        where: { id: categoryId } 
      })

      if (!singleCategory) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.CATEGORY_NOT_FOUND
        )
      };

      singleCategory.status = BlogPostCategoryStatus.INACTIVE;
      await queryRunner.manager.getRepository(BlogPostCategory).save(singleCategory);

      await queryRunner.commitTransaction();
      return new CustomResponse(
        SUCCESS_MESSAGE,
        singleCategory,
        null,
        RESPONSE_MESSAGES.CATEOGRY_DELETED
      );

    } catch(error) {
      await queryRunner.rollbackTransaction();

      return new CustomResponse(
        ERROR_MESSAGE,
        null,
        error,
        RESPONSE_MESSAGES.CATEGORY_DELETE_FAIL
      );
    } finally {
      await queryRunner.release();
    }
  };

  async filterByLanguage(mainCategory: BlogPostCategory, language: LanguageEnum) {
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
