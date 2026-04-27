const BASE = import.meta.env.VITE_API_BASE_URL ?? '';
export const ASSETS_BASE = BASE.replace(/\/api$/, '');

export const ENDPOINTS = {
  categories: `${BASE}/categories?_format=json`,
  articles: `${BASE}/articles?_format=json`,
  articleDetail: (uid: string) => `${BASE}/article/${uid}`,
  stats: `${BASE}/stats?_format=json`,
  popularArticles: `${BASE}/popular_articles?_format=json`,
};
