import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

/** The admin sub-pages, in the order they appear in the nav bar below. */
const SECTIONS = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/articles', label: 'Artikel' },
  { to: '/admin/newsletter', label: 'Newsletter' },
];

/**
 * Frame for the admin area. Deliberately its own header, not SiteHeader/SiteFooter - the
 * admin area should look and feel distinct from the public site, not like another tab of it.
 */
export function AdminLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-stone-100 text-stone-900">
      <header className="border-b border-stone-300 bg-stone-900 text-stone-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-3">
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
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 pb-4">
          {SECTIONS.map((section) => {
            // "/admin" itself must not stay highlighted once we're on a sub-page like /admin/articles
            const active = section.to === '/admin' ? pathname === '/admin' : pathname.startsWith(section.to);
            return (
              <Link
                key={section.to}
                to={section.to}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  active ? 'text-white' : 'text-stone-400'
                }`}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
