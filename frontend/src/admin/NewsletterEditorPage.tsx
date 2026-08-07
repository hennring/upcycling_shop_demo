import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import type { AdminBlogArticle } from '../api/contracts';
import { useAuth } from '../features/auth/AuthContext';
import { RichTextEditor } from './RichTextEditor';

interface FormState {
  subject: string;
  content: string;
  blogArticleId: number | null;
}

const EMPTY_FORM: FormState = {
  subject: '',
  content: '',
  blogArticleId: null,
};

export function NewsletterEditorPage() {
  const { id } = useParams();
  const newsletterId = id ? Number(id) : null;
  const isEditing = newsletterId !== null;

  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [articles, setArticles] = useState<AdminBlogArticle[]>([]);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'missing' | 'error'>(
    isEditing ? 'loading' : 'ready',
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.admin
      .listArticles(token)
      .then((all) => setArticles(all.filter((article) => article.published)))
      .catch(() => setArticles([]));
  }, [token]);

  useEffect(() => {
    if (!isEditing || !token || newsletterId === null) {
      return;
    }

    let active = true;
    api.admin
      .getNewsletter(token, newsletterId)
      .then((newsletter) => {
        if (!active) return;
        setForm({
          subject: newsletter.subject,
          content: newsletter.content,
          blogArticleId: newsletter.blogArticleId,
        });
        setLoadStatus('ready');
      })
      .catch(() => {
        if (active) setLoadStatus('error');
      });

    return () => {
      active = false;
    };
  }, [isEditing, token, newsletterId]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setSubmitting(true);
    try {
      if (isEditing && newsletterId !== null) {
        await api.admin.updateNewsletter(token, newsletterId, form);
      } else {
        await api.admin.createNewsletter(token, form);
      }
      navigate('/admin/newsletter');
    } catch {
      setError('Speichern fehlgeschlagen. Bitte Eingaben prüfen und erneut versuchen.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadStatus === 'loading') {
    return <p className="text-sm text-stone-500">Laden...</p>;
  }

  if (loadStatus === 'missing' || loadStatus === 'error') {
    return <p className="text-sm text-stone-500">Dieser Newsletter lässt sich nicht laden.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-stone-900">
        {isEditing ? 'Newsletter bearbeiten' : 'Neuer Newsletter'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Betreff</span>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => updateField('subject', e.target.value)}
            required
            className="rounded-lg border border-stone-300 px-3 py-2 focus:border-rust focus:outline-none"
          />
        </label>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Inhalt</span>
          <RichTextEditor value={form.content} onChange={(html) => updateField('content', html)} />
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Blogartikel verknüpfen (optional)</span>
          <select
            value={form.blogArticleId ?? ''}
            onChange={(e) => updateField('blogArticleId', e.target.value ? Number(e.target.value) : null)}
            className="rounded-lg border border-stone-300 px-3 py-2 focus:border-rust focus:outline-none"
          >
            <option value="">- kein Artikel -</option>
            {articles.map((article) => (
              <option key={article.id} value={article.id}>
                {article.title}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-rust px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rust-dark disabled:opacity-50"
          >
            {submitting ? 'Wird gespeichert...' : 'Speichern'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/newsletter')}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
