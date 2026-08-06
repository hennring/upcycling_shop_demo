import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import type { AdminArticle } from '../api/contracts';
import { useAuth } from '../features/auth/AuthContext';

interface AdminArticlesState {
  articles: AdminArticle[];
  status: 'loading' | 'ready' | 'error';
}

/** Loads all articles (drafts included) and exposes a reload after mutations. Mirrors useAdminStats.ts. */
export function useAdminArticles() {
  const { token } = useAuth();
  const [state, setState] = useState<AdminArticlesState>({ articles: [], status: 'loading' });

  const reload = useCallback(() => {
    if (!token) {
      return;
    }

    setState((prev) => ({ ...prev, status: 'loading' }));
    api.admin
      .listArticles(token)
      .then((articles) => setState({ articles, status: 'ready' }))
      .catch(() => setState({ articles: [], status: 'error' }));
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}
