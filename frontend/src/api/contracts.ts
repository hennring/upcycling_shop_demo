export interface User {
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResult {
  token: string;
  user: User;
}

export interface AuthAdapter {
  register(email: string, password: string): Promise<AuthResult>;
  login(email: string, password: string): Promise<AuthResult>;
  me(token: string): Promise<User>;
}

/** A published blog article. Drafts never leave the backend. */
export interface BlogArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  /** ISO-8601 timestamp; always set for published articles. */
  publishedAt: string | null;
}

export interface BlogAdapter {
  /** Published articles, newest first. */
  listArticles(): Promise<BlogArticle[]>;
  /** Throws {@link NotFoundError} for an unknown or unpublished slug. */
  getArticle(slug: string): Promise<BlogArticle>;
}

/** The five categories from brand.md, Abschnitt 6. */
export type ProductCategory = 'MOEBEL' | 'EINRICHTUNG' | 'MODE' | 'SCHMUCK' | 'KLEINZEUG';

/**
 * Category metadata and the current price range. The range is computed by the backend
 * from the active catalogue, not a fixed figure - a category without active products
 * has null bounds instead of a stale one.
 */
export interface Category {
  key: ProductCategory;
  title: string;
  description: string | null;
  material: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

/** A product of the public catalogue. Sold-out ("vergriffen") products never leave the backend. */
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: ProductCategory;
  /** The "Materialzettel": what the thing used to be, e.g. "Theatervorhang · Segeltuch". */
  material: string | null;
  /** Gross price in EUR. */
  price: number;
  /** Pieces the current batch holds. 0 means "vergriffen" - visible, but not buyable. */
  stock: number;
  imageUrl: string | null;
}

export interface ShopAdapter {
  /** Active products, sorted by name. */
  listProducts(): Promise<Product[]>;
  /** Throws {@link NotFoundError} for an unknown or sold-out slug. */
  getProduct(slug: string): Promise<Product>;
  /** The five categories with their brand copy and current price range, in display order. */
  listCategories(): Promise<Category[]>;
}

/** One line of the cart. Prices are resolved by the backend, never recomputed here. */
export interface CartLine {
  productId: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  /** Pieces the batch holds; the quantity control never goes above this. */
  availableStock: number;
  lineTotal: number;
}

export interface Cart {
  items: CartLine[];
  itemCount: number;
  total: number;
}

/**
 * The cart lives on the server and belongs to a user, so every call needs the token.
 * There is no checkout on purpose - the flow ends at the "Kauf" button.
 */
export interface CartAdapter {
  getCart(token: string): Promise<Cart>;
  addItem(token: string, productId: number, quantity: number): Promise<Cart>;
  /** Absolute quantity; 0 removes the line. */
  setQuantity(token: string, productId: number, quantity: number): Promise<Cart>;
  removeItem(token: string, productId: number): Promise<Cart>;
  clear(token: string): Promise<void>;
}

export interface NewsletterAdapter {
  /**
   * Opt-in for the "Werkstattbrief". Idempotent: subscribing an address that is already
   * on the list succeeds silently. The backend never reports whether an address was
   * already known, so there is no way to read the current subscription state back.
   */
  subscribe(email: string): Promise<void>;
}

/** Numbers shown on the admin dashboard tiles. Grows as phase 5/6 add more. */
export interface AdminStats {
  activeSubscriberCount: number;
}

/** A blog article as seen by the CMS - unlike {@link BlogArticle}, drafts are included. */
export interface AdminBlogArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  published: boolean;
  publishedAt: string | null;
}

/** Payload for creating/updating an article. An empty slug asks the backend to derive one. */
export interface BlogArticleInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  published: boolean;
}

/**
 * Admin-only calls, separate from the public adapters above. Phase 5 adds blog CRUD and
 * newsletter send-out here.
 */
export interface AdminAdapter {
  getStats(token: string): Promise<AdminStats>;
  listArticles(token: string): Promise<AdminBlogArticle[]>;
  getArticle(token: string, id: number): Promise<AdminBlogArticle>;
  createArticle(token: string, input: BlogArticleInput): Promise<AdminBlogArticle>;
  updateArticle(token: string, id: number, input: BlogArticleInput): Promise<AdminBlogArticle>;
  deleteArticle(token: string, id: number): Promise<void>;
  /** Uploads a header image and returns the URL the backend stored it under. */
  uploadArticleImage(token: string, file: File): Promise<string>;
}

export interface BackendAdapter {
  auth: AuthAdapter;
  blog: BlogAdapter;
  shop: ShopAdapter;
  cart: CartAdapter;
  newsletter: NewsletterAdapter;
  admin: AdminAdapter;
}
