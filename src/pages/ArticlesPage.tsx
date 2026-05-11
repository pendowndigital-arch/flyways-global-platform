import { useState, useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { Article, ApiPager } from '../models/article';
import { fetchArticles, ArticlesResponse } from '../services/articlesService';
import { Tag } from '../models/tag';
import { Search, X } from 'lucide-react';
import { Layout } from '../components/Layout';
import { RecommendedTags } from '../components/RecommendedTags';
import { articlesState } from '../state/articlesState';

export function ArticlesPage() {
  const [tags, initialData] = useLoaderData() as [Tag[], ArticlesResponse];

  const [selectedTag, setSelectedTag] = useState(articlesState.tag);
  const [dateFilter, setDateFilter] = useState(articlesState.time);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>(initialData.articles);
  const [pager, setPager] = useState<ApiPager>(initialData.pager);
  const [currentPage, setCurrentPage] = useState(articlesState.page);
  const [loading, setLoading] = useState(false);

  const fetchFiltered = (tag: string, time: string) => {
    articlesState.tag = tag;
    articlesState.time = time;
    articlesState.articles = null;
    articlesState.pager = null;
    articlesState.page = 0;
    setSelectedTag(tag);
    setDateFilter(time);
    setLoading(true);
    setArticles([]);
    setCurrentPage(0);
    fetchArticles(0, { tag: tag || undefined, time: time || undefined })
      .then(({ articles: rows, pager: p }) => {
        articlesState.articles = rows;
        articlesState.pager = p;
        setArticles(rows);
        setPager(p);
        setLoading(false);
      });
  };

  const handleTagClick = (tag: string) => fetchFiltered(tag, dateFilter);
  const handleClearTag = () => fetchFiltered('', dateFilter);
  const handleCategoryChange = (value: string) => fetchFiltered(value === 'All' ? '' : value, dateFilter);
  const handleDateChange = (time: string) => fetchFiltered(selectedTag, time);

  const loadMore = () => {
    if (!pager || currentPage >= pager.total_pages - 1 || loading) return;
    const nextPage = currentPage + 1;
    setLoading(true);
    fetchArticles(nextPage, { tag: selectedTag || undefined, time: dateFilter || undefined })
      .then(({ articles: rows, pager: p }) => {
        setArticles((prev) => {
          const merged = [...prev, ...rows];
          articlesState.articles = merged;
          return merged;
        });
        articlesState.pager = p;
        articlesState.page = nextPage;
        setPager(p);
        setCurrentPage(nextPage);
        setLoading(false);
      });
  };

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return articles;
    return articles.filter(({ title, excerpt, tags: t }) =>
      title.toLowerCase().includes(q) ||
      excerpt.toLowerCase().includes(q) ||
      t.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [articles, searchQuery]);

  const categories = ['All', ...tags.map((t) => t.name)];
  const hasMore = pager ? currentPage < pager.total_pages - 1 : false;
  const totalItems = pager?.total_items ?? 0;

  return (
    <Layout rightPanel={
      <RecommendedTags
        tags={tags}
        onTagSelect={(tag) => fetchFiltered(tag === 'All' ? '' : tag, dateFilter)}
      />
    }>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by title, summary or tag…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <select
            value={selectedTag || 'All'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => handleDateChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Time</option>
            <option value="-30day">Within 1 Month</option>
            <option value="-60day">Within 3 Months</option>
            <option value="-180day">Within 6 Months</option>
          </select>

          {selectedTag && (
            <span className="flex items-center gap-1.5 px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg">
              #{selectedTag}
              <button onClick={handleClearTag} className="hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-5">
          Showing <span className="font-medium text-gray-700">{filteredArticles.length}</span> of{' '}
          <span className="font-medium text-gray-700">{totalItems}</span> article{totalItems !== 1 ? 's' : ''}
        </p>

        {/* Articles */}
        {loading && articles.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} onTagClick={handleTagClick} showCategoryBadge={false} activeTag={selectedTag || null} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading…' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <Search className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No articles match your criteria</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or clearing filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
