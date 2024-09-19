import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../entities/blog.entity';
import { Repository } from 'typeorm';
import { BlogStatus, BlogUpdateStatus } from '../../helpers/enums/blogStatus.enum';
import { LanguageEnum } from '../../helpers/enums/language.enum';
import { convertDates } from '../../helpers/validations/service-helper-functions/convertDates';
import { User } from '../../user/user.entity';
import { BlogSingleLang } from '../../helpers/interfaces/blogSingleLang.interface';
import { slugifyText } from '../../helpers/validations/service-helper-functions/slugify';
import { UpdateBlogDto } from '../dtos/update-blog.dto';
import { BlogDto } from '../dtos/blog.dto';
import { BlogCategory } from '../entities/blog-category.entity';
import {
  translatedErrorResponse,
  translatedSuccessResponse,
} from '../../helpers/validations/service-helper-functions/category-helper-functions';
import { BadRequestException, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { UpdateBlogStatusDto } from '../dtos/update-blog-status.dto';


export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(REQUEST)
    private readonly request: Request,
    private readonly i18n: I18nService,
  ) {}

  async getAllBlogs(short?: boolean) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const locale = this.request['language'];

    try {
      const blogPosts = await queryRunner.manager.getRepository(Blog).find();
      if (!blogPosts) {
        return translatedErrorResponse<Blog>(
          this.i18n,
          locale,
          'NO_BLOG_POSTS',
          null,
        );
      }

      let filteredBlogPosts = [];
      blogPosts.forEach(async (blogPost) => {
        const blogPostResult = await this.filterByLanguage(blogPost, locale);
        if (blogPost.updated_at) {
          blogPostResult.updated_at = convertDates(blogPost.updated_at, locale);
        }
        blogPostResult.created_at = convertDates(blogPost.created_at, locale);
        if (short) {
          delete blogPostResult.description;
        }

        if (blogPostResult.status === BlogStatus.ACTIVE) {
          filteredBlogPosts.push(blogPostResult);
        }
      });

      return translatedSuccessResponse<{
        filteredBlogPosts: Blog[];
      }>(this.i18n, locale, 'BLOGS_GET_SUCCESS', {
        filteredBlogPosts: filteredBlogPosts,
      });
    } catch (error) {
      return translatedErrorResponse<Blog>(
        this.i18n,
        locale,
        'BLOGS_GET_FAIL',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getBlog(
    blogId?: string,
    categoryId?: string,
    userId?: string,
    short?: boolean,
    forEdit?: boolean,
  ) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const locale = this.request['language'];

    try {
      if (blogId) {
        const blogPost = await queryRunner.manager
          .getRepository(Blog)
          .findOne({ where: { id: blogId }, relations: ['blog_categories'] });
        if (
          !blogPost ||
          (blogPost.status !== BlogStatus.ACTIVE &&
            blogPost.status !== BlogStatus.DRAFT)
        ) {
          return translatedErrorResponse<Blog>(
            this.i18n,
            locale,
            'BLOG_NOT_FOUND',
            null,
          );
        }

        let blogPostResult: Blog | BlogSingleLang = blogPost;
        if (!forEdit) {
          blogPostResult = (await this.filterByLanguage(
            blogPost,
            locale,
          )) as unknown as BlogSingleLang;
        }

        if (blogPost.updated_at) {
          blogPostResult.updated_at = convertDates(blogPost.updated_at, locale);
        }
        blogPostResult.created_at = convertDates(blogPost.created_at, locale);

        if (short) {
          delete blogPostResult.description;
        }

        await queryRunner.commitTransaction();
        return translatedSuccessResponse<Blog>(
          this.i18n,
          locale,
          'BLOG_POST_FETCHED',
          blogPostResult,
        );
      }

      if (categoryId) {
        const blogPosts = await queryRunner.manager
          .createQueryBuilder(Blog, 'blog')
          .innerJoinAndSelect(
            'blog.blog_categories',
            'category',
            'category.id = :categoryId',
            { categoryId },
          )
          .getMany();

        let filteredBlogPosts = [];
        blogPosts.forEach(async (blogPost) => {
          const blogPostResult = await this.filterByLanguage(blogPost, locale);
          if (blogPost.updated_at) {
            blogPostResult.updated_at = convertDates(
              blogPost.updated_at,
              locale,
            );
          }
          blogPostResult.created_at = convertDates(blogPost.created_at, locale);
          if (short) {
            delete blogPostResult.description;
          }

          if (blogPostResult.status === BlogStatus.ACTIVE) {
            filteredBlogPosts.push(blogPostResult);
          }
        });

        await queryRunner.commitTransaction();
        return translatedSuccessResponse<Blog>(
          this.i18n,
          locale,
          'BLOG_POST_FETCHED',
          filteredBlogPosts,
        );
      }

      if (userId) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
          relations: ['blogs'],
        });

        if (!user) {
          return translatedErrorResponse<Blog>(
            this.i18n,
            locale,
            'USER_NOT_FOUND',
            null,
          );
        }

        if (user.blogs.length === 0) {
          return translatedErrorResponse<Blog>(
            this.i18n,
            locale,
            'NO_BLOGS_BY_USER',
            null,
          );
        }

        let filteredBlogPosts = [];
        user.blogs.forEach(async (blogPost) => {
          const blogPostResult = await this.filterByLanguage(blogPost, locale);
          if (blogPost.updated_at) {
            blogPostResult.updated_at = convertDates(
              blogPost.updated_at,
              locale,
            );
          }
          blogPostResult.created_at = convertDates(blogPost.created_at, locale);
          if (short) {
            delete blogPostResult.description;
          }

          if (blogPostResult.status === BlogStatus.ACTIVE) {
            filteredBlogPosts.push(blogPostResult);
          }
        });

        await queryRunner.commitTransaction();
        return translatedSuccessResponse<Blog>(
          this.i18n,
          locale,
          'BLOG_POST_FETCHED',
          filteredBlogPosts,
        );
      }

      throw new BadRequestException();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return translatedErrorResponse<Blog>(
        this.i18n,
        locale,
        'BLOG_GET_FAIL',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateBlog(updateBlogPostDto: UpdateBlogDto, blogPostId: string) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const locale = this.request['language'];

    try {
      const blogPost = await queryRunner.manager.getRepository(Blog).findOne({
        where: { id: blogPostId },
        relations: ['blog_categories'],
      });

      if (!blogPost) {
        return translatedErrorResponse<Blog>(
          this.i18n,
          locale,
          'BLOG_NOT_FOUND',
          null,
        );
      }

      if (!updateBlogPostDto.title.en || !updateBlogPostDto.description.en) {
        return translatedErrorResponse<Blog>(
          this.i18n,
          locale,
          'ENGLISH_ERROR',
          null,
        );
      }

      const currentDate = new Date();
      const generatedSlug = slugifyText(
        updateBlogPostDto.title.en,
        currentDate,
      );

      blogPost.updated_at = currentDate;
      blogPost.slug = generatedSlug;
      blogPost.title = updateBlogPostDto.title;
      blogPost.description = updateBlogPostDto.description;
      blogPost.short_description = updateBlogPostDto.shortDescription;
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
      return translatedSuccessResponse<Blog>(
        this.i18n,
        locale,
        'BLOG_POST_UPDATED',
        blogPost,
      );
    } catch (error) {
      return translatedErrorResponse<Blog>(
        this.i18n,
        locale,
        'BLOG_UPDATE_FAIL',
        error,
      );
    }
  }

  async createBlog(blogDto: BlogDto, userId: string) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const locale = this.request['language'];

    try {
      const user = await queryRunner.manager.getRepository(User).findOne({
        where: { id: userId },
        relations: ['blogs'],
      });

      if (!user) {
        return translatedErrorResponse<Blog>(
          this.i18n,
          locale,
          'USER_NOT_FOUND',
          null,
        );
      }

      if (!blogDto.title.en || !blogDto.description.en) {
        return translatedErrorResponse<Blog>(
          this.i18n,
          locale,
          'ENGLISH_ERROR',
          null,
        );
      }

      const currentDate = new Date();
      const generatedSlug = slugifyText(blogDto.title.en, currentDate);

      const blogPost = new Blog();
      blogPost.created_at = new Date();
      blogPost.views_count = 0;
      blogPost.user_id = userId;
      blogPost.blog_categories = [];
      blogPost.title = blogDto.title;
      blogPost.description = blogDto.description;
      blogPost.short_description = blogDto.shortDescription;
      blogPost.slug = generatedSlug;
      blogPost.image_large = blogDto.imageLarge;
      blogPost.image_small = blogDto.imageSmall;

      if (blogDto.categories.length === 0) {
        await queryRunner.rollbackTransaction();
        return translatedErrorResponse<Blog>(
          this.i18n,
          locale,
          'BLOG_POST_CATEGORIES_EMPTY',
          null,
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
      const singleLangBlog = await this.filterByLanguage(blogPost, locale);

      await queryRunner.manager.getRepository(User).save(user);
      await queryRunner.commitTransaction();

      return translatedSuccessResponse<Blog>(
        this.i18n,
        locale,
        'BLOG_POST_CREATED',
        singleLangBlog,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return translatedErrorResponse<Blog>(
        this.i18n,
        locale,
        'BLOG_POST_FAIL',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteBlog(blogPostId: string) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const locale = this.request['language'];

    try {
      const blogPost = await queryRunner.manager
        .getRepository(Blog)
        .findOne({ where: { id: blogPostId } });

      if (!blogPost) {
        return translatedErrorResponse<Blog>(
          this.i18n,
          locale,
          'BLOG_NOT_FOUND',
          null,
        );
      }

      blogPost.status = BlogStatus.DELETED;

      await queryRunner.manager.getRepository(Blog).save(blogPost);

      const singleLangBlog = await this.filterByLanguage(blogPost, locale);

      await queryRunner.commitTransaction();

      return translatedSuccessResponse<Blog>(
        this.i18n,
        locale,
        'BLOG_POST_DELETED',
        singleLangBlog,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return translatedErrorResponse<Blog>(
        this.i18n,
        locale,
        'BLOG_DELETE_FAIL',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async publishBlog(blogPostId: string) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const locale = this.request['language'];

    try {
      const blogPost = await queryRunner.manager
        .getRepository(Blog)
        .findOne({ where: { id: blogPostId } });

      if (!blogPost) {
        return translatedErrorResponse<Blog>(
          this.i18n,
          locale,
          'BLOG_NOT_FOUND',
          null,
        );
      }

      if (blogPost.status === BlogStatus.ACTIVE) {
        return translatedSuccessResponse<Blog>(
          this.i18n,
          locale,
          'BLOG_ALREADY_PUBLISHED',
          blogPost,
        );
      }

      const currentDate = new Date();
      blogPost.status = BlogStatus.ACTIVE;
      blogPost.updated_at = currentDate;

      await queryRunner.manager.getRepository(Blog).save(blogPost);
      const singleLangBlog = await this.filterByLanguage(blogPost, locale);

      await queryRunner.commitTransaction();
      return translatedSuccessResponse<Blog>(
        this.i18n,
        locale,
        'BLOG_PUBLISHED',
        singleLangBlog,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return translatedErrorResponse<Blog>(
        this.i18n,
        locale,
        'BLOG_PUBLISH_FAIL',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

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
  }

  async updateBlogStatus(blogPostId: string, updateStatusDto: UpdateBlogStatusDto) {
    const queryRunner =
      this.blogRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const locale = this.request['language'];

    try {
      const blogPost = await queryRunner.manager
        .getRepository(Blog)
        .findOne({ where: { id: blogPostId } });

      if (!blogPost) {
        return translatedErrorResponse<Blog>(
          this.i18n,
          locale,
          'BLOG_NOT_FOUND',
          null,
        );
      }

      if (updateStatusDto.status === BlogUpdateStatus.ACTIVE) {
        blogPost.status = BlogStatus.ACTIVE;
      } else {
        blogPost.status = BlogStatus.INACTIVE;
      }

      const currentDate = new Date();
      blogPost.updated_at = currentDate;

      await queryRunner.manager.getRepository(Blog).save(blogPost);
      const singleLangBlog = await this.filterByLanguage(blogPost, locale);

      await queryRunner.commitTransaction();
      return translatedSuccessResponse<Blog>(
        this.i18n,
        locale,
        'BLOG_POST_UPDATED',
        singleLangBlog,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return translatedErrorResponse<Blog>(
        this.i18n,
        locale,
        'BLOG_UPDATE_FAIL',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
