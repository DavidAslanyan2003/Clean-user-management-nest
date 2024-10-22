import { createMockBlogDto } from '../../helpers/constants/mock-blog-data';
import { BlogDto } from '../dtos/blog.dto';
import { Blog } from '../entities/blog.entity';
import { BlogController } from './blog.controller';
import { TestingModule } from '@nestjs/testing';
import { QueryRunner, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlogStatus } from '../../helpers/enums/blogStatus.enum';
import { setupTestModule } from '../../../test/test.module';
import { UpdateBlogDto } from '../dtos/update-blog.dto';
import { updateMockBlogDto } from '../../helpers/constants/mock-update-blog-data';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategory } from '../entities/blog-category.entity';
import { createMockBlogCategoryDto } from '../../helpers/constants/mock-blog-category-data';
import { BlogCategoryDto } from '../dtos/blog-category.dto';

let mockBlog: Blog;
const mockBlogDto: BlogDto = createMockBlogDto();
const mockUpdateBlogDto: UpdateBlogDto = updateMockBlogDto();
const mockBlogCategoryDto: BlogCategoryDto = createMockBlogCategoryDto();

describe('BlogController', () => {
  let controller: BlogController;
  let blogCategoryController: BlogCategoryController;
  let module: TestingModule;
  let queryRunner: QueryRunner;
  let repo: Repository<Blog>;
  let blogCategoryRepo: Repository<BlogCategory>;

  beforeAll(async () => {
    module = await setupTestModule();
    controller = await module.resolve(BlogController);
    blogCategoryController = await module.resolve(BlogCategoryController);
    repo = await module.resolve(getRepositoryToken(Blog));
    blogCategoryRepo = await module.resolve(getRepositoryToken(BlogCategory));
    queryRunner = repo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  });

  afterAll(async () => {
    if (queryRunner.isTransactionActive) {
      await queryRunner.manager.getRepository(Blog).delete(mockBlog.id);
      await queryRunner.commitTransaction();
    }
    await queryRunner.release();
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a blog', async () => {
      const newBlogCategory = await blogCategoryController.createCategory(
        mockBlogCategoryDto,
      );
      mockBlogDto.categories = [];
      mockBlogDto.categories.push(newBlogCategory.data.id);

      const response = await controller.createBlogPost(mockBlogDto);
      mockBlog = response.data;

      const expectedObject = {
        created_at: mockBlog.created_at,
        views_count: 0,
        user_id: '60bbd60c-ce41-4a71-bd60-ee61648a1bcf',
        title: mockBlogDto.title.en,
        description: mockBlogDto.description.en,
        short_description: mockBlogDto.shortDescription.en,
        slug: mockBlog.slug,
        blog_categories: mockBlog.blog_categories,
        image_large: mockBlogDto.imageLarge,
        image_small: mockBlogDto.imageSmall,
        updated_at: null,
        status: BlogStatus.DRAFT,
        id: mockBlog.id,
      };

      const returnedObject = {
        created_at: mockBlog.created_at,
        views_count: mockBlog.views_count,
        user_id: mockBlog.user_id,
        title: mockBlog.title,
        description: mockBlog.description,
        short_description: mockBlog.short_description,
        slug: mockBlog.slug,
        blog_categories: mockBlog.blog_categories,
        image_large: mockBlog.image_large,
        image_small: mockBlog.image_small,
        updated_at: mockBlog.updated_at,
        status: mockBlog.status,
        id: mockBlog.id,
      };

      expect(returnedObject).toEqual(expectedObject);
    });
  });

  describe('updateBlog', () => {
    it('Should update a blog', async () => {
      const newBlogCategory = await blogCategoryController.createCategory(
        mockBlogCategoryDto,
      );
      mockUpdateBlogDto.categories = [];
      mockUpdateBlogDto.categories.push(newBlogCategory.data.id);
      const response = await controller.updateBlogPost(
        mockBlog.id,
        mockUpdateBlogDto,
      );
      mockBlog = response.data;

      const expectedObject = {
        created_at: mockBlog.created_at,
        views_count: mockUpdateBlogDto.viewsCount,
        user_id: '60bbd60c-ce41-4a71-bd60-ee61648a1bcf',
        title: mockUpdateBlogDto.title,
        description: mockUpdateBlogDto.description,
        short_description: mockUpdateBlogDto.shortDescription,
        slug: mockBlog.slug,
        blog_categories: mockBlog.blog_categories,
        image_large: mockUpdateBlogDto.imageLarge,
        image_small: mockUpdateBlogDto.imageSmall,
        updated_at: mockBlog.updated_at,
        status: BlogStatus.DRAFT,
        id: mockBlog.id,
      };

      const returnedObject = {
        created_at: mockBlog.created_at,
        views_count: mockBlog.views_count,
        user_id: mockBlog.user_id,
        title: mockBlog.title,
        description: mockBlog.description,
        short_description: mockBlog.short_description,
        slug: mockBlog.slug,
        blog_categories: mockBlog.blog_categories,
        image_large: mockBlog.image_large,
        image_small: mockBlog.image_small,
        updated_at: mockBlog.updated_at,
        status: mockBlog.status,
        id: mockBlog.id,
      };

      expect(returnedObject).toEqual(expectedObject);
    });
  });

  describe('publishBlog', () => {
    it('Should publish a blog', async () => {
      const response = await controller.publishBlogPost(mockBlog.id);
      mockBlog = response.data;

      const expectedObject = {
        id: mockBlog.id,
        user_id: '60bbd60c-ce41-4a71-bd60-ee61648a1bcf',
        slug: mockBlog.slug,
        title: mockUpdateBlogDto.title.en,
        short_description: mockUpdateBlogDto.shortDescription.en,
        description: mockUpdateBlogDto.description.en,
        created_at: mockBlog.created_at,
        updated_at: mockBlog.updated_at,
        image_large: mockUpdateBlogDto.imageLarge,
        image_small: mockUpdateBlogDto.imageSmall,
        views_count: mockBlog.views_count,
        status: BlogStatus.ACTIVE,
      };

      const returnedObject = {
        id: mockBlog.id,
        user_id: '60bbd60c-ce41-4a71-bd60-ee61648a1bcf',
        slug: mockBlog.slug,
        title: mockBlog.title,
        short_description: mockBlog.short_description,
        description: mockBlog.description,
        created_at: mockBlog.created_at,
        updated_at: mockBlog.updated_at,
        image_large: mockBlog.image_large,
        image_small: mockBlog.image_small,
        views_count: mockBlog.views_count,
        status: mockBlog.status,
      };

      expect(returnedObject).toEqual(expectedObject);
    });
  });

  describe('getAllBlogs', () => {
    it('Should return an array of all active blogs', async () => {
      const { created_at, updated_at, ...restOfMockBlog } = mockBlog;
      const response = await controller.getAllBlogPosts();

      expect(response).toEqual(
        expect.objectContaining({
          data: expect.objectContaining({
            filteredBlogPosts: expect.arrayContaining([
              expect.objectContaining({
                ...restOfMockBlog,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ]),
          }),
          message: 'All blogs have been fetched successfully!',
          error: null,
        }),
      );
    });
  });

  describe('getBlogByBlogId', () => {
    it('Should return a single blog', async () => {
      const { created_at, updated_at, ...restOfMockBlog } = mockBlog;
      const response = await controller.getBlogPost(mockBlog.id);

      expect(response).toEqual(
        expect.objectContaining({
          data: expect.objectContaining({
            ...restOfMockBlog,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
          message: 'Blog post fetched',
          error: null,
        }),
      );
    });
  });

  describe('getBlogsByCategoryId', () => {
    it('Should return an array of blogs with the same category id', async () => {
      const { created_at, updated_at, ...restOfMockBlog } = mockBlog;
      const blogCategoryId = (await controller.getBlogPost(mockBlog.id)).data
        .blog_categories[0].id;
      const response = await controller.getBlogPost(null, blogCategoryId);

      expect(response).toEqual(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              ...restOfMockBlog,
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ]),
          message: 'Blog post fetched',
          error: null,
        }),
      );
    });
  });

  describe('getBlogsByUserId', () => {
    it('Should return an array of blogs with the same user id', async () => {
      const { created_at, updated_at, ...restOfMockBlog } = mockBlog;
      const response = await controller.getBlogPost(
        null,
        null,
        mockBlog.user_id,
      );

      expect(response).toEqual(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              ...restOfMockBlog,
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ]),
          message: 'Blog post fetched',
          error: null,
        }),
      );
    });
  });

  describe('deleteBlog', () => {
    it('Should delete a blog', async () => {
      const response = await controller.deleteBlogPost(mockBlog.id);
      mockBlog = response.data;

      const expectedObject = {
        id: mockBlog.id,
        user_id: '60bbd60c-ce41-4a71-bd60-ee61648a1bcf',
        slug: mockBlog.slug,
        title: mockUpdateBlogDto.title.en,
        short_description: mockUpdateBlogDto.shortDescription.en,
        description: mockUpdateBlogDto.description.en,
        created_at: mockBlog.created_at,
        updated_at: mockBlog.updated_at,
        image_large: mockUpdateBlogDto.imageLarge,
        image_small: mockUpdateBlogDto.imageSmall,
        views_count: mockBlog.views_count,
        status: BlogStatus.DELETED,
      };

      const returnedObject = {
        id: mockBlog.id,
        user_id: '60bbd60c-ce41-4a71-bd60-ee61648a1bcf',
        slug: mockBlog.slug,
        title: mockBlog.title,
        short_description: mockBlog.short_description,
        description: mockBlog.description,
        created_at: mockBlog.created_at,
        updated_at: mockBlog.updated_at,
        image_large: mockBlog.image_large,
        image_small: mockBlog.image_small,
        views_count: mockBlog.views_count,
        status: mockBlog.status,
      };

      expect(returnedObject).toEqual(expectedObject);
    });
  });
});
