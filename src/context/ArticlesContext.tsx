import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchArticles } from '../services/articlesService';
import { Article, ApiPager } from '../models/article';

interface ArticlesContextValue {
  articles: Article[];
  pager: ApiPager | null;
  currentPage: number;
  loading: boolean;
  loadMore: () => void;
}

const ArticlesContext = createContext<ArticlesContextValue>({
  articles: [],
  pager: null,
  currentPage: 0,
  loading: true,
  loadMore: () => {},
});

export function ArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pager, setPager] = useState<ApiPager | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles(0).then(({ articles: rows, pager: p }) => {
      setArticles(rows);
      setPager(p);
      setLoading(false);
    });
  }, []);

  const loadMore = () => {
    if (!pager || currentPage >= pager.total_pages - 1 || loading) return;
    const nextPage = currentPage + 1;
    setLoading(true);
    fetchArticles(nextPage).then(({ articles: rows, pager: p }) => {
      setArticles((prev) => [...prev, ...rows]);
      setPager(p);
      setCurrentPage(nextPage);
      setLoading(false);
    });
  };

  return (
    <ArticlesContext.Provider value={{ articles, pager, currentPage, loading, loadMore }}>
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles() {
  return useContext(ArticlesContext);
}
