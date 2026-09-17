import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './components/HomePage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ActivateAccountPage } from './pages/ActivateAccountPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { RouteError } from './components/RouteError';
import { RouteLoading } from './components/RouteLoading';
import { fetchTags } from './services/tagsService';
import { fetchArticles, fetchArticleByUid } from './services/articlesService';
import { fetchStats } from './services/statsService';
import { fetchPopularArticles } from './services/popularArticlesService';
import { articlesState } from './state/articlesState';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    loader: () => Promise.all([fetchTags(), fetchStats(), fetchPopularArticles()]),
    shouldRevalidate: () => false,
    ErrorBoundary: RouteError,
    HydrateFallback: RouteLoading,
  },
  {
    path: '/articles',
    element: <ArticlesPage />,
    loader: ({ request }) => {
      const url = new URL(request.url);
      const tag = url.searchParams.get('tag') ?? '';
      const time = url.searchParams.get('time') ?? '';
      const isSameFilter = tag === articlesState.tag && time === articlesState.time;

      const result = isSameFilter && articlesState.articles
        ? Promise.resolve({ articles: articlesState.articles, pager: articlesState.pager! })
        : fetchArticles(0, { tag: tag || undefined, time: time || undefined }).then((fresh) => {
            articlesState.tag = tag;
            articlesState.time = time;
            articlesState.page = 0;
            articlesState.articles = fresh.articles;
            articlesState.pager = fresh.pager;
            return fresh;
          });

      return Promise.all([fetchTags(), result]);
    },
    ErrorBoundary: RouteError,
    HydrateFallback: RouteLoading,
  },
  {
    path: '/articles/:uid',
    element: <ArticleDetailPage />,
    loader: ({ params }) => fetchArticleByUid(params.uid!),
    ErrorBoundary: RouteError,
    HydrateFallback: RouteLoading,
  },
  { path: '/profile',       element: <ProfilePage /> },
  { path: '/login',         element: <AuthPage mode="signin" key="signin" /> },
  { path: '/signup',        element: <AuthPage mode="signup" key="signup" /> },
  { path: '/password/reset/:token', element: <ResetPasswordPage /> },
  { path: '/user/activate/:token', element: <ActivateAccountPage /> },
  { path: '/contact',       element: <ContactPage /> },
  { path: '/about',         element: <AboutPage /> },
  { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
  { path: '/terms-and-conditions', element: <TermsPage /> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
