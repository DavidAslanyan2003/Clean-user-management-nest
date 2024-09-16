export const extractParamsFromUrl = (url: string) => {
  const parsedUrl = new URL(url);

  const queryParams = new URLSearchParams(parsedUrl.search);

  const page = queryParams.get('page');
  const limit = queryParams.get('limit');
  const orderBy = queryParams.get('orderBy');
  const sortOrder = queryParams.get('order');
  const locale = queryParams.get('locale');

  return { page, limit, orderBy, sortOrder, locale };
};

export const extractParamsFromUrlWithName = (url: string) => {
  const nameMatch = url.match(/category\/([^\/]+)\//);

  const queryParamsMatch = url.match(
    /page=(\d+)&limit=(\d+)&orderBy=([^&]+)&order=([^&]+)&locale=([^&]+)/,
  );

  return {
    name: nameMatch[1],
    page: queryParamsMatch[1],
    limit: queryParamsMatch[2],
    orderBy: queryParamsMatch[3],
    order: queryParamsMatch[4],
    locale: queryParamsMatch[5],
  };
};

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
