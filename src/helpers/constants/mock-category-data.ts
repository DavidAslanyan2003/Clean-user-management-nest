import { faker } from '@faker-js/faker';
import { CategoryDto } from '../../category/dtos/category.dto';

export const createMockCategoryDto = (
  overrides: Partial<CategoryDto> = {},
): CategoryDto => {
  return {
    name: {
      en: faker.lorem.lines(),
      hy: faker.lorem.lines(),
      ru: faker.lorem.lines(),
    },
    description: {
      en: faker.commerce.productDescription(),
      hy: faker.lorem.sentence(),
      ru: faker.lorem.sentence(),
    },
    categoryImage: faker.image.url(),
    categoryIcon: faker.image.url(),
    ...overrides,
  };
};
