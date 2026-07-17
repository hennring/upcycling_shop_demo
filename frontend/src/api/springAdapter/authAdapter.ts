import type { AuthAdapter, AuthResult, User } from '../contracts';

interface AuthResponseDto {
  token: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface UserResponseDto {
  email: string;
  role: 'USER' | 'ADMIN';
}

async function request(path: string, email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(`Auth request failed with status ${res.status}`);
  }

  const dto: AuthResponseDto = await res.json();
  return { token: dto.token, user: { email: dto.email, role: dto.role } };
}

async function me(token: string): Promise<User> {
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Auth request failed with status ${res.status}`);
  }

  const dto: UserResponseDto = await res.json();
  return { email: dto.email, role: dto.role };
}

export const springAuthAdapter: AuthAdapter = {
  register: (email, password) => request('register', email, password),
  login: (email, password) => request('login', email, password),
  me,
};
