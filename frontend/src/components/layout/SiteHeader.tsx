import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { useCart } from '../../features/cart/CartContext';
import { BrandMark } from './BrandMark';

/**
 * The landing page sections are anchors on "/", so the nav links have to carry the
 * route prefix - otherwise "#produkte" would drop the current path on other pages.
 */
const SECTIONS = [
  { id: 'produkte', label: 'Produkte' },
  { id: 'werkstatt', label: 'Werkstatt' },
  { id: 'ueber-uns', label: 'Über uns' },
  { id: 'werkstattbuch', label: 'Werkstattbuch' },
];

/** Number of pieces in the cart; empty carts and anonymous visitors show no badge. */
function CartLink() {
  const { cart } = useCart();
  const count = cart?.itemCount ?? 0;

  return (
    <Link
      to="/cart"
      className="relative rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400"
    >
      Warenkorb
      {count > 0 && (
        <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-rust px-1.5 font-mono text-xs text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

export function SiteHeader() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="shrink-0">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {/* a real route, unlike the section anchors next to it */}
          <Link
            to="/shop"
            className={`text-sm font-medium transition-colors hover:text-rust ${
              pathname.startsWith('/shop') ? 'text-rust' : 'text-stone-600'
            }`}
          >
            Shop
          </Link>
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={pathname === '/' ? `#${section.id}` : `/#${section.id}`}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-rust"
            >
              {section.label}
            </a>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-stone-500 xl:inline">{user.email}</span>
            <CartLink />
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400"
            >
              Abmelden
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700"
          >
            Anmelden
          </Link>
        )}
      </div>
    </header>
  );
}
