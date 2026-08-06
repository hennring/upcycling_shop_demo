import { Route, Routes } from 'react-router-dom';
import { AdminLayout } from './admin/AdminLayout';
import { AdminRoute } from './admin/AdminRoute';
import { ArticleEditorPage } from './admin/ArticleEditorPage';
import { ArticlesPage } from './admin/ArticlesPage';
import { DashboardPage } from './admin/DashboardPage';
import { SiteLayout } from './components/layout/SiteLayout';
import { CartPage } from './features/cart/CartPage';
import { LandingPage } from './features/landing/LandingPage';
import { ProductDetailPage } from './features/shop/ProductDetailPage';
import { ShopPage } from './features/shop/ShopPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

// The landing page anchors (#produkte, #werkstatt, #werkstattbuch, #werkstattbrief) stay as
// they are - they only ever point at sections of "/". A /werkstattbuch/:slug article page
// is still open.
function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:slug" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/new" element={<ArticleEditorPage />} />
          <Route path="articles/:id" element={<ArticleEditorPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
