import { InjectRepository } from "@nestjs/typeorm";
import { Blog } from "../entities/blog.entity";
import { Repository } from "typeorm";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "src/helpers/constants/status";
import { CustomResponse } from "src/helpers/response/custom-response.dto";
import { BlogStatus } from "src/helpers/enums/blogStatus.enum";
import { LanguageEnum } from "src/helpers/enums/language.enum";
import { RESPONSE_MESSAGES } from "src/helpers/response/response-messages";
import { convertDates } from "src/helpers/validations/service-helper-functions/convertDates";
import { User } from "src/user/user.entity";
import { BlogSingleLang } from "src/helpers/interfaces/blogSingleLang.interface";
import { slugifyText } from "src/helpers/validations/service-helper-functions/slugify";
import { UpdateBlogDto } from "../dtos/update-blog.dto";
import { BlogDto } from "../dtos/blog.dto";
import { BlogCategory } from "../entities/blog-category.entity";


export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {};

  async getAllBlogs(language: LanguageEnum, short?: boolean) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const blogPosts = await queryRunner.manager
        .getRepository(Blog)
        .find();
      if (!blogPosts) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.NO_BLOG_POSTS
        );
      }

      let filteredBlogPosts = [];
      blogPosts.forEach(async blogPost => {
        const blogPostResult = await this.filterByLanguage(blogPost, language);
        if (blogPost.updated_at) {
          blogPostResult.updated_at = convertDates(
            blogPost.updated_at,
            language
          );
        }
        blogPostResult.created_at = convertDates(blogPost.created_at, language);
        if (short) {
          delete blogPostResult.description;
        }

        if (blogPostResult.status === BlogStatus.ACTIVE) {
          filteredBlogPosts.push(blogPostResult);
        }
      });

      return new CustomResponse(
        SUCCESS_MESSAGE,
        filteredBlogPosts,
        null,
        RESPONSE_MESSAGES.BLOGS_GET_SUCCESS
      );
    } catch (error) {
      return new CustomResponse(
        ERROR_MESSAGE,
        error,
        null,
        RESPONSE_MESSAGES.BLOGS_GET_FAIL
      );
    } finally {
      await queryRunner.release();
    }
  };


  async getBlog(
    language: LanguageEnum,
    blogPostId?: string,
    categoryId?: string,
    userId?: string,
    short?: boolean,
    forEdit?: boolean
  ) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (blogPostId) {
        const blogPost = await queryRunner.manager
          .getRepository(Blog)
          .findOne({ where: { id: blogPostId }, relations: ['blog_categories'] });
        if (!blogPost || blogPost.status !== BlogStatus.ACTIVE && blogPost.status !== BlogStatus.DRAFT) {
          return new CustomResponse(
            ERROR_MESSAGE,
            null,
            null,
            RESPONSE_MESSAGES.BLOG_NOT_FOUND
          );
        }

        let blogPostResult: Blog | BlogSingleLang = blogPost;
        if (!forEdit) {
          blogPostResult = await this.filterByLanguage(blogPost, language) as unknown as BlogSingleLang;
        }

        if (blogPost.updated_at) {
          blogPostResult.updated_at = convertDates(
            blogPost.updated_at,
            language
          );
        }
        blogPostResult.created_at = convertDates(blogPost.created_at, language);

        if (short) {
          delete blogPostResult.description;
        }

        await queryRunner.commitTransaction();
        return new CustomResponse(
          SUCCESS_MESSAGE,
          blogPostResult,
          null,
          RESPONSE_MESSAGES.BLOG_POST_FETCHED
        );
      }

      if (categoryId) {
        const blogPosts = await queryRunner.manager
          .createQueryBuilder(Blog, 'blog')
          .innerJoinAndSelect(
            'blogPost.blog_categories',
            'category',
            'category.id = :categoryId',
            { categoryId }
          )
          .getMany();

        let filteredBlogPosts = [];
        blogPosts.forEach(async blogPost => {
          const blogPostResult = await this.filterByLanguage(
            blogPost,
            language
          );
          if (blogPost.updated_at) {
            blogPostResult.updated_at = convertDates(
              blogPost.updated_at,
              language
            );
          }
          blogPostResult.created_at = convertDates(
            blogPost.created_at,
            language
          );
          if (short) {
            delete blogPostResult.description;
          }

          if (blogPostResult.status === BlogStatus.ACTIVE) {
            filteredBlogPosts.push(blogPostResult);
          }
        });

        await queryRunner.commitTransaction();
        return new CustomResponse(
          SUCCESS_MESSAGE,
          filteredBlogPosts,
          null,
          RESPONSE_MESSAGES.BLOG_POST_FETCHED
        );
      }

      if (userId) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
          relations: ['blogs'],
        });

        if (!user) {
          return new CustomResponse(
            ERROR_MESSAGE,
            null,
            null,
            RESPONSE_MESSAGES.USER_NOT_FOUND
          );
        }

        if (user.blogs.length === 0) {
          return new CustomResponse(
            ERROR_MESSAGE,
            null,
            null,
            RESPONSE_MESSAGES.NO_BLOG_POSTS_BY_USER
          );
        }

        let filteredBlogPosts = [];
        user.blogs.forEach(async blogPost => {
          const blogPostResult = await this.filterByLanguage(
            blogPost,
            language
          );
          if (blogPost.updated_at) {
            blogPostResult.updated_at = convertDates(
              blogPost.updated_at,
              language
            );
          }
          blogPostResult.created_at = convertDates(
            blogPost.created_at,
            language
          );
          if (short) {
            delete blogPostResult.description;
          }

          if (blogPostResult.status === BlogStatus.ACTIVE) {
            filteredBlogPosts.push(blogPostResult);
          }
        });

        await queryRunner.commitTransaction();
        return new CustomResponse(
          SUCCESS_MESSAGE,
          filteredBlogPosts,
          null,
          RESPONSE_MESSAGES.BLOG_POST_FETCHED
        );
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return new CustomResponse(
        ERROR_MESSAGE,
        null,
        error,
        RESPONSE_MESSAGES.BLOG_GET_FAIL
      );
    } finally {
      await queryRunner.release();
    }
  };


  async updateBlog(
    updateBlogPostDto: UpdateBlogDto,
    blogPostId: string
  ) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const blogPost = await queryRunner.manager
        .getRepository(Blog)
        .findOne({
          where: { id: blogPostId },
          relations: ['blog_categories'],
        });

      if (!blogPost) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.BLOG_NOT_FOUND
        );
      }

      if (!updateBlogPostDto.title.en || !updateBlogPostDto.description.en) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.ENGLISH_ERROR
        );
      }

      const currentDate = new Date();
      const generatedSlug = slugifyText(
        updateBlogPostDto.title.en,
        currentDate
      );

      const finalTitle: Record<string, string> = {
        en: updateBlogPostDto.title.en,
        ru: updateBlogPostDto.title.ru,
        hy: updateBlogPostDto.title.hy,
      };

      const finalDescription: Record<string, string> = {
        en: updateBlogPostDto.description.en,
        ru: updateBlogPostDto.description.ru,
        hy: updateBlogPostDto.description.hy,
      };

      const finalShortDescription: Record<string, string> = {
        en: updateBlogPostDto.shortDescription.en,
        ru: updateBlogPostDto.shortDescription.ru,
        hy: updateBlogPostDto.shortDescription.hy,
      };

      blogPost.updated_at = currentDate;
      blogPost.slug = generatedSlug;
      blogPost.title = finalTitle;
      blogPost.description = finalDescription;
      blogPost.short_description = finalShortDescription;
      blogPost.views_count = updateBlogPostDto.viewsCount;
      blogPost.image_large = updateBlogPostDto.imageLarge;
      blogPost.image_small = updateBlogPostDto.imageSmall;
      blogPost.blog_categories = [];

      for (const category of updateBlogPostDto.categories) {
        const existingCategory = await queryRunner.manager
          .getRepository(BlogCategory)
          .findOne({
            where: { id: category },
          });

        blogPost.blog_categories.push(existingCategory);
      }

      await queryRunner.manager.getRepository(Blog).save(blogPost);
      await queryRunner.commitTransaction();
      return new CustomResponse(
        SUCCESS_MESSAGE,
        blogPost,
        null,
        RESPONSE_MESSAGES.BLOG_POST_UPDATED
      );
    } catch (error) {
      return new CustomResponse(
        ERROR_MESSAGE,
        error,
        null,
        RESPONSE_MESSAGES.BLOG_UPDATE_FAIL
      );
    }
  };


  async createBlog(blogDto: BlogDto, userId: string) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.getRepository(User).findOne({
        where: { id: userId },
        relations: ['blogs'],
      });

      if (!user) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.USER_NOT_FOUND
        );
      }

      if (!blogDto.title.en || !blogDto.description.en) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.ENGLISH_ERROR
        );
      }

      const currentDate = new Date();
      const generatedSlug = slugifyText(blogDto.title.en, currentDate);

      const finalTitle: Record<string, string> = {
        en: blogDto.title.en,
        ru: blogDto.title.ru,
        hy: blogDto.title.hy,
      };

      const finalDescription: Record<string, string> = {
        en: blogDto.description.en,
        ru: blogDto.description.ru,
        hy: blogDto.description.hy,
      };

      const finalShortDescription: Record<string, string> = {
        en: blogDto.shortDescription.en,
        ru: blogDto.shortDescription.ru,
        hy: blogDto.shortDescription.hy,
      };

      const blogPost = new Blog();
      blogPost.created_at = new Date();
      blogPost.views_count = 0;
      blogPost.user_id = userId;
      blogPost.blog_categories = [];
      blogPost.title = finalTitle;
      blogPost.description = finalDescription;
      blogPost.short_description = finalShortDescription;
      blogPost.slug = generatedSlug;
      blogPost.image_large = blogDto.imageLarge;
      blogPost.image_small = blogDto.imageSmall;

      if (blogDto.categories.length === 0) {
        await queryRunner.rollbackTransaction();
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.BLOG_POST_CATEGORIES_EMPTY
        );
      }

      for (const category of blogDto.categories) {
        const existingCategory = await queryRunner.manager
          .getRepository(BlogCategory)
          .findOne({
            where: { id: category },
          });
        blogPost.blog_categories.push(existingCategory);
      }

      await queryRunner.manager.getRepository(Blog).save(blogPost);
      user.blogs.push(blogPost);
      await queryRunner.manager.getRepository(User).save(user);

      await queryRunner.commitTransaction();
      return new CustomResponse(
        SUCCESS_MESSAGE,
        blogPost,
        null,
        RESPONSE_MESSAGES.BLOG_POST_CREATED
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new CustomResponse(
        ERROR_MESSAGE,
        null,
        error,
        RESPONSE_MESSAGES.BLOG_POST_FAIL
      );
    } finally {
      await queryRunner.release();
    }
  };


  async deleteBlog(blogPostId: string) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const blogPost = await queryRunner.manager
        .getRepository(Blog)
        .findOne({ where: { id: blogPostId } });

      if (!blogPost) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.BLOG_NOT_FOUND
        );
      }

      blogPost.status = BlogStatus.DELETED;

      await queryRunner.manager.getRepository(Blog).save(blogPost);

      await queryRunner.commitTransaction();
      return new CustomResponse(
        SUCCESS_MESSAGE,
        blogPost,
        null,
        RESPONSE_MESSAGES.BLOG_POST_DELETED
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return new CustomResponse(
        ERROR_MESSAGE,
        null,
        error,
        RESPONSE_MESSAGES.BLOG_DELETE_FAIL
      );
    } finally {
      await queryRunner.release();
    }
  };


  async publishBlog(blogPostId: string) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const blogPost = await queryRunner.manager
        .getRepository(Blog)
        .findOne({ where: { id: blogPostId } });

      if (!blogPost) {
        return new CustomResponse(
          ERROR_MESSAGE,
          null,
          null,
          RESPONSE_MESSAGES.BLOG_NOT_FOUND
        );
      }

      if (blogPost.status === BlogStatus.ACTIVE) {
        return new CustomResponse(
          SUCCESS_MESSAGE,
          blogPost,
          null,
          RESPONSE_MESSAGES.BLOG_ALREADY_PUBLISHED
        );
      }

      const currentDate = new Date();
      blogPost.status = BlogStatus.ACTIVE;
      blogPost.updated_at = currentDate;

      await queryRunner.manager.getRepository(Blog).save(blogPost);

      await queryRunner.commitTransaction();
      return new CustomResponse(
        SUCCESS_MESSAGE,
        blogPost,
        null,
        RESPONSE_MESSAGES.BLOG_PUBLISHED
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new CustomResponse(
        ERROR_MESSAGE,
        null,
        error,
        RESPONSE_MESSAGES.BLOG_PUBLISH_FAIL
      );
    } finally {
      await queryRunner.release();
    }
  };

  
  async filterByLanguage(blogPost: Blog, language: LanguageEnum) {
    if (
      blogPost.title[language] &&
      blogPost.description[language] &&
      blogPost.short_description[language]
    ) {
      return {
        ...blogPost,
        title: blogPost.title[language],
        description: blogPost.description[language],
        short_description: blogPost.short_description[language],
      };
    }

    return {
      ...blogPost,
      title: blogPost.title[LanguageEnum.EN],
      description: blogPost.description[LanguageEnum.EN],
      short_description: blogPost.short_description[LanguageEnum.EN],
    };
  };
}