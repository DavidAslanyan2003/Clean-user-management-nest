import { createMockBlogDto } from "../../helpers/constants/mock-blog-data";
import { BlogDto } from "../dtos/blog.dto";
import { Blog } from "../entities/blog.entity";
import { BlogService } from "./blog.service";
import { TestingModule } from "@nestjs/testing";
import { setupTestModule } from '../../../test/test.module';
import { getRepositoryToken } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import { BlogStatus } from "../../helpers/enums/blogStatus.enum";
import { UpdateBlogDto } from "../dtos/update-blog.dto";
import { updateMockBlogDto } from "../../helpers/constants/mock-update-blog-data";


let mockBlog: Blog;
const mockBlogDto: BlogDto = createMockBlogDto();
const mockUpdateBlogDto: UpdateBlogDto = updateMockBlogDto();

describe('BlogService', () => {
  let service: BlogService;
  let repo: Repository<Blog>;
  let module: TestingModule;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    module = await setupTestModule();
    service = await module.resolve(BlogService);
    repo = await module.resolve(getRepositoryToken(Blog));
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
    expect(service).toBeDefined();
  });


  describe('createBlog', () => {
    it('should create a new blog', async () => {
      const userId = '60bbd60c-ce41-4a71-bd60-ee61648a1bcf';
      const response = await service.createBlog(mockBlogDto, userId);
      mockBlog = response.data;
      
      const expectedObject = {
        created_at: mockBlog.created_at,
        views_count: 0,
        user_id: userId,
        title: mockBlogDto.title.en,
        description: mockBlogDto.description.en,
        short_description: mockBlogDto.title.en,
        slug: mockBlog.slug,
        blog_categories: mockBlog.blog_categories,
        image_large: mockBlogDto.imageLarge,
        image_small: mockBlogDto.imageSmall,
        updated_at: null,
        status: BlogStatus.DRAFT,
        id: mockBlog.id
      };

      const returnedObject = {
        created_at: mockBlog.created_at,
        views_count: mockBlog.views_count,
        user_id: mockBlog.user_id,
        title: mockBlog.title,
        description: mockBlog.description,
        short_description: mockBlog.title,
        slug: mockBlog.slug,
        blog_categories: mockBlog.blog_categories,
        image_large: mockBlog.image_large,
        image_small: mockBlog.image_small,
        updated_at: mockBlog.updated_at,
        status: mockBlog.status,
        id: mockBlog.id
      };
      expect(returnedObject).toEqual(expectedObject);
    })
  });

  describe('updateBlog', () => {
    it('Should update the blog', async () => {
      const response = await service.updateBlog(mockUpdateBlogDto, mockBlog.id);
      mockBlog = response.data;

      const expectedObject = {
        created_at: mockBlog.created_at,
        views_count: mockUpdateBlogDto.viewsCount,
        user_id: '60bbd60c-ce41-4a71-bd60-ee61648a1bcf',
        title: mockUpdateBlogDto.title,
        description: mockUpdateBlogDto.description,
        short_description: mockUpdateBlogDto.title,
        slug: mockBlog.slug,
        blog_categories: mockBlog.blog_categories,
        image_large: mockUpdateBlogDto.imageLarge,
        image_small: mockUpdateBlogDto.imageSmall,
        updated_at: mockBlog.updated_at,
        status: BlogStatus.DRAFT,
        id: mockBlog.id
      };

      const returnedObject = {
        created_at: mockBlog.created_at,
        views_count: mockBlog.views_count,
        user_id: mockBlog.user_id,
        title: mockBlog.title,
        description: mockBlog.description,
        short_description: mockBlog.title,
        slug: mockBlog.slug,
        blog_categories: mockBlog.blog_categories,
        image_large: mockBlog.image_large,
        image_small: mockBlog.image_small,
        updated_at: mockBlog.updated_at,
        status: mockBlog.status,
        id: mockBlog.id
      };

      expect(returnedObject).toEqual(expectedObject);
    })
  });

  
  describe('publishBlog', () => {
    it('Should publish a blog', async () => {
      const response = await service.publishBlog(mockBlog.id);
      mockBlog = response.data;

      const expectedObject = {
        id: mockBlog.id,
        user_id: "60bbd60c-ce41-4a71-bd60-ee61648a1bcf",
        slug: mockBlog.slug,
        title: mockUpdateBlogDto.title.en,
        short_description: mockUpdateBlogDto.shortDescription.en,
        description: mockUpdateBlogDto.description.en,
        created_at: mockBlog.created_at,
        updated_at: mockBlog.updated_at,
        image_large: mockUpdateBlogDto.imageLarge,
        image_small: mockUpdateBlogDto.imageSmall,
        views_count: mockBlog.views_count,
        status: BlogStatus.ACTIVE
      };
 
      const returnedObject = {
        id: mockBlog.id,
        user_id: "60bbd60c-ce41-4a71-bd60-ee61648a1bcf",
        slug: mockBlog.slug,
        title: mockBlog.title,
        short_description: mockBlog.short_description,
        description: mockBlog.description,
        created_at: mockBlog.created_at,
        updated_at: mockBlog.updated_at,
        image_large: mockBlog.image_large,
        image_small: mockBlog.image_small,
        views_count: mockBlog.views_count,
        status: mockBlog.status
      };

      expect(returnedObject).toEqual(expectedObject);
    })
  });


  describe('getAllBlogs', () => {
    it('Should return an array of all active blogs', async () => {
      const { created_at, updated_at, ...restOfMockBlog } = mockBlog;
      const response = await service.getAllBlogs();

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
        })
      );
    });
  });


  describe('getBlogByBlogId', () => {
    it('Should return a single blog', async () => {
      const { created_at, updated_at, ...restOfMockBlog } = mockBlog;
      const response = await service.getBlog(mockBlog.id);

      expect(response).toEqual(
        expect.objectContaining({
          data: expect.objectContaining({
                ...restOfMockBlog,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
          message: 'Blog post fetched',
          error: null,
        })
      );
    });
  });


  describe('getBlogsByUserId', () => {
    it('Should return an array of blogs with the same user id', async () => {
      const { created_at, updated_at, ...restOfMockBlog } = mockBlog;
      const response = await service.getBlog(null, null, mockBlog.user_id);

      expect(response).toEqual(
        expect.objectContaining({
          data:  expect.arrayContaining([
              expect.objectContaining({
                ...restOfMockBlog,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ]),
          message: 'Blog post fetched',
          error: null,
        })
      );
    });
  });
  

  describe('deleteBlog', () => {
    it('Should delete a blog', async () => {
      const response = await service.deleteBlog(mockBlog.id);
      mockBlog = response.data;

      const expectedObject = {
        id: mockBlog.id,
        user_id: "60bbd60c-ce41-4a71-bd60-ee61648a1bcf",
        slug: mockBlog.slug,
        title: mockUpdateBlogDto.title.en,
        short_description: mockUpdateBlogDto.shortDescription.en,
        description: mockUpdateBlogDto.description.en,
        created_at: mockBlog.created_at,
        updated_at: mockBlog.updated_at,
        image_large: mockUpdateBlogDto.imageLarge,
        image_small: mockUpdateBlogDto.imageSmall,
        views_count: mockBlog.views_count,
        status: BlogStatus.DELETED
      };

      const returnedObject = {
        id: mockBlog.id,
        user_id: "60bbd60c-ce41-4a71-bd60-ee61648a1bcf",
        slug: mockBlog.slug,
        title: mockBlog.title,
        short_description: mockBlog.short_description,
        description: mockBlog.description,
        created_at: mockBlog.created_at,
        updated_at: mockBlog.updated_at,
        image_large: mockBlog.image_large,
        image_small: mockBlog.image_small,
        views_count: mockBlog.views_count,
        status: mockBlog.status
      };

      expect(returnedObject).toEqual(expectedObject);
    })
  });
})