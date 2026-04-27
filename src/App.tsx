import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './components/HomePage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ProfilePage } from './pages/ProfilePage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { fetchTags } from './services/tagsService';
import { fetchArticles, fetchArticleByUid } from './services/articlesService';
import { fetchStats } from './services/statsService';
import { fetchPopularArticles } from './services/popularArticlesService';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    loader: () => Promise.all([fetchTags(), fetchStats(), fetchPopularArticles()]),
    shouldRevalidate: () => false,
  },
  {
    path: '/articles',
    element: <ArticlesPage />,
    loader: ({ request }: { request: Request }) => {
      const tag = new URL(request.url).searchParams.get('tag') || undefined;
      return Promise.all([fetchTags(), fetchArticles(0, tag ? { tag } : {})]);
    },
    shouldRevalidate: () => false,
  },
  {
    path: '/articles/:uid',
    element: <ArticleDetailPage />,
    loader: ({ params }) => fetchArticleByUid(params.uid!),
  },
  { path: '/profile',       element: <ProfilePage /> },
  { path: '/contact',       element: <ContactPage /> },
  { path: '/about',         element: <AboutPage /> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
