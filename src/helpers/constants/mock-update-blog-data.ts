import { faker } from '@faker-js/faker';
import { UpdateBlogDto } from 'src/blog/dtos/update-blog.dto';

export const updateMockBlogDto = (
  overrides: Partial<UpdateBlogDto> = {},
): UpdateBlogDto => {
  return {
    viewsCount: 5,
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
    categories: ["58bf3938-ff33-479b-a216-88edec5cc91e"],
    imageLarge: faker.image.url(),
    imageSmall: faker.image.url(),
    ...overrides,
  };
};
 