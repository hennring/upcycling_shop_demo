import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import { CartPage } from './features/cart/CartPage';
import { LandingPage } from './features/landing/LandingPage';
import { ProductDetailPage } from './features/shop/ProductDetailPage';
import { ShopPage } from './features/shop/ShopPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

// The landing page anchors (#produkte, #werkstatt, #werkstattbuch, #werkstattbrief) stay as
// they are - they only ever point at sections of "/". Phase 4 adds /admin on top of this,
// a /werkstattbuch/:slug article page is still open.
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
    </Routes>
  );
}

export default App;
