import { Blog } from '../entities/blog.entity';
import { TestingModule } from '@nestjs/testing';
import { setupTestModule } from '../../../test/test.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { BlogCategory } from '../entities/blog-category.entity';
import { BlogCategoryDto } from '../dtos/blog-category.dto';
import { createMockBlogCategoryDto } from '../../helpers/constants/mock-blog-category-data';
import { BlogCategoryService } from './blog-category.service';
import { BlogPostCategoryStatus } from '../../helpers/enums/categoryStatus.enum';

let mockBlogCategory: BlogCategory;
const mockBlogCategoryDto: BlogCategoryDto = createMockBlogCategoryDto();
const updatedMockBlogCategoryDto: BlogCategoryDto = createMockBlogCategoryDto();

describe('BlogCategoryService', () => {
  let service: BlogCategoryService;
  let repo: Repository<BlogCategory>;
  let module: TestingModule;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    module = await setupTestModule();
    service = await module.resolve(BlogCategoryService);
    repo = await module.resolve(getRepositoryToken(BlogCategory));
    queryRunner = repo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  });

  afterAll(async () => {
    if (queryRunner.isTransactionActive) {
      await queryRunner.manager.getRepository(Blog).delete(mockBlogCategory.id);
      await queryRunner.commitTransaction();
    }
    await queryRunner.release();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new blog category', async () => {
      const response = await service.createBlogCategory(mockBlogCategoryDto);
      mockBlogCategory = response.data;

      const expectedObject = {
        category: mockBlogCategoryDto.category.en,
        status: BlogPostCategoryStatus.ACTIVE,
        id: mockBlogCategory.id,
      };

      const returnedObject = {
        category: mockBlogCategory.category,
        status: mockBlogCategory.status,
        id: mockBlogCategory.id,
      };

      expect(returnedObject).toEqual(expectedObject);
    });
  });

  describe('update', () => {
    it('should update a new blog category', async () => {
      const response = await service.updateBlogCategory(
        updatedMockBlogCategoryDto,
        mockBlogCategory.id,
      );
      mockBlogCategory = response.data;

      const expectedObject = {
        category: updatedMockBlogCategoryDto.category.en,
        status: BlogPostCategoryStatus.ACTIVE,
        id: mockBlogCategory.id,
      };

      const returnedObject = {
        category: mockBlogCategory.category.en,
        status: mockBlogCategory.status,
        id: mockBlogCategory.id,
      };

      expect(returnedObject).toEqual(expectedObject);
    });
  });

  describe('getAllBlogCategories', () => {
    it('Should return an array of all active blog categories', async () => {
      const response = await service.getAllBlogCategories();
      const { category, id, status } = mockBlogCategory;

      expect(response).toEqual(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              category: category.en,
              id: id,
              status: status,
            }),
          ]),
          message: 'Categories fetched',
          error: null,
        }),
      );
    });
  });

  describe('getBlogCategoryById', () => {
    it('Should return an active blog category', async () => {
      const response = await service.getBlogCategory(mockBlogCategory.id);
      const { category, id, status } = mockBlogCategory;

      expect(response).toEqual(
        expect.objectContaining({
          data: expect.objectContaining({
            category: category.en,
            id: id,
            status: status,
          }),
          message: 'Category fetched',
          error: null,
        }),
      );
    });
  });

  describe('delete', () => {
    it('should delete the blog category', async () => {
      const response = await service.deleteBlogPostCategory(
        mockBlogCategory.id,
      );
      mockBlogCategory = response.data;

      const expectedObject = {
        category: updatedMockBlogCategoryDto.category.en,
        status: BlogPostCategoryStatus.INACTIVE,
        id: mockBlogCategory.id,
      };

      const returnedObject = {
        category: mockBlogCategory.category,
        status: mockBlogCategory.status,
        id: mockBlogCategory.id,
      };

      expect(returnedObject).toEqual(expectedObject);
    });
  });
});
