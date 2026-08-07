import { useEffect, useState } from 'react';
import { api } from '../../api';
import type { BlogArticle } from '../../api/contracts';

interface BlogArticlesState {
  articles: BlogArticle[];
  status: 'loading' | 'ready' | 'error';
}

/** Loads the public news feed once. Backend-agnostic: it only talks to the adapter. */
export function useBlogArticles(): BlogArticlesState {
  const [state, setState] = useState<BlogArticlesState>({ articles: [], status: 'loading' });

  useEffect(() => {
    let active = true;

    api.blog
      .listArticles()
      .then((articles) => {
        if (active) {
          setState({ articles, status: 'ready' });
        }
      })
      .catch(() => {
        if (active) {
          setState({ articles: [], status: 'error' });
        }
      });

    // StrictMode mounts twice in development - ignore the result of the discarded run
    return () => {
      active = false;
    };
  }, []);

  return state;
}
