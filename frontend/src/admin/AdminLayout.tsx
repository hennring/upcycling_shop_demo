import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

/**
 * Frame for the admin area. Deliberately its own header, not SiteHeader/SiteFooter - the
 * admin area should look and feel distinct from the public site, not like another tab of it.
 */
export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-stone-100 text-stone-900">
      <header className="border-b border-stone-300 bg-stone-900 text-stone-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="rounded-lg border border-stone-600 px-4 py-2 text-sm font-medium text-stone-100 transition-colors hover:border-stone-400"
            >
              Admin
            </Link>
            <Link
              to="/"
              className="rounded-lg border border-stone-600 px-4 py-2 text-sm font-medium text-stone-100 transition-colors hover:border-stone-400"
            >
              Kundenansicht
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-stone-300 sm:inline">{user?.email}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-stone-600 px-4 py-2 text-sm font-medium text-stone-100 transition-colors hover:border-stone-400"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
