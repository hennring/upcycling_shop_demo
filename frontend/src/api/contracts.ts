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

/** A published news article. Drafts never leave the backend. */
export interface Article {
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
  listArticles(): Promise<Article[]>;
}

/** The five categories from brand.md, Abschnitt 6. The backend ships the key, the labels live in the frontend. */
export type ProductCategory = 'MOEBEL' | 'EINRICHTUNG' | 'MODE' | 'SCHMUCK' | 'KLEINZEUG';

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

export interface BackendAdapter {
  auth: AuthAdapter;
  blog: BlogAdapter;
  shop: ShopAdapter;
  cart: CartAdapter;
  newsletter: NewsletterAdapter;
}
