import type { BlogAdapter, BlogArticle } from '../contracts';
import { NotFoundError } from '../errors';

/** The backend also returns draft flags and edit timestamps; the public feed ignores them. */
interface BlogArticleResponseDto {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  publishedAt: string | null;
}

function toArticle(dto: BlogArticleResponseDto): BlogArticle {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    excerpt: dto.excerpt,
    content: dto.content,
    imageUrl: dto.imageUrl,
    publishedAt: dto.publishedAt,
  };
}

async function listArticles(): Promise<BlogArticle[]> {
  const res = await fetch('/api/blog');

  if (!res.ok) {
    throw new Error(`Loading the news feed failed with status ${res.status}`);
  }

  const dtos: BlogArticleResponseDto[] = await res.json();
  return dtos.map(toArticle);
}

async function getArticle(slug: string): Promise<BlogArticle> {
  const res = await fetch(`/api/blog/${encodeURIComponent(slug)}`);

  // a draft answers 404 as well - for a visitor both mean "not published"
  if (res.status === 404) {
    throw new NotFoundError(`Unknown article slug: ${slug}`);
  }
  if (!res.ok) {
    throw new Error(`Loading the article failed with status ${res.status}`);
  }

  return toArticle(await res.json());
}

export const springBlogAdapter: BlogAdapter = {
  listArticles,
  getArticle,
};
