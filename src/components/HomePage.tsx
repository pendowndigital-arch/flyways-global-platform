import { useState, useEffect } from 'react';
import { Link, useNavigate, useLoaderData } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from './Layout';
import { ArticleCard } from './ArticleCard';
import { Tag } from '../models/tag';
import { Article } from '../models/article';
import { SiteStats } from '../services/statsService';

const SLIDES = [
  {
    title: 'Your Guide to Studying Abroad',
    subtitle: 'Discover visa requirements, scholarships, and everything you need to start your international education journey.',
    cta: 'Explore Articles',
    ctaLink: '/articles',
    bg: 'from-blue-700 to-indigo-800',
    img: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1200&q=80',
  },
  {
    title: 'Scholarship Opportunities Await',
    subtitle: 'Find fully-funded and merit-based scholarships tailored for students like you across the globe.',
    cta: 'Find Scholarships',
    ctaLink: '/articles?tag=Scholarship',
    bg: 'from-emerald-600 to-teal-700',
    img: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=1200&q=80',
  },
  {
    title: 'Navigate Visa Requirements',
    subtitle: 'Stay up to date with the latest immigration rules, work visa extensions, and application procedures.',
    cta: 'Read Visa Guides',
    ctaLink: '/articles?tag=Visa',
    bg: 'from-purple-700 to-pink-700',
    img: 'https://images.unsplash.com/photo-1760229803660-fc5d996d9b79?w=1200&q=80',
  },
];

const CATEGORY_COLORS = [
  'bg-blue-50 text-blue-700 border-blue-100',
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-orange-50 text-orange-700 border-orange-100',
  'bg-purple-50 text-purple-700 border-purple-100',
];


function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="relative rounded-2xl overflow-hidden mb-10 h-72 md:h-96 shadow-xl">
      <img src={slide.img} alt={slide.title} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" />
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-80`} />

      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
        <h1 className="text-white text-2xl md:text-4xl font-bold leading-tight mb-3 max-w-xl">{slide.title}</h1>
        <p className="text-white/85 text-sm md:text-base mb-6 max-w-lg leading-relaxed">{slide.subtitle}</p>
        <Link to={slide.ctaLink} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors self-start text-sm">
          {slide.cta}
        </Link>
      </div>

      <button onClick={() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors">
        <ChevronLeft size={20} />
      </button>
      <button onClick={() => setCurrent(c => (c + 1) % SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors">
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-6' : 'bg-white/50 w-2'}`} />
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const [allCategories, apiStats, popularArticles] = useLoaderData() as [Tag[], SiteStats, Article[]];
  const categories = allCategories.filter((t) => t.priority);

  return (
    <Layout>
      <HeroSlider />

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/articles?tag=${encodeURIComponent(cat.name)}`}
              className={`flex flex-col items-center gap-3 p-5 rounded-xl border ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} hover:shadow-md transition-shadow`}
            >
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-8 h-8 object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-current opacity-20" />
              )}
              <span className="text-sm font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { value: String(apiStats.articles), label: 'Articles' },
          { value: String(apiStats.tags),     label: 'Categories' },
          { value: String(apiStats.users),    label: 'Readers' },
        ].map(({ value, label }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Most Viewed Articles</h2>
          <Link to="/articles" className="text-sm text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="columns-1 md:columns-2 gap-5">
          {popularArticles.map((article) => (
            <div key={article.id} className="mb-3 break-inside-avoid">
              <ArticleCard article={article} showCategoryBadge={false} onTagClick={(tag) => navigate(`/articles?tag=${encodeURIComponent(tag)}`)} />
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
