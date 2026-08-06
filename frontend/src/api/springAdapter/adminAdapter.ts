import type { AdminAdapter, AdminStats } from '../contracts';
import { ForbiddenError, UnauthorizedError } from '../errors';

async function request(token: string, path: string): Promise<Response> {
  const res = await fetch(`/api/admin${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    throw new UnauthorizedError('Admin request rejected - token expired or missing');
  }
  // authenticated, but the account is not ADMIN
  if (res.status === 403) {
    throw new ForbiddenError('Account lacks the ADMIN role');
  }
  if (!res.ok) {
    throw new Error(`Admin request failed with status ${res.status}`);
  }

  return res;
}

async function getStats(token: string): Promise<AdminStats> {
  const res = await request(token, '/newsletter/subscribers/active-count');
  const activeSubscriberCount: number = await res.json();
  return { activeSubscriberCount };
}

export const springAdminAdapter: AdminAdapter = {
  getStats,
};
