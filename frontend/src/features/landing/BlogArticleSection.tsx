import { Link } from 'react-router-dom';
import type { BlogArticle } from '../../api/contracts';
import { useBlogArticles } from '../blog/useBlogArticles';

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

function BlogArticleCard({ article }: { article: BlogArticle }) {
  const publishedAt = formatDate(article.publishedAt);

  return (
    <Link
      to={`/werkstattbuch/${article.slug}`}
      className="flex flex-col rounded-2xl border border-stone-200 bg-white p-8 transition-shadow hover:shadow-lg"
    >
      <article className="flex flex-1 flex-col">
        {publishedAt && (
          <time
            dateTime={article.publishedAt ?? undefined}
            className="font-mono text-xs tracking-wide text-stone-500 uppercase"
          >
            {publishedAt}
          </time>
        )}
        <h3 className="mt-3 font-display text-xl leading-snug font-semibold text-stone-900">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-4 flex-1 leading-relaxed text-stone-600">{article.excerpt}</p>
        )}
      </article>
    </Link>
  );
}

export function BlogArticleSection() {
  const { articles, status } = useBlogArticles();
  // the landing page only teases the feed; the full archive gets its own page later
  const latest = articles.slice(0, 3);

  return (
    <section id="werkstattbuch" className="scroll-mt-20 bg-stone-100 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold tracking-widest text-rust uppercase">Werkstattbuch</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-stone-900 md:text-4xl">
          Was diese Woche angekommen ist
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-stone-600">
          Neue Lieferungen, Fundstücke und die Geschichte einzelner Sachen – aufgeschrieben, solange
          wir sie noch wissen.
        </p>

        <div className="mt-14">
          {status === 'loading' && (
            <div className="grid gap-6 md:grid-cols-3" aria-busy="true">
              {[0, 1, 2].map((index) => (
                <div key={index} className="h-56 animate-pulse rounded-2xl bg-stone-200" />
              ))}
            </div>
          )}

          {status === 'error' && (
            <p className="rounded-2xl border border-brass/60 bg-brass/10 p-6 text-stone-700">
              Die Beiträge lassen sich gerade nicht laden. Bitte später erneut versuchen.
            </p>
          )}

          {status === 'ready' && latest.length === 0 && (
            <p className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
              Hier erscheinen bald die ersten Einträge.
            </p>
          )}

          {status === 'ready' && latest.length > 0 && (
            <div className="grid gap-6 md:grid-cols-3">
              {latest.map((article) => (
                <BlogArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
