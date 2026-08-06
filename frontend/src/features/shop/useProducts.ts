import { useEffect, useState } from 'react';
import { api } from '../../api';
import type { Product } from '../../api/contracts';

interface ProductsState {
  products: Product[];
  status: 'loading' | 'ready' | 'error';
}

/** Loads the public catalogue once. Backend-agnostic: it only talks to the adapter. */
export function useProducts(): ProductsState {
  const [state, setState] = useState<ProductsState>({ products: [], status: 'loading' });

  useEffect(() => {
    let active = true;

    api.shop
      .listProducts()
      .then((products) => {
        if (active) {
          setState({ products, status: 'ready' });
        }
      })
      .catch(() => {
        if (active) {
          setState({ products: [], status: 'error' });
        }
      });

    // StrictMode mounts twice in development - ignore the result of the discarded run
    return () => {
      active = false;
    };
  }, []);

  return state;
}
