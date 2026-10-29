import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LoadingNotice } from '../../components/LoadingNotice';
import { NotFoundPage } from '../../pages/NotFoundPage';
import type { BlogArticle } from '../../api/contracts';
import { useBlogArticles } from './useBlogArticles';

const DATE_FORMAT = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function formatDate(isoDate: string | null): string | null {
  if (!isoDate) {
    return null;
  }
  const parsed = new Date(isoDate);
  return Number.isNaN(parsed.getTime()) ? null : DATE_FORMAT.format(parsed);
}

type NavDirection = 'left' | 'right';

function ArticleNavLink({
  article,
  direction,
  label,
  onNavigate,
}: {
  article: BlogArticle;
  direction: NavDirection;
  label: string;
  onNavigate: (direction: NavDirection) => void;
}) {
  const isRight = direction === 'right';
  return (
    <Link
      to={`/werkstattbuch/${article.slug}`}
      onClick={() => onNavigate(direction)}
      className={`group flex max-w-[45%] items-center gap-3 text-stone-500 transition-colors hover:text-rust ${
        isRight ? 'flex-row-reverse text-right' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-300 transition-colors group-hover:border-rust ${
          isRight ? 'rotate-180' : ''
        }`}
      >
        ←
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-xs tracking-wide text-stone-400 uppercase">
          {label}
        </span>
        <span className="block truncate text-sm font-medium">{article.title}</span>
      </span>
    </Link>
  );
}

export function BlogArticleDetailPage() {
  const { slug = '' } = useParams();
  const { articles, status } = useBlogArticles();
  const [direction, setDirection] = useState<NavDirection | null>(null);

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16" aria-busy="true">
        <LoadingNotice className="mb-6" />
        <div className="aspect-16/9 animate-pulse rounded-2xl bg-stone-200" />
        <div className="mt-8 space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-stone-200" />
          <div className="h-24 animate-pulse rounded bg-stone-200" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <p className="rounded-2xl border border-brass/60 bg-brass/10 p-6 text-stone-700">
          Dieser Beitrag lässt sich gerade nicht laden. Bitte später erneut versuchen.
        </p>
        <Link to="/#werkstattbuch" className="mt-6 inline-block text-sm text-rust underline">
          Zurück zum Werkstattbuch
        </Link>
      </div>
    );
  }

  const article = articles.find((entry) => entry.slug === slug);

  // an unknown slug and a draft that fell back out of publication both answer 404
  if (!article) {
    return <NotFoundPage />;
  }

  const publishedAt = formatDate(article.publishedAt);

  // articles arrive newest first - the previous entry is the newer article, the next one the older
  const currentIndex = articles.findIndex((entry) => entry.slug === article.slug);
  const newerArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const olderArticle =
    currentIndex !== -1 && currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  const animationClass =
    direction === 'right'
      ? 'animate-[article-slide-in-from-right_0.4s_ease-out]'
      : direction === 'left'
        ? 'animate-[article-slide-in-from-left_0.4s_ease-out]'
        : 'animate-[article-fade-in_0.4s_ease-out]';

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {(newerArticle || olderArticle) && (
        <nav className="mb-10 flex items-start justify-between gap-4 border-b border-stone-200 pb-6">
          {newerArticle ? (
            <ArticleNavLink
              article={newerArticle}
              direction="left"
              label="Neuerer Beitrag"
              onNavigate={setDirection}
            />
          ) : (
            <span />
          )}
          {olderArticle ? (
            <ArticleNavLink
              article={olderArticle}
              direction="right"
              label="Älterer Beitrag"
              onNavigate={setDirection}
            />
          ) : (
            <span />
          )}
        </nav>
      )}

      <div key={article.slug} className={animationClass}>
        {publishedAt && (
          <time
            dateTime={article.publishedAt ?? undefined}
            className="block font-mono text-xs tracking-wide text-stone-500 uppercase"
          >
            {publishedAt}
          </time>
        )}

        <h1 className="mt-3 font-display text-3xl font-semibold text-stone-900 md:text-4xl">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-6 text-lg leading-relaxed text-stone-600">{article.excerpt}</p>
        )}

        <div className="mt-8 space-y-4 leading-relaxed text-stone-700">
          {article.content
            .split(/\n\s*\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
        </div>

        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="mt-6 aspect-16/9 w-full rounded-2xl object-cover"
          />
        )}
      </div>
    </article>
  );
}
