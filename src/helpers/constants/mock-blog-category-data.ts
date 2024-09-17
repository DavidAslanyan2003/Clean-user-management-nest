import { faker } from '@faker-js/faker';
import { BlogCategoryDto } from 'src/blog/dtos/blog-category.dto';
import { UpdateBlogDto } from 'src/blog/dtos/update-blog.dto';

export const createMockBlogCategoryDto = (
  overrides: Partial<BlogCategoryDto> = {},
): BlogCategoryDto => {
  return {
    category: {
      en: faker.string.sample(100),
      hy: faker.string.sample(100),
      ru: faker.string.sample(100),
    },
    ...overrides,
  };
};
