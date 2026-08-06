import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Product } from '../../api/contracts';
import { useAuth } from '../auth/AuthContext';
import { useCart } from './CartContext';

/**
 * Adds a product to the server-side cart. Anonymous visitors are sent to the login with a
 * returnTo instead of collecting items locally - there is no guest cart, the cart belongs
 * to a user.
 */
export function AddToCartButton({ product }: { product: Product }) {
  const { user, loading } = useAuth();
  const { cart, add, busyProductId, error } = useCart();
  const { pathname } = useLocation();
  const [added, setAdded] = useState(false);

  if (loading) {
    return <p className="text-sm text-stone-500">Laden...</p>;
  }

  if (!user) {
    return (
      <div>
        <Link
          to="/login"
          state={{ returnTo: pathname }}
          className="inline-block rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700"
        >
          Anmelden zum Bestellen
        </Link>
        <p className="mt-3 text-sm text-stone-500">
          Der Warenkorb hängt am Konto – deshalb geht es erst nach der Anmeldung weiter.
        </p>
      </div>
    );
  }

  const busy = busyProductId === product.id;
  const inCart = cart?.items.find((line) => line.productId === product.id)?.quantity ?? 0;
  // the backend caps at the stock as well; disabling here keeps the click from doing nothing
  const capReached = inCart >= product.stock;

  return (
    <div>
      <button
        type="button"
        disabled={busy || capReached}
        onClick={async () => {
          const ok = await add(product.id, 1);
          setAdded(ok);
        }}
        className="rounded-lg bg-rust px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-dark disabled:opacity-50"
      >
        {busy ? 'Wird hinzugefügt...' : 'In den Warenkorb'}
      </button>

      {capReached && (
        <p className="mt-3 text-sm text-stone-600">
          {inCart === product.stock && product.stock === 1
            ? 'Das einzige Stück liegt in Ihrem Warenkorb.'
            : `Alle ${product.stock} Stück liegen in Ihrem Warenkorb.`}{' '}
          <Link to="/cart" className="text-rust underline">
            Warenkorb ansehen
          </Link>
        </p>
      )}

      {added && !busy && !capReached && (
        <p role="status" className="mt-3 text-sm text-stone-600">
          Liegt im Warenkorb ({inCart} Stück).{' '}
          <Link to="/cart" className="text-rust underline">
            Warenkorb ansehen
          </Link>
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
