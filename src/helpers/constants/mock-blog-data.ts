import { faker } from '@faker-js/faker';
import { BlogDto } from '../../blog/dtos/blog.dto';

export const createMockBlogDto = (
  overrides: Partial<BlogDto> = {},
): BlogDto => {
  return {
    title: {
      en: faker.string.sample(50),
      hy: faker.string.sample(50),
      ru: faker.string.sample(50),
    },
    shortDescription: {
      en: faker.string.sample(100),
      hy: faker.string.sample(100),
      ru: faker.string.sample(100),
    },
    description: {
      en: faker.string.sample(200),
      hy: faker.string.sample(200),
      ru: faker.string.sample(200),
    },
    categories: ['58bf3938-ff33-479b-a216-88edec5cc91e'],
    imageLarge: faker.image.url(),
    imageSmall: faker.image.url(),
    images: [faker.image.url()],
    ...overrides,
  };
};
