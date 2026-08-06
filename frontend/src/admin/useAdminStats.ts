import { useEffect, useState } from 'react';
import { api } from '../api';
import type { AdminStats } from '../api/contracts';
import { useAuth } from '../features/auth/AuthContext';

interface AdminStatsState {
  stats: AdminStats | null;
  status: 'loading' | 'ready' | 'error';
}

/** Loads the dashboard tiles once per token. Mirrors useArticles.ts. */
export function useAdminStats(): AdminStatsState {
  const { token } = useAuth();
  const [state, setState] = useState<AdminStatsState>({ stats: null, status: 'loading' });

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;
    setState({ stats: null, status: 'loading' });

    api.admin
      .getStats(token)
      .then((stats) => {
        if (active) {
          setState({ stats, status: 'ready' });
        }
      })
      .catch(() => {
        if (active) {
          setState({ stats: null, status: 'error' });
        }
      });

    // StrictMode mounts twice in development - ignore the result of the discarded run
    return () => {
      active = false;
    };
  }, [token]);

  return state;
}
