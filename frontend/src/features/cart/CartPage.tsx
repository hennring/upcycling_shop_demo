import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CartLine } from '../../api/contracts';
import { useAuth } from '../auth/AuthContext';
import { formatPrice } from '../shop/money';
import { useCart } from './CartContext';
import { LoadingNotice } from '../../components/LoadingNotice';

/** Technical line limit of the backend; the stock of a batch is usually the tighter bound. */
const MAX_QUANTITY = 99;

function QuantityStepper({ line }: { line: CartLine }) {
  const { setQuantity, busyProductId } = useCart();
  const busy = busyProductId === line.productId;
  const max = Math.min(line.availableStock, MAX_QUANTITY);

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={busy}
        // 0 removes the line - that is what the backend does with a quantity of zero
        onClick={() => setQuantity(line.productId, line.quantity - 1)}
        aria-label={`Menge verringern: ${line.name}`}
        className="size-9 rounded-lg border border-stone-300 text-stone-700 transition-colors hover:border-stone-400 disabled:opacity-50"
      >
        −
      </button>
      <span aria-live="polite" className="w-10 text-center font-mono text-sm text-stone-900">
        {line.quantity}
      </span>
      <button
        type="button"
        disabled={busy || line.quantity >= max}
        onClick={() => setQuantity(line.productId, line.quantity + 1)}
        aria-label={`Menge erhöhen: ${line.name}`}
        className="size-9 rounded-lg border border-stone-300 text-stone-700 transition-colors hover:border-stone-400 disabled:opacity-50"
      >
        +
      </button>
    </div>
  );
}

function CartRow({ line }: { line: CartLine }) {
  const { remove, busyProductId } = useCart();
  const busy = busyProductId === line.productId;

  return (
    <li
      className={`flex flex-wrap items-center gap-4 py-6 transition-opacity ${busy ? 'opacity-60' : ''}`}
    >
      <div className="min-w-48 flex-1">
        <Link
          to={`/shop/${line.slug}`}
          className="font-display text-lg font-semibold text-stone-900 hover:text-rust"
        >
          {line.name}
        </Link>
        <p className="mt-1 text-sm text-stone-500">{formatPrice(line.unitPrice)} je Stück</p>
        {line.quantity >= line.availableStock && (
          <p className="mt-1 text-sm text-stone-500">
            {line.availableStock === 1
              ? 'Das ist das letzte Stück dieser Charge.'
              : `Mehr als ${line.availableStock} Stück gibt es aus dieser Charge nicht.`}
          </p>
        )}
      </div>

      <QuantityStepper line={line} />

      <p className="w-28 text-right font-medium text-stone-900">{formatPrice(line.lineTotal)}</p>

      <button
        type="button"
        disabled={busy}
        onClick={() => remove(line.productId)}
        className="text-sm text-stone-500 underline transition-colors hover:text-rust disabled:opacity-50"
      >
        Entfernen
      </button>
    </li>
  );
}

/**
 * The cart of the logged-in user. It ends at the "Kauf" button on purpose: the project has
 * no payment processing (see anforderungen.md, Abschnitt 2), and pretending otherwise would
 * be the one dishonest screen in the whole app.
 */
export function CartPage() {
  const { user, loading } = useAuth();
  const { cart, status, error, clear, busyProductId } = useCart();
  const [checkoutAttempted, setCheckoutAttempted] = useState(false);

  if (loading || status === 'loading') {
    return <LoadingNotice className="mx-auto max-w-4xl px-6 py-24" />;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="font-display text-3xl font-semibold text-stone-900">Warenkorb</h1>
        <p className="mt-4 text-stone-600">
          Der Warenkorb hängt am Konto, damit er auf jedem Gerät derselbe ist. Melden Sie sich an,
          um Stücke zu sammeln.
        </p>
        <Link
          to="/login"
          state={{ returnTo: '/cart' }}
          className="mt-8 inline-block rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700"
        >
          Anmelden
        </Link>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="font-display text-3xl font-semibold text-stone-900">Warenkorb</h1>
        <p className="mt-6 rounded-2xl border border-brass/60 bg-brass/10 p-6 text-stone-700">
          Der Warenkorb lässt sich gerade nicht laden. Bitte später erneut versuchen.
        </p>
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="font-display text-3xl font-semibold text-stone-900">Warenkorb</h1>
        <p className="mt-4 text-stone-600">Noch nichts drin.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-lg bg-rust px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
        >
          Zum Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-stone-900 md:text-4xl">Warenkorb</h1>
      <p className="mt-3 text-stone-600">
        {cart?.itemCount} {cart?.itemCount === 1 ? 'Stück' : 'Stücke'} von {items.length}{' '}
        {items.length === 1 ? 'Artikel' : 'Artikeln'}
      </p>

      {error && (
        <p role="alert" className="mt-6 text-sm text-red-700">
          {error}
        </p>
      )}

      <ul className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
        {items.map((line) => (
          <CartRow key={line.productId} line={line} />
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <button
          type="button"
          disabled={busyProductId !== null}
          onClick={() => clear()}
          className="text-sm text-stone-500 underline transition-colors hover:text-rust disabled:opacity-50"
        >
          Warenkorb leeren
        </button>

        <div className="text-right">
          <p className="text-sm text-stone-500">Summe</p>
          <p className="font-display text-2xl font-semibold text-stone-900">
            {formatPrice(cart?.total ?? 0)}
          </p>
          <p className="mt-1 text-xs text-stone-500">inkl. MwSt., Versand nach Absprache</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-8">
        <button
          type="button"
          onClick={() => setCheckoutAttempted(true)}
          className="w-full rounded-lg bg-rust px-6 py-4 font-medium text-white transition-colors hover:bg-rust-dark sm:w-auto"
        >
          Kauf abschließen
        </button>

        {checkoutAttempted ? (
          <p role="status" className="mt-5 leading-relaxed text-stone-700">
            <strong className="text-stone-900">Hier endet der Prototyp.</strong> Eine
            Zahlungsabwicklung gibt es bewusst nicht: Das Projekt ist ein Portfolio-Stück, und
            „Zweite Chance" ist kein echtes Unternehmen. Der Warenkorb bleibt gespeichert, bestellt
            wird nichts.
          </p>
        ) : (
          <p className="mt-5 text-sm text-stone-500">
            Ohne Zahlungsabwicklung – der Ablauf endet an diesem Button.
          </p>
        )}
      </div>
    </div>
  );
}
