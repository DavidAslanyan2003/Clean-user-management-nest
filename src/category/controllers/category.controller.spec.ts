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

      const expoectedObject = {
        name: 'Electronics',
        description: 'All electronic items',
        status: CategoryStatus.Active,
        category_image: 'https://s3.amazonaws.com/bucket-name/path-to-image',
        category_icon: 'https://s3.amazonaws.com/bucket-name/path-to-icon',
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
      expect(returnedObject).toEqual(expoectedObject);
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

      jest.spyOn(service, 'getCategoryByName').mockResolvedValue(result);

      const req = {
        headers: { 'content-language': 'en' },
      } as unknown as Request;
      const response = await controller.getCategoriesByName('Electronics');

      expect(response).toEqual(result);
    });
  });

  describe('getCategoryById', () => {
    it('should return a single category with content language', async () => {
      jest.spyOn(service, 'getCategoryById').mockResolvedValue(mockCategory);

      const req = {
        headers: { 'content-language': 'en' },
      } as unknown as Request;

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

      const expoectedObject = {
        name: 'Electronics1',
        description: 'All electronic items1',
        status: CategoryStatus.Active,
        category_image: 'https://s3.amazonaws.com/bucket-name/path-to-image',
        category_icon: 'https://s3.amazonaws.com/bucket-name/path-to-icon',
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

      expect(returnedObject).toEqual(expoectedObject);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a category with content language', async () => {
      const updateStatusDto: UpdateStatusDto = {
        status: CategoryStatus.Inactive,
      };

      const req = {
        headers: { 'content-language': 'en' },
      } as unknown as Request;
      const newCategoryData = (
        await controller.updateStatus(mockCategory.id, updateStatusDto)
      ).data;

      const expoectedObject = {
        name: 'Electronics1',
        description: 'All electronic items1',
        status: CategoryStatus.Inactive,
        category_image: 'https://s3.amazonaws.com/bucket-name/path-to-image',
        category_icon: 'https://s3.amazonaws.com/bucket-name/path-to-icon',
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

      expect(returnedObject).toEqual(expoectedObject);
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

      expect(response).toEqual(result);
    });
  });
});
