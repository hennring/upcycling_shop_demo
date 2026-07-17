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

export interface BackendAdapter {
  auth: AuthAdapter;
}
