import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogCategory } from "../entities/blog-category.entity";
import { LanguageEnum } from "src/helpers/enums/language.enum";
import { CustomResponse } from "src/helpers/response/custom-response.dto";
import { BlogCategoryStatus } from "../../helpers/enums/blogCategoryStatus.enum";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "src/helpers/constants/status";
import { RESPONSE_MESSAGES } from "src/helpers/response/response-messages";
import { BlogCategoryDto } from "../dtos/blog-category.dto";


export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private categoryRepository: Repository<BlogCategory>,
  ) {};

  async getBlogCategory(
    language: LanguageEnum,
    categoryId: string
  ) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const singleCategory = await queryRunner.manager.getRepository(BlogCategory).findOne({ where: { id: categoryId } });

      if (!singleCategory || singleCategory.status === BlogCategoryStatus.INACTIVE) {
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


  async getAllBlogCategories(language: LanguageEnum) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const conditions = { where: { status: BlogCategoryStatus.ACTIVE } };
      const categories = await queryRunner.manager.getRepository(BlogCategory).find(conditions);

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


  async createBlogCategory(categoryDto: BlogCategoryDto) {
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

      const newCateogry = new BlogCategory();

      const newCategoryTitle: Record<string, string> = {
        en: categoryDto.category.en,
        ru: categoryDto.category.ru,
        hy: categoryDto.category.hy
      };

      newCateogry.category = newCategoryTitle;
      await queryRunner.manager.getRepository(BlogCategory).save(newCateogry);

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


  async updateBlogCategory(updateCategoryDto: BlogCategoryDto, categoryId: string) {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const singleCategory = await queryRunner.manager.getRepository(BlogCategory).findOne({ 
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
      await queryRunner.manager.getRepository(BlogCategory).save(singleCategory);

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
      const singleCategory = await queryRunner.manager.getRepository(BlogCategory).findOne({ 
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

      singleCategory.status = BlogCategoryStatus.INACTIVE;
      await queryRunner.manager.getRepository(BlogCategory).save(singleCategory);

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
