import { Link, useParams } from 'react-router-dom';
import { NotFoundPage } from '../../pages/NotFoundPage';
import { AddToCartButton } from '../cart/AddToCartButton';
import { MaterialTag } from './MaterialTag';
import { ProductImage } from './ProductImage';
import { StockLabel } from './StockLabel';
import { categoryLabel, categorySlug } from './categories';
import { formatPrice } from './money';
import { useProduct } from './useProduct';

export function ProductDetailPage() {
  const { slug = '' } = useParams();
  const { product, status } = useProduct(slug);

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16" aria-busy="true">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-4/3 animate-pulse rounded-2xl bg-stone-200" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-stone-200" />
            <div className="h-24 animate-pulse rounded bg-stone-200" />
          </div>
        </div>
      </div>
    );
  }

  // sold out and unknown both answer 404 - for a visitor the page is simply not there
  if (status === 'missing') {
    return <NotFoundPage />;
  }

  if (status === 'error' || !product) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <p className="rounded-2xl border border-brass/60 bg-brass/10 p-6 text-stone-700">
          Dieser Artikel lässt sich gerade nicht laden. Bitte später erneut versuchen.
        </p>
        <Link to="/shop" className="mt-6 inline-block text-sm text-rust underline">
          Zurück zum Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <nav aria-label="Pfad" className="text-sm text-stone-500">
        <Link to="/shop" className="hover:text-rust">
          Shop
        </Link>
        <span aria-hidden="true" className="mx-2">
          ·
        </span>
        <Link to={`/shop?kategorie=${categorySlug(product.category)}`} className="hover:text-rust">
          {categoryLabel(product.category)}
        </Link>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <ProductImage product={product} className="aspect-4/3 rounded-2xl" />

        <div>
          <MaterialTag material={product.material} />
          <h1 className="mt-4 font-display text-3xl font-semibold text-stone-900 md:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="font-display text-2xl font-semibold text-stone-900">
              {formatPrice(product.price)}
            </p>
            <StockLabel stock={product.stock} />
          </div>

          {product.description && (
            // the fixture texts are paragraphs separated by blank lines (brand.md, Abschnitt 6)
            <div className="mt-8 space-y-4 leading-relaxed text-stone-600">
              {product.description
                .split(/\n\s*\n/)
                .map((paragraph) => paragraph.trim())
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
            </div>
          )}

          <div className="mt-10">
            {product.stock > 0 ? (
              <AddToCartButton product={product} />
            ) : (
              // no button at all: the backend would answer 409 anyway
              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <p className="font-medium text-stone-900">Diese Charge ist durch.</p>
                <p className="mt-2 leading-relaxed text-stone-600">
                  Nachbauen geht nur, wenn wieder passendes Material ankommt – und dann sieht das
                  Stück anders aus. Im Werkstattbrief steht, was neu da ist.
                </p>
                <Link to="/#werkstattbrief" className="mt-4 inline-block text-sm text-rust underline">
                  Werkstattbrief abonnieren
                </Link>
              </div>
            )}
          </div>

          <p className="mt-8 border-t border-stone-200 pt-6 text-sm text-stone-500">
            Abholung in der Werkstatt im Leipziger Osten oder Versand nach Absprache. Bei
            Einzelstücken lohnt eine Nachricht vorher – wir schreiben ehrlich, wie das Stück
            aussieht.
          </p>
        </div>
      </div>
    </div>
  );
}
