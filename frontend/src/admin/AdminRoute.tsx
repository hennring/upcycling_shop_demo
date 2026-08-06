import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { AdminForbiddenPage } from './AdminForbiddenPage';

/**
 * Guards everything under /admin. Three outcomes: not logged in -> /login (with returnTo,
 * same mechanism as the cart), logged in without the ADMIN role -> a "kein Zugriff" page at
 * the same URL (not a redirect - the denial should be visible, not silent), otherwise render
 * the nested admin routes. The nav link in SiteHeader hides itself for non-admins too, but
 * that is a UI nicety, not the enforcement - this guard is what actually matters.
 */
export function AdminRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="mx-auto max-w-4xl px-6 py-24 text-sm text-stone-500">Laden...</p>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ returnTo: location.pathname }} replace />;
  }

  if (user.role !== 'ADMIN') {
    return <AdminForbiddenPage />;
  }

  return <Outlet />;
}
