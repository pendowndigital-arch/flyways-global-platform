import { Article, ApiPager } from '../models/article';

export const articlesState: {
  tag: string;
  time: string;
  articles: Article[] | null;
  pager: ApiPager | null;
  page: number;
} = { tag: '', time: '', articles: null, pager: null, page: 0 };
