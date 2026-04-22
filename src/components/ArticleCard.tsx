import { Article } from '../models/article';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onTagClick?: (tag: string) => void;
  showCategoryBadge?: boolean;
  activeTag?: string | null;
}



export function ArticleCard({ article, onTagClick, showCategoryBadge = true, activeTag }: ArticleCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/articles/${article.uid}`)}
      className={`group bg-white rounded-xl border border-gray-200 border-l-4 border-l-blue-500 p-5 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/70 hover:border-blue-200 flex flex-col gap-3 h-full`}
    >
      {showCategoryBadge && (
        <span className={"self-start inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200"}>
          {article.category}
        </span>
      )}

      <h3 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
        {article.title}
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
        {article.excerpt}
      </p>

      {article.readTime && (
        <div className="flex items-center gap-x-3 text-xs text-gray-400 pt-1 border-t border-gray-100">
          <span className="flex items-center gap-1"><Clock size={14} />{article.readTime}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {(() => {
          const tags = article.tags;
          const visible = tags.slice(0, 4);
          if (activeTag && tags.includes(activeTag) && !visible.includes(activeTag)) {
            visible[3] = activeTag;
          }
          return visible;
        })().map((tag) => (
          <button
            key={tag}
            onClick={(e) => { e.stopPropagation(); onTagClick?.(tag); }}
            className={`px-2.5 py-0.5 rounded-full text-xs transition-all duration-200 hover:scale-105 ${
              activeTag === tag
                ? 'bg-blue-500 text-white border border-blue-500 shadow-sm shadow-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700 hover:border hover:border-blue-200'
            }`}
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
