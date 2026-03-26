import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './components/HomePage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ProfilePage } from './pages/ProfilePage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { fetchTags } from './services/tagsService';

const router = createBrowserRouter([
  { path: '/',            element: <HomePage /> },
  { path: '/articles',    element: <ArticlesPage />, loader: () => fetchTags() },
  { path: '/articles/:id',element: <ArticleDetailPage /> },
  { path: '/profile',     element: <ProfilePage /> },
  { path: '/contact',     element: <ContactPage /> },
  { path: '/about',       element: <AboutPage /> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
