import { Link } from 'react-router-dom';
import { api } from '../api';
import type { AdminNewsletter } from '../api/contracts';
import { useAuth } from '../features/auth/AuthContext';
import { useAdminNewsletters } from './useAdminNewsletters';

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

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 18 9-18 9 4.5-9L3 3Z" />
    </svg>
  );
}

function NewsletterRow({
  newsletter,
  onDelete,
  onSend,
}: {
  newsletter: AdminNewsletter;
  onDelete: (id: number) => void;
  onSend: (id: number) => void;
}) {
  return (
    <tr className="border-b border-stone-200">
      <td className="py-3 pr-4 font-medium text-stone-900">{newsletter.subject}</td>
      <td className="py-3 pr-4">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            newsletter.status === 'SENT' ? 'bg-green-100 text-green-800' : 'bg-stone-200 text-stone-600'
          }`}
        >
          {newsletter.status === 'SENT' ? 'Versendet' : 'Entwurf'}
        </span>
      </td>
      <td className="py-3 pr-4 text-stone-500">{newsletter.blogArticleTitle ?? '-'}</td>
      <td className="py-3 pr-4 text-stone-500">{formatDate(newsletter.createdAt)}</td>
      <td className="py-3 text-right">
        {newsletter.status === 'DRAFT' && (
          <button
            type="button"
            onClick={() => onSend(newsletter.id)}
            title="Senden"
            aria-label="Senden"
            className="inline-flex text-rust transition-colors hover:text-rust-dark"
          >
            <SendIcon />
          </button>
        )}
        <Link
          to={`/admin/newsletter/${newsletter.id}`}
          title="Bearbeiten"
          aria-label="Bearbeiten"
          className="ml-4 inline-flex text-blue-600 transition-colors hover:text-blue-800"
        >
          <PencilIcon />
        </Link>
        <button
          type="button"
          onClick={() => onDelete(newsletter.id)}
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

export function NewslettersPage() {
  const { token } = useAuth();
  const { newsletters, status, reload } = useAdminNewsletters();

  function handleDelete(id: number) {
    if (!token) return;
    if (!window.confirm('Diesen Newsletter wirklich löschen?')) return;

    api.admin
      .deleteNewsletter(token, id)
      .then(reload)
      .catch(() => window.alert('Löschen fehlgeschlagen. Bitte erneut versuchen.'));
  }

  function handleSend(id: number) {
    if (!token) return;
    if (!window.confirm('Diesen Newsletter wirklich an alle Abonnenten senden?')) return;

    api.admin
      .sendNewsletter(token, id)
      .then(reload)
      .catch(() => window.alert('Senden fehlgeschlagen. Bitte erneut versuchen.'));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-stone-900">Newsletter</h1>
        <Link
          to="/admin/newsletter/new"
          className="rounded-lg bg-rust px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
        >
          Neuer Newsletter
        </Link>
      </div>

      {status === 'loading' && <p className="mt-8 text-sm text-stone-500">Laden...</p>}

      {status === 'error' && (
        <p className="mt-8 rounded-2xl border border-brass/60 bg-brass/10 p-6 text-stone-700">
          Die Newsletter lassen sich gerade nicht laden. Bitte später erneut versuchen.
        </p>
      )}

      {status === 'ready' && newsletters.length === 0 && (
        <p className="mt-8 text-sm text-stone-500">Noch keine Newsletter angelegt.</p>
      )}

      {status === 'ready' && newsletters.length > 0 && (
        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-300 text-stone-500">
              <th className="py-2 pr-4 font-medium">Betreff</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Verknüpfter Artikel</th>
              <th className="py-2 pr-4 font-medium">Erstellt am</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {newsletters.map((newsletter) => (
              <NewsletterRow key={newsletter.id} newsletter={newsletter} onDelete={handleDelete} onSend={handleSend} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
