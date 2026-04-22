import { Article, ArticleDetail, ApiArticleRow, ApiArticleDetail, ApiPager } from '../models/article';
import { ENDPOINTS } from '../config/api';

export interface ArticlesResponse {
  articles: Article[];
  pager: ApiPager;
}

function parseTags(raw: string): string[] {
  return raw ? raw.split(',').map((t) => t.trim()).filter(Boolean) : [];
}

function mapArticle(row: ApiArticleRow): Article {
  const tags = parseTags(row.tags);
  return {
    id: row.id,
    uid: row.uid,
    title: row.title,
    excerpt: row.summary,
    image: row.image,
    readTime: row.reading_time,
    tags,
    category: tags[0] ?? '',
    publishedDate: row.created ? new Date(Number(row.created) * 1000) : undefined,
  };
}

function mapArticleDetail(row: ApiArticleDetail): ArticleDetail {
  return {
    id: row.id,
    uid: row.uid,
    title: row.title,
    image: row.image,
    body: row.body,
    readTime: row.reading_time,
    tags: parseTags(row.tags),
  };
}

const _pageCache = new Map<number, Promise<ArticlesResponse>>();

export function fetchArticles(page = 0): Promise<ArticlesResponse> {
  if (!_pageCache.has(page)) {
    _pageCache.set(
      page,
      fetch(`${ENDPOINTS.articles}&page=${page}`)
        .then((res) => res.json())
        .then((data) => ({
          articles: (data.rows ?? []).map(mapArticle),
          pager: data.pager,
        }))
    );
  }
  return _pageCache.get(page)!;
}

export async function fetchArticleByUid(uid: string): Promise<ArticleDetail | null> {
  const res = await fetch(ENDPOINTS.articleDetail(uid));
  const data: ApiArticleDetail[] = res.ok ? await res.json() : [];
  return data.length > 0 ? mapArticleDetail(data[0]) : null;
}
