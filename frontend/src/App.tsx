import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import { LandingPage } from './features/landing/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Phase 3 continues here: /shop, /shop/:slug, /cart and /werkstattbuch/:slug are the
// next routes. The landing page anchors (#produkte, #werkstatt, #werkstattbuch) stay as
// they are - they only ever point at sections of "/".
function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
