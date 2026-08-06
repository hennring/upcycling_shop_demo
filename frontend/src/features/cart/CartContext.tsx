import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../../api';
import type { Cart } from '../../api/contracts';
import { ConflictError, UnauthorizedError } from '../../api/errors';
import { useAuth } from '../auth/AuthContext';

type CartStatus = 'anonymous' | 'loading' | 'ready' | 'error';

interface CartContextValue {
  cart: Cart | null;
  status: CartStatus;
  /** Product whose line is currently being written; used to disable just that row. */
  busyProductId: number | null;
  error: string | null;
  /** Resolves to false when the write failed, so callers can skip their success feedback. */
  add: (productId: number, quantity: number) => Promise<boolean>;
  setQuantity: (productId: number, quantity: number) => Promise<boolean>;
  remove: (productId: number) => Promise<boolean>;
  clear: () => Promise<boolean>;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Holds the server-side cart of the logged-in user. Every call returns the full cart, so
 * this never merges state by hand - the answer replaces what was there. Anonymous visitors
 * have no cart at all (the endpoint answers 401); the buttons send them to the login
 * instead of collecting items locally.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const { token, logout } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [status, setStatus] = useState<CartStatus>('anonymous');
  const [busyProductId, setBusyProductId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setCart(null);
      setStatus('anonymous');
      return;
    }

    let active = true;
    setStatus('loading');

    api.cart
      .getCart(token)
      .then((loaded) => {
        if (active) {
          setCart(loaded);
          setStatus('ready');
        }
      })
      .catch((caught: unknown) => {
        if (!active) {
          return;
        }
        // an expired token would otherwise leave the header badge stuck on "loading"
        if (caught instanceof UnauthorizedError) {
          logout();
          return;
        }
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [token, logout]);

  /**
   * Runs one cart write. `productId` only decides which row shows as busy - for the
   * cart-wide clear it is null.
   */
  const mutate = useCallback(
    async (productId: number | null, write: (authToken: string) => Promise<Cart | null>) => {
      if (!token) {
        return false;
      }

      setBusyProductId(productId);
      setError(null);
      try {
        const updated = await write(token);
        if (updated) {
          setCart(updated);
        }
        setStatus('ready');
        return true;
      } catch (caught: unknown) {
        if (caught instanceof UnauthorizedError) {
          logout();
        } else if (caught instanceof ConflictError) {
          // 409: the batch ran out between page load and click
          setError('Dieses Stück ist inzwischen vergriffen.');
        } else {
          setError('Der Warenkorb ließ sich nicht aktualisieren. Bitte erneut versuchen.');
        }
        return false;
      } finally {
        setBusyProductId(null);
      }
    },
    [token, logout],
  );

  const value: CartContextValue = {
    cart,
    status,
    busyProductId,
    error,
    add: (productId, quantity) =>
      mutate(productId, (authToken) => api.cart.addItem(authToken, productId, quantity)),
    setQuantity: (productId, quantity) =>
      mutate(productId, (authToken) => api.cart.setQuantity(authToken, productId, quantity)),
    remove: (productId) =>
      mutate(productId, (authToken) => api.cart.removeItem(authToken, productId)),
    clear: () =>
      mutate(null, async (authToken) => {
        await api.cart.clear(authToken);
        // the clear endpoint answers 204, so the empty cart is assembled here
        return { items: [], itemCount: 0, total: 0 };
      }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
