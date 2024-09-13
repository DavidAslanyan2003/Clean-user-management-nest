import * as path from 'path';

export const DEFAULT_LANGUAGE = 'en';

export const CATEGORY_NOT_FOUND = 'Category not found';

export const ERROR_FILE_PATH = 'error-messages';
export const SUCCESS_FILE_PATH = 'success-messages';

export const generateActiveCategoriesCacheKey = (
  page: number,
  limit: number,
  orderBy: string,
  sortOrder: string,
  locale: string,
): string => {
  return `http://api.icketi.am/api/v1/category?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${sortOrder}&locale=${locale}`;
};

export const generateCategoriesWithGivenNameCacheKey = (
  page: number,
  limit: number,
  orderBy: string,
  sortOrder: string,
  locale: string,
  name: string,
): string => {
  return `http://api.icketi.am/api/v1/category/${name}/page=${page}&limit=${limit}&orderBy=${orderBy}&order=${sortOrder}&locale=${locale}`;
};

export const generateInactiveCategoriesCacheKey = (
  page: number,
  limit: number,
  orderBy: string,
  sortOrder: string,
  locale: string,
): string => {
  return `http://api.icketi.am/api/v1/category/inactive?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${sortOrder}&locale=${locale}`;
};

export const activeCategoryParamsFilePath =
  'src/helpers/constants/active-category-params.json';
export const categoriesWithGivenNameParamsFilePath =
  'src/helpers/constants/category-with-given-name-params.json';
export const inactiveCategoryParamsFilePath =
  'src/helpers/constants/inactive-category-params.json';
