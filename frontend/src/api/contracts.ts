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
  newsletter: NewsletterAdapter;
}
