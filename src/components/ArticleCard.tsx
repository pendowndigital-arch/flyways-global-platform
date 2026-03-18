import { Article } from '../models/article';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye, Calendar } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onTagClick: (tag: string) => void;
}

const CATEGORY: Record<string, { badge: string; border: string }> = {
  Visa:        { badge: 'bg-blue-50 text-blue-700 border-blue-200',     border: 'border-l-blue-500' },
  Scholarship: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', border: 'border-l-emerald-500' },
  Living:      { badge: 'bg-orange-50 text-orange-700 border-orange-200',   border: 'border-l-orange-500' },
  Regulation:  { badge: 'bg-purple-50 text-purple-700 border-purple-200',   border: 'border-l-purple-500' },
};
const DEFAULT = { badge: 'bg-gray-50 text-gray-600 border-gray-200', border: 'border-l-gray-400' };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

function formatViews(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);
}

export function ArticleCard({ article, onTagClick }: ArticleCardProps) {
  const navigate = useNavigate();
  const { badge, border } = CATEGORY[article.category] ?? DEFAULT;

  return (
    <div
      onClick={() => navigate(`/articles/${article.id}`)}
      className={`group bg-white rounded-xl border border-gray-200 border-l-4 ${border} p-5 cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg flex flex-col gap-3 break-inside-avoid mb-5`}
    >
      <span className={`self-start inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge}`}>
        {article.category}
      </span>

      <h3 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
        {article.title}
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
        {article.excerpt}
      </p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 pt-1 border-t border-gray-100">
        <span className="flex items-center gap-1"><Calendar size={14} />{formatDate(article.publishedDate)}</span>
        <span className="flex items-center gap-1"><Clock size={14} />{article.readTime} min read</span>
        <span className="flex items-center gap-1"><Eye size={14} />{formatViews(article.views)} views</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {article.tags.slice(0, 4).map((tag) => (
          <button
            key={tag}
            onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
            className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-blue-100 hover:text-blue-700 transition-colors"
          >
            {tag}
          </button>
        ))}
        {article.tags.length > 4 && (
          <span className="px-2.5 py-0.5 text-xs text-gray-400">+{article.tags.length - 4} more</span>
        )}
      </div>
    </div>
  );
}
