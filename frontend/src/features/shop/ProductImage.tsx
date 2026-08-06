import { useCategories } from './CategoriesContext';
import type { Product } from '../../api/contracts';

/**
 * Product photo, or a stand-in while there are none. Real images arrive with the upload
 * in phase 5; until then a paper-toned panel carries the category instead of a grey box
 * with a broken-image icon.
 */
export function ProductImage({ product, className = '' }: { product: Product; className?: string }) {
  const { labelFor } = useCategories();

  if (product.imageUrl) {
    return (
      <img
        src={product.imageUrl}
        alt={product.name}
        loading="lazy"
        className={`w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-stone-200 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.25),transparent_60%)] ${className}`}
    >
      <span className="font-mono text-xs tracking-widest text-stone-500 uppercase">
        {labelFor(product.category)}
      </span>
    </div>
  );
}
