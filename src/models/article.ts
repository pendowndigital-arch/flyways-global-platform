export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishedDate: Date;
  category: string;
  readTime: number; // in minutes
  views: number;
}

export type DateFilter = 'all' | '1month' | '3months' | '6months';
export type CategoryFilter = string;