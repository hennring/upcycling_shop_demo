import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../../api';
import type { Category, ProductCategory } from '../../api/contracts';

interface CategoriesContextValue {
  categories: Category[];
  status: 'loading' | 'ready' | 'error';
  /** Falls back to the raw key while the catalogue is still loading or failed to load. */
  labelFor: (category: ProductCategory) => string;
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

/**
 * Loads the categories once, with their brand copy and current price range. A
 * context rather than a plain hook, because the label is needed all over the shop
 * (cards, filters, image placeholders) and should not trigger a fetch per usage.
 */
export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;

    api.shop
      .listCategories()
      .then((loaded) => {
        if (active) {
          setCategories(loaded);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) {
          setStatus('error');
        }
      });

    // StrictMode mounts twice in development - ignore the result of the discarded run
    return () => {
      active = false;
    };
  }, []);

  const labelFor = (category: ProductCategory) =>
    categories.find((entry) => entry.key === category)?.title ?? category;

  return (
    <CategoriesContext.Provider value={{ categories, status, labelFor }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return ctx;
}
