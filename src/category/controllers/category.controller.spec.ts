import { CategoryService } from '../services/category.service';
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

let mockCategory: Category;

const mockCategoryDto: CategoryDto = {
  name: { en: 'Electronics', hy: 'Էլեկտրոնիկա', ru: 'Электроника' },
  description: {
    en: 'All electronic items',
    hy: 'Բոլոր էլեկտրոնային իրերը',
    ru: 'Все электронные товары',
  },
  category_image: 'https://s3.amazonaws.com/bucket-name/path-to-image',
  category_icon: 'https://s3.amazonaws.com/bucket-name/path-to-icon',
};

const categoryResult: CustomResponse<Category> = new CustomResponse<Category>(
  SUCCESS_MESSAGE,
  mockCategory,
  null,
  'Category has been created successfully!',
);

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module = await setupTestModule();
    controller = await module.resolve(CategoryController);
    service = await module.resolve(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category with content language', async () => {
      jest.spyOn(service, 'createCategory').mockResolvedValue(mockCategory);

      const req = {
        headers: { 'content-language': 'en' },
      } as unknown as Request;

      const response = await controller.create(mockCategoryDto);
      mockCategory = response.data;

      expect(response.status).toBe(SUCCESS_MESSAGE);
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

      jest.spyOn(service, 'getActiveCategories').mockResolvedValue(result);

      const req = {
        headers: { 'content-language': 'en' },
      } as unknown as Request;
      const response = await controller.getAllCategories(1, 10, 'name', 'asc');
      expect(response).toBe(result);
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

      jest.spyOn(service, 'getInactiveCategories').mockResolvedValue(result);

      const req = {
        headers: { 'content-language': 'en' },
      } as unknown as Request;
      const response = await controller.getInactiveCategories(
        1,
        10,
        'name',
        'asc',
      );

      expect(response).toBe(result);
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

      jest.spyOn(service, 'getCategoryByName').mockResolvedValue(result);

      const req = {
        headers: { 'content-language': 'en' },
      } as unknown as Request;
      const response = await controller.getCategoriesByName('Electronics');

      expect(response).toBe(result);
    });
  });

  describe('getCategoryById', () => {
    it('should return a single category with content language', async () => {
      jest.spyOn(service, 'getCategoryById').mockResolvedValue(mockCategory);

      const req = {
        headers: { 'content-language': 'en' },
      } as unknown as Request;

      const response = await controller.getCategoriesById(mockCategory.id);
      categoryResult.message = 'Category has been fetched successfully!';
      expect(response).toBe(categoryResult);
    });
  });

  describe('updateCategory', () => {
    it('should update a category with content language', async () => {
      const mockUpdateCategoryDto: CategoryDto = {
        name: { en: 'Electronics1', hy: 'Էլեկտրոնիկա1', ru: 'Электроника1' },
        description: {
          en: 'All electronic items1',
          hy: 'Բոլոր էլեկտրոնային իրերը1',
          ru: 'Все электронные товары1',
        },
        category_image: 'https://s3.amazonaws.com/bucket-name/path-to-image',
        category_icon: 'https://s3.amazonaws.com/bucket-name/path-to-icon',
      };

      const req = {
        headers: { 'content-language': 'en' },
      } as unknown as Request;
      const response = await controller.updateCategory(
        mockCategory.id,
        mockUpdateCategoryDto,
      );
      expect(response.data).toEqual(
        expect.objectContaining({
          name: 'Electronics1',
          description: 'All electronic items1',
          id: mockCategory.id,
          created_at: mockCategory.created_at,
        }),
      );
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a category with content language', async () => {
      const updateStatusDto: UpdateStatusDto = {
        status: CategoryStatus.Active,
      };

      const req = {
        headers: { 'content-language': 'en' },
      } as unknown as Request;
      const response = await controller.updateStatus(
        mockCategory.id,
        updateStatusDto,
      );

      expect(response.data).toEqual(
        expect.objectContaining({
          id: mockCategory.id,
          created_at: mockCategory.created_at,
          status: CategoryStatus.Active,
        }),
      );
    });
  });
});
