import { Route, Routes } from 'react-router-dom';
import { AdminLayout } from './admin/AdminLayout';
import { AdminRoute } from './admin/AdminRoute';
import { BlogArticleEditorPage } from './admin/BlogArticleEditorPage';
import { BlogArticlesPage } from './admin/BlogArticlesPage';
import { DashboardPage } from './admin/DashboardPage';
import { NewsletterEditorPage } from './admin/NewsletterEditorPage';
import { NewslettersPage } from './admin/NewslettersPage';
import { SiteLayout } from './components/layout/SiteLayout';
import { BlogArticleDetailPage } from './features/blog/BlogArticleDetailPage';
import { CartPage } from './features/cart/CartPage';
import { LandingPage } from './features/landing/LandingPage';
import { ProductDetailPage } from './features/shop/ProductDetailPage';
import { ShopPage } from './features/shop/ShopPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

// The landing page anchors (#produkte, #werkstatt, #werkstattbuch, #werkstattbrief) stay as
// they are - they only ever point at sections of "/".
function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:slug" element={<ProductDetailPage />} />
        <Route path="werkstattbuch/:slug" element={<BlogArticleDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="articles" element={<BlogArticlesPage />} />
          <Route path="articles/new" element={<BlogArticleEditorPage />} />
          <Route path="articles/:id" element={<BlogArticleEditorPage />} />
          <Route path="newsletter" element={<NewslettersPage />} />
          <Route path="newsletter/new" element={<NewsletterEditorPage />} />
          <Route path="newsletter/:id" element={<NewsletterEditorPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
