import { useSearchParams } from 'react-router-dom';
import { LoadingNotice } from '../../components/LoadingNotice';
import { useCategories } from './CategoriesContext';
import { ProductCard } from './ProductCard';
import { categoryFromSlug, categorySlug } from './categories';
import { useProducts } from './useProducts';

export function ShopPage() {
  const { products, status } = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  // an unknown ?kategorie= value falls back to "all" instead of showing an empty shop
  const activeCategory = categoryFromSlug(searchParams.get('kategorie'), categories);
  const activeCategoryTitle = categories.find((entry) => entry.key === activeCategory)?.title;

  const visible = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

  // the catalogue is small (a workshop, not a warehouse), so filtering stays client-side
  function selectCategory(slug: string | null) {
    setSearchParams(slug ? { kategorie: slug } : {}, { replace: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-semibold tracking-widest text-rust uppercase">Shop</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-stone-900 md:text-4xl">
        {activeCategoryTitle ?? 'Was gerade fertig ist'}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-600">
        Jedes Stück mit Herkunft und Stückzahl. Ist eine Charge durch, verschwindet der Artikel
        wieder – nachbestellen geht nicht.
      </p>

      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Kategorien">
        <button
          type="button"
          onClick={() => selectCategory(null)}
          aria-pressed={activeCategory === null}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === null
              ? 'border-stone-900 bg-stone-900 text-white'
              : 'border-stone-300 text-stone-700 hover:border-stone-400'
          }`}
        >
          Alle
        </button>
        {categories.map(({ key, title }) => (
          <button
            key={key}
            type="button"
            onClick={() => selectCategory(categorySlug(key))}
            aria-pressed={activeCategory === key}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === key
                ? 'border-stone-900 bg-stone-900 text-white'
                : 'border-stone-300 text-stone-700 hover:border-stone-400'
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      <div className="mt-12">
        {status === 'loading' && (
          <>
            <LoadingNotice className="mb-6" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="h-80 animate-pulse rounded-2xl bg-stone-200" />
              ))}
            </div>
          </>
        )}

        {status === 'error' && (
          <p className="rounded-2xl border border-brass/60 bg-brass/10 p-6 text-stone-700">
            Der Katalog lässt sich gerade nicht laden. Bitte später erneut versuchen.
          </p>
        )}

        {status === 'ready' && visible.length === 0 && (
          <p className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
            {activeCategory
              ? 'In dieser Kategorie ist gerade nichts fertig. Das Material entscheidet.'
              : 'Gerade ist nichts im Verkauf. Die nächste Charge steht schon auf der Werkbank.'}
          </p>
        )}

        {status === 'ready' && visible.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <p className="mt-8 text-sm text-stone-500">
              {visible.length} {visible.length === 1 ? 'Stück' : 'Artikel'} im Verkauf.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
