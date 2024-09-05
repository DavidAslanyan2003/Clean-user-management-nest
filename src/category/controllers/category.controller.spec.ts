import {
  CategoryStatus,
  SUCCESS_MESSAGE,
} from '../../helpers/constants/status';
import { CustomResponse } from '../../helpers/response/custom-response.dto';
import { CategoryController } from './category.controller';
import { CategoryDto } from '../dtos/category.dto';
import { UpdateStatusDto } from '../dtos/update-status.dto';
import { Category } from '../entities/category.entity';
import { setupTestModule } from '../../../test/test.module';
import { TestingModule } from '@nestjs/testing';
import { createMockCategoryDto } from '../../helpers/constants/mock-category-data';
import { QueryRunner, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

let mockCategory: Category;
const mockCategoryDto: CategoryDto = createMockCategoryDto();

describe('CategoryController', () => {
  let controller: CategoryController;
  let module: TestingModule;
  let queryRunner: QueryRunner;
  let repo: Repository<Category>;

  beforeAll(async () => {
    module = await setupTestModule();
    controller = await module.resolve(CategoryController);
    repo = await module.resolve(getRepositoryToken(Category));
    queryRunner = repo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  });

  afterAll(async () => {
    if (queryRunner.isTransactionActive) {
      await queryRunner.manager.getRepository(Category).delete(mockCategory.id);
      await queryRunner.commitTransaction();
    }
    await queryRunner.release();
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category with content language', async () => {
      const expectedObject = {
        name: mockCategoryDto.name.en,
        description: mockCategoryDto.description.en,
        status: CategoryStatus.Active,
        category_image: mockCategoryDto.categoryImage,
        category_icon: mockCategoryDto.categoryIcon,
      };

      const response = await controller.create(mockCategoryDto);
      mockCategory = response.data;

      const returnedObject = {
        name: mockCategory.name,
        description: mockCategory.description,
        status: mockCategory.status,
        category_image: mockCategory.category_image,
        category_icon: mockCategory.category_icon,
      };
      expect(returnedObject).toEqual(expectedObject);
    });
  });

  describe('getActiveCategories', () => {
    it('should return an array of categories with content language', async () => {
      const categoriesWithCount: { categories: Category[]; total: number } = {
        categories: [mockCategory],
        total: 1,
      };
      const result = new CustomResponse<{
        categories: Category[];
        total: number;
      }>(
        SUCCESS_MESSAGE,
        categoriesWithCount,
        null,
        'Category has been fetched successfully!',
      );

      const response = await controller.getAllCategories(1, 10, 'name', 'asc');
      expect(response).toEqual(result);
    });
  });

  describe('getCategoryByName', () => {
    it('should return an array of categories with content language', async () => {
      const categoriesWithCount: { categories: Category[]; total: number } = {
        categories: [mockCategory],
        total: 1,
      };
      const result = new CustomResponse<{
        categories: Category[];
        total: number;
      }>(
        SUCCESS_MESSAGE,
        categoriesWithCount,
        null,
        'Category has been fetched successfully!',
      );

      const response = await controller.getCategoriesByName(
        `${mockCategory.name}`.replaceAll(' ', '-'),
      );
      expect(response).toEqual(result);
    });
  });

  describe('getCategoryById', () => {
    it('should return a single category with content language', async () => {
      const response = await controller.getCategoriesById(mockCategory.id);
      const result: CustomResponse<Category> = new CustomResponse<Category>(
        SUCCESS_MESSAGE,
        mockCategory,
        null,
        'Category has been fetched successfully!',
      );

      expect(response).toEqual(result);
    });
  });

  describe('updateCategory', () => {
    it('should update a category with content language', async () => {
      const mockUpdateCategoryDto: CategoryDto = createMockCategoryDto();

      const expectedObject = {
        name: mockUpdateCategoryDto.name.en,
        description: mockUpdateCategoryDto.description.en,
        status: CategoryStatus.Active,
        category_image: mockUpdateCategoryDto.categoryImage,
        category_icon: mockUpdateCategoryDto.categoryIcon,
        id: mockCategory.id,
        created_at: mockCategory.created_at,
      };

      const newCategoryData = (
        await controller.updateCategory(mockCategory.id, mockUpdateCategoryDto)
      ).data;

      const returnedObject = {
        name: newCategoryData.name,
        description: newCategoryData.description,
        status: newCategoryData.status,
        category_image: newCategoryData.category_image,
        category_icon: newCategoryData.category_icon,
        id: mockCategory.id,
        created_at: mockCategory.created_at,
      };

      expect(returnedObject).toEqual(expectedObject);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a category with content language', async () => {
      const updateStatusDto: UpdateStatusDto = {
        status: CategoryStatus.Inactive,
      };

      const newCategoryData = (
        await controller.updateStatus(mockCategory.id, updateStatusDto)
      ).data;

      const expectedObject = {
        name: newCategoryData.name,
        description: newCategoryData.description,
        status: CategoryStatus.Inactive,
        category_image: newCategoryData.category_image,
        category_icon: newCategoryData.category_icon,
        id: mockCategory.id,
        created_at: mockCategory.created_at,
      };

      const returnedObject = {
        name: newCategoryData.name,
        description: newCategoryData.description,
        status: newCategoryData.status,
        category_image: newCategoryData.category_image,
        category_icon: newCategoryData.category_icon,
        id: mockCategory.id,
        created_at: mockCategory.created_at,
      };
      mockCategory = newCategoryData;

      expect(returnedObject).toEqual(expectedObject);
    });
  });

  describe('getInactiveCategories', () => {
    it('should return an array of categories with content language', async () => {
      const categoriesWithCount: { categories: Category[]; total: number } = {
        categories: [mockCategory],
        total: 1,
      };
      const result = new CustomResponse<{
        categories: Category[];
        total: number;
      }>(
        SUCCESS_MESSAGE,
        categoriesWithCount,
        null,
        'Category has been fetched successfully!',
      );

      const response = await controller.getInactiveCategories(
        1,
        10,
        'name',
        'asc',
      );

      expect(response).toEqual(result);
    });
  });
});
