import { useEffect, useState } from 'react';
import { api } from '../../api';
import type { Product } from '../../api/contracts';
import { NotFoundError } from '../../api/errors';

interface ProductState {
  product: Product | null;
  /** "missing" is a 404 - unknown slug or a product that is sold out and no longer public. */
  status: 'loading' | 'ready' | 'missing' | 'error';
}

export function useProduct(slug: string): ProductState {
  const [state, setState] = useState<ProductState>({ product: null, status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ product: null, status: 'loading' });

    api.shop
      .getProduct(slug)
      .then((product) => {
        if (active) {
          setState({ product, status: 'ready' });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            product: null,
            status: error instanceof NotFoundError ? 'missing' : 'error',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return state;
}
