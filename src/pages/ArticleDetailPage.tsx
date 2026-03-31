import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockArticles } from '../data/mockArticles';
import { ArrowLeft, Clock, Calendar, Tag, Link2, Check, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Layout } from '../components/Layout';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}


export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = mockArticles.find((a) => a.id === id);
  const [copied, setCopied] = useState(false);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!article) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Article Not Found</h2>
          <Link to="/articles" className="text-blue-600 hover:underline text-sm">
            &larr; Back to Articles
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl">
        <Link
          to="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>

        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <header className="p-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-5">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                {formatDate(article.publishedDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                {article.readTime} min read
              </span>
            </div>
          </header>

          {/* Body */}
          <div className="p-8">
            <p className="text-gray-700 leading-relaxed text-base">
              {article.content}
            </p>
          </div>

          {/* Share section */}
          <div className="px-8 py-5 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">Share</span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter / X"
                className="p-2 rounded-full text-gray-500 hover:text-[#1DA1F2] hover:bg-blue-50 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="p-2 rounded-full text-gray-500 hover:text-[#0A66C2] hover:bg-blue-50 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="p-2 rounded-full text-gray-500 hover:text-[#1877F2] hover:bg-blue-50 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <button
                onClick={handleCopyLink}
                aria-label="Copy link"
                className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4" />}
              </button>
              {copied && <span className="text-xs text-green-600">Link copied!</span>}
            </div>
          </div>

          {/* Tags footer */}
          <footer className="px-8 py-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-start gap-3">
              <Tag className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/articles?tag=${encodeURIComponent(tag)}`)}
                    className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </footer>
        </article>
      </div>
    </Layout>
  );
}
