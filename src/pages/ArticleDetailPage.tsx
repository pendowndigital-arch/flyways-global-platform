import { useState, useEffect } from 'react';
import { Link, useNavigate, useLoaderData } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Link2, Check, Lock } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { ArticleDetail } from '../models/article';

export function ArticleDetailPage() {
  const article = useLoaderData() as ArticleDetail | null;
  const navigate = useNavigate();
  const { isAuthenticated, openSignInModal } = useAuth();
  const [copied, setCopied] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

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
          {/* Header — always visible */}
          <header className="p-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-5">
              {article.title}
            </h1>
            {article.readTime && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="w-4 h-4 text-gray-400" />
                {article.readTime}
              </div>
            )}
          </header>

          {/* Auth gate — shown when not signed in */}
          {!isAuthenticated ? (
            <>
              {/* Fade + lock card */}
              <div className="relative">
                <div className="h-16 bg-gradient-to-b from-white/0 to-white" />
                <div className="px-8 pb-10 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">
                    Sign in to continue reading
                  </h3>
                  <p className="text-sm text-gray-500 mb-5 max-w-xs">
                    Create a free account or sign in to access the full article and all exclusive content on Flyways Global.
                  </p>
                  <button
                    onClick={() => openSignInModal('signin')}
                    className="px-7 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:shadow-blue-200 transition-all duration-200 active:scale-95"
                  >
                    Sign In / Sign Up
                  </button>
                  <p className="mt-3 text-xs text-gray-400">No spam. Cancel anytime.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Full article body — rendered as HTML */}
              <div
                className="p-8 prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />

              {/* Share section */}
              <div className="px-8 py-5 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 font-medium">Share</span>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X (Twitter)"
                    className="p-2 rounded-full text-gray-500 hover:text-[#1DA1F2] hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="p-2 rounded-full text-gray-500 hover:text-[#0A66C2] hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className="p-2 rounded-full text-gray-500 hover:text-[#1877F2] hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
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

              {/* Sources */}
              {article.sources.length > 0 && (
                <div className="px-8 py-5 border-t border-gray-100 text-left">
                  <p className="text-xs font-medium text-gray-500 mb-2">Sources</p>
                  <ul className="space-y-1">
                    {article.sources.map((src) => (
                      <li key={src}>
                        <a
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline break-all"
                        >
                          {src}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </article>
      </div>
    </Layout>
  );
}
