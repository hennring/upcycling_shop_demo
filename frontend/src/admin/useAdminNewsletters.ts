import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import type { AdminNewsletter } from '../api/contracts';
import { useAuth } from '../features/auth/AuthContext';

interface AdminNewslettersState {
  newsletters: AdminNewsletter[];
  status: 'loading' | 'ready' | 'error';
}

/** Loads all newsletters and exposes a reload after mutations. Mirrors useAdminBlogArticles.ts. */
export function useAdminNewsletters() {
  const { token } = useAuth();
  const [state, setState] = useState<AdminNewslettersState>({ newsletters: [], status: 'loading' });

  const reload = useCallback(() => {
    if (!token) {
      return;
    }

    setState((prev) => ({ ...prev, status: 'loading' }));
    api.admin
      .listNewsletters(token)
      .then((newsletters) => setState({ newsletters, status: 'ready' }))
      .catch(() => setState({ newsletters: [], status: 'error' }));
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}
