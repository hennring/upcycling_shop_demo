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

export interface BackendAdapter {
  auth: AuthAdapter;
  blog: BlogAdapter;
}
