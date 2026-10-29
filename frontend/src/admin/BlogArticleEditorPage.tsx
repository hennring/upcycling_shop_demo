import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../features/auth/AuthContext';
import { LoadingNotice } from '../components/LoadingNotice';

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  published: boolean;
}

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  imageUrl: '',
  published: false,
};

export function BlogArticleEditorPage() {
  const { id } = useParams();
  const articleId = id ? Number(id) : null;
  const isEditing = articleId !== null;

  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'missing' | 'error'>(
    isEditing ? 'loading' : 'ready',
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing || !token || articleId === null) {
      return;
    }

    let active = true;
    api.admin
      .getArticle(token, articleId)
      .then((article) => {
        if (!active) return;
        setForm({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt ?? '',
          content: article.content,
          imageUrl: article.imageUrl ?? '',
          published: article.published,
        });
        setLoadStatus('ready');
      })
      .catch(() => {
        if (active) setLoadStatus('error');
      });

    return () => {
      active = false;
    };
  }, [isEditing, token, articleId]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // one object URL per selected file, revoked when replaced or when the page unmounts
  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setSubmitting(true);
    try {
      // one click does both: upload the new image first (if any), then save the article
      // with its resulting URL - the admin never has to upload before they can save.
      const imageUrl = imageFile ? await api.admin.uploadArticleImage(token, imageFile) : form.imageUrl;
      const input = { ...form, imageUrl };

      if (isEditing && articleId !== null) {
        await api.admin.updateArticle(token, articleId, input);
      } else {
        await api.admin.createArticle(token, input);
      }
      navigate('/admin/articles');
    } catch {
      setError('Speichern fehlgeschlagen. Bitte Eingaben prüfen und erneut versuchen.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadStatus === 'loading') {
    return <LoadingNotice />;
  }

  if (loadStatus === 'missing' || loadStatus === 'error') {
    return <p className="text-sm text-stone-500">Dieser Artikel lässt sich nicht laden.</p>;
  }

  const previewSrc = imagePreviewUrl ?? (form.imageUrl || null);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-stone-900">
        {isEditing ? 'Artikel bearbeiten' : 'Neuer Artikel'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Titel</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
            className="rounded-lg border border-stone-300 px-3 py-2 focus:border-rust focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Slug (optional)</span>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            placeholder="wird aus dem Titel abgeleitet, wenn leer"
            className="rounded-lg border border-stone-300 px-3 py-2 focus:border-rust focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Kurzbeschreibung</span>
          <textarea
            value={form.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            rows={2}
            className="rounded-lg border border-stone-300 px-3 py-2 focus:border-rust focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Inhalt</span>
          <textarea
            value={form.content}
            onChange={(e) => updateField('content', e.target.value)}
            required
            rows={10}
            className="rounded-lg border border-stone-300 px-3 py-2 focus:border-rust focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Bild</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-sm text-stone-600"
          />
          {previewSrc && (
            <img
              src={previewSrc}
              alt="Vorschau"
              className="mt-2 h-40 w-full rounded-lg object-cover"
            />
          )}
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => updateField('published', e.target.checked)}
            className="h-4 w-4 rounded border-stone-300"
          />
          <span className="text-sm font-medium text-stone-700">Veröffentlicht</span>
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
            onClick={() => navigate('/admin/articles')}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
