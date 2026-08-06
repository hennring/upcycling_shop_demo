import { Link } from 'react-router-dom';
import type { Product } from '../../api/contracts';
import { MaterialTag } from './MaterialTag';
import { ProductImage } from './ProductImage';
import { StockLabel } from './StockLabel';
import { formatPrice } from './money';

/** First line of the description; the fixture texts start with what it is made of. */
function teaser(description: string | null): string | null {
  return description?.split('\n').find((line) => line.trim().length > 0)?.trim() ?? null;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-lg">
      <Link to={`/shop/${product.slug}`} className="flex flex-1 flex-col">
        <ProductImage product={product} className="aspect-4/3" />

        <div className="flex flex-1 flex-col p-6">
          <MaterialTag material={product.material} />
          <h3 className="mt-3 font-display text-xl font-semibold text-stone-900 group-hover:text-rust">
            {product.name}
          </h3>
          {teaser(product.description) && (
            <p className="mt-3 line-clamp-3 flex-1 leading-relaxed text-stone-600">
              {teaser(product.description)}
            </p>
          )}
          <div className="mt-5 flex items-baseline justify-between gap-3">
            <p className="font-medium text-stone-900">{formatPrice(product.price)}</p>
            <StockLabel stock={product.stock} />
          </div>
        </div>
      </Link>
    </article>
  );
}
