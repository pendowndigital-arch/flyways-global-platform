// App models
export interface Article {
  id: string;
  uid: string;
  title: string;
  excerpt: string;   // from API `summary`
  image: string;
  readTime: string;  // from API `reading_time`
  tags: string[];    // split from comma-separated API `tags`
  category: string;  // derived from first tag
  publishedDate?: Date; // from API `created` (Unix timestamp)
  views?: number;
}

export interface ArticleDetail {
  id: string;
  uid: string;
  title: string;
  image: string;
  body: string;      // HTML — from API `body`
  readTime: string;  // from API `reading_time`
  tags: string[];
  sources: string[]; // from API `content_source`
}

// Raw API shapes
export interface ApiArticleRow {
  id: string;
  uid: string;
  title: string;
  summary: string;
  image: string;
  reading_time: string;
  tags: string;
  created?: string; // Unix timestamp string
}

export interface ApiArticleDetail {
  id: string;
  uuid: string;
  title: string;
  image: string;
  body: string;
  reading_time: string;
  tags: string;
  content_source?: string[];
}

export interface ApiPager {
  current_page: number;
  total_items: number;
  total_pages: number;
  items_per_page: number;
}

export type CategoryFilter = string;
export type DateFilter = 'all' | '1month' | '3months' | '6months';
