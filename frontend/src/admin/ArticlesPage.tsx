import { Link } from 'react-router-dom';
import { api } from '../api';
import type { AdminArticle } from '../api/contracts';
import { useAuth } from '../features/auth/AuthContext';
import { useAdminArticles } from './useAdminArticles';

function formatDate(iso: string | null): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('de-DE');
}

/** No icon library in this project - a plain inline SVG keeps that true. */
function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L8.5 18.79l-4 1 1-4 11.362-11.303Z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-12"
      />
    </svg>
  );
}

function ArticleRow({ article, onDelete }: { article: AdminArticle; onDelete: (id: number) => void }) {
  return (
    <tr className="border-b border-stone-200">
      <td className="py-3 pr-4 font-medium text-stone-900">{article.title}</td>
      <td className="py-3 pr-4 text-stone-500">{article.slug}</td>
      <td className="py-3 pr-4">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            article.published ? 'bg-green-100 text-green-800' : 'bg-stone-200 text-stone-600'
          }`}
        >
          {article.published ? 'Veröffentlicht' : 'Entwurf'}
        </span>
      </td>
      <td className="py-3 pr-4 text-stone-500">{formatDate(article.publishedAt)}</td>
      <td className="py-3 text-right">
        <Link
          to={`/admin/articles/${article.id}`}
          title="Bearbeiten"
          aria-label="Bearbeiten"
          className="inline-flex text-blue-600 transition-colors hover:text-blue-800"
        >
          <PencilIcon />
        </Link>
        <button
          type="button"
          onClick={() => onDelete(article.id)}
          title="Löschen"
          aria-label="Löschen"
          className="ml-4 inline-flex text-red-600 transition-colors hover:text-red-800"
        >
          <TrashIcon />
        </button>
      </td>
    </tr>
  );
}

export function ArticlesPage() {
  const { token } = useAuth();
  const { articles, status, reload } = useAdminArticles();

  function handleDelete(id: number) {
    if (!token) return;
    if (!window.confirm('Diesen Artikel wirklich löschen?')) return;

    api.admin
      .deleteArticle(token, id)
      .then(reload)
      .catch(() => window.alert('Löschen fehlgeschlagen. Bitte erneut versuchen.'));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-stone-900">Artikel</h1>
        <Link
          to="/admin/articles/new"
          className="rounded-lg bg-rust px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
        >
          Neuer Artikel
        </Link>
      </div>

      {status === 'loading' && <p className="mt-8 text-sm text-stone-500">Laden...</p>}

      {status === 'error' && (
        <p className="mt-8 rounded-2xl border border-brass/60 bg-brass/10 p-6 text-stone-700">
          Die Artikel lassen sich gerade nicht laden. Bitte später erneut versuchen.
        </p>
      )}

      {status === 'ready' && articles.length === 0 && (
        <p className="mt-8 text-sm text-stone-500">Noch keine Artikel angelegt.</p>
      )}

      {status === 'ready' && articles.length > 0 && (
        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-300 text-stone-500">
              <th className="py-2 pr-4 font-medium">Titel</th>
              <th className="py-2 pr-4 font-medium">Slug</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Veröffentlicht am</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <ArticleRow key={article.id} article={article} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
