import { Article } from '../models/article';
import { ENDPOINTS, ASSETS_BASE } from '../config/api';

interface ApiPopularArticleRow {
  id: string;
  uid: string;
  title: string;
  summary: string;
  image: string;
  reading_time: string;
  tags: string;
  popular: string;
}

function parseTags(raw: string): string[] {
  return raw ? raw.split(',').map((t) => t.trim()).filter(Boolean) : [];
}

function mapArticle(row: ApiPopularArticleRow): Article {
  const tags = parseTags(row.tags);
  return {
    id: row.id,
    uid: row.uid,
    title: row.title,
    excerpt: row.summary,
    image: row.image ? `${ASSETS_BASE}${row.image}` : '',
    readTime: row.reading_time,
    tags,
    category: tags[0] ?? '',
  };
}

let _cache: Promise<Article[]> | null = null;

export function fetchPopularArticles(): Promise<Article[]> {
  if (!_cache) {
    _cache = fetch(ENDPOINTS.popularArticles)
      .then((res) => res.json())
      .then((data) => (data.rows ?? []).map(mapArticle));
  }
  return _cache;
}
