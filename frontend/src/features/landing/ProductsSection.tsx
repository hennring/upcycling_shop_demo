import { Link } from 'react-router-dom';
import type { Category } from '../../api/contracts';
import { LoadingNotice } from '../../components/LoadingNotice';
import { useCategories } from '../shop/CategoriesContext';
import { categorySlug } from '../shop/categories';
import { formatPrice } from '../shop/money';

/** "90 – 380 €", or a note that nothing in the category is currently for sale. */
function priceRangeLabel(category: Category): string {
  if (category.minPrice == null || category.maxPrice == null) {
    return 'Gerade nichts im Verkauf';
  }
  if (category.minPrice === category.maxPrice) {
    return formatPrice(category.minPrice);
  }
  return `${formatPrice(category.minPrice)} – ${formatPrice(category.maxPrice)}`;
}

export function ProductsSection() {
  const { categories, status } = useCategories();

  return (
    <section id="produkte" className="scroll-mt-20 bg-stone-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold tracking-widest text-rust uppercase">Produkte</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-stone-900 md:text-4xl">
          Was gerade in der Werkstatt entsteht
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-stone-600">
          Das Material entscheidet, nicht der Katalog. Deshalb wechselt das Angebot – und was
          durch ist, ist durch.
        </p>

        {status === 'loading' && <LoadingNotice className="mt-14" />}

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.key}
              className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-8 transition-shadow hover:shadow-lg"
            >
              <span aria-hidden="true" className="h-1 w-12 rounded-full bg-brass" />
              <h3 className="mt-6 font-display text-xl font-semibold text-stone-900">
                <Link
                  to={`/shop?kategorie=${categorySlug(category.key)}`}
                  className="group-hover:text-rust"
                >
                  {category.title}
                </Link>
              </h3>
              <p className="mt-3 flex-1 leading-relaxed text-stone-600">{category.description}</p>

              <dl className="mt-6 space-y-2 border-t border-stone-100 pt-6 text-sm">
                <div>
                  <dt className="text-xs tracking-wider text-stone-500 uppercase">War mal</dt>
                  <dd className="mt-1 font-mono text-stone-700">{category.material}</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-wider text-stone-500 uppercase">Preis</dt>
                  <dd className="mt-1 font-medium text-stone-900">{priceRangeLabel(category)}</dd>
                </div>
              </dl>
            </article>
          ))}

          {/* fills the sixth slot of the grid and leads into the shop */}
          <article className="flex flex-col justify-between rounded-2xl border border-stone-300 border-dashed bg-white/60 p-8">
            <div>
              <h3 className="font-display text-xl font-semibold text-stone-900">
                Einzelstücke im Shop
              </h3>
              <p className="mt-3 leading-relaxed text-stone-600">
                Jedes Stück mit Herkunft und Stückzahl. Ist eine Charge durch, verschwindet der
                Artikel wieder – nachbestellen geht nicht.
              </p>
            </div>
            <Link
              to="/shop"
              className="mt-6 inline-block rounded-lg bg-rust px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
            >
              Alles ansehen, was fertig ist
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
