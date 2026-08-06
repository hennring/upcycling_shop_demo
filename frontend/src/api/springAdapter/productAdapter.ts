import type { Category, Product, ProductCategory, ShopAdapter } from '../contracts';
import { NotFoundError } from '../errors';

interface CategoryResponseDto {
  key: ProductCategory;
  title: string;
  description: string | null;
  material: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

function toCategory(dto: CategoryResponseDto): Category {
  return {
    key: dto.key,
    title: dto.title,
    description: dto.description,
    material: dto.material,
    minPrice: dto.minPrice,
    maxPrice: dto.maxPrice,
  };
}

interface ProductResponseDto {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: ProductCategory;
  material: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  active: boolean;
}

/** The public endpoints only ever return active products, so `active` is dropped here. */
function toProduct(dto: ProductResponseDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    category: dto.category,
    material: dto.material,
    price: dto.price,
    stock: dto.stock,
    imageUrl: dto.imageUrl,
  };
}

async function listProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');

  if (!res.ok) {
    throw new Error(`Loading the catalogue failed with status ${res.status}`);
  }

  const dtos: ProductResponseDto[] = await res.json();
  return dtos.map(toProduct);
}

async function getProduct(slug: string): Promise<Product> {
  const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);

  // a sold-out product answers 404 as well - for a visitor both mean "not in the shop"
  if (res.status === 404) {
    throw new NotFoundError(`Unknown product slug: ${slug}`);
  }
  if (!res.ok) {
    throw new Error(`Loading the product failed with status ${res.status}`);
  }

  return toProduct(await res.json());
}

async function listCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');

  if (!res.ok) {
    throw new Error(`Loading the categories failed with status ${res.status}`);
  }

  const dtos: CategoryResponseDto[] = await res.json();
  return dtos.map(toCategory);
}

export const springShopAdapter: ShopAdapter = {
  listProducts,
  getProduct,
  listCategories,
};
