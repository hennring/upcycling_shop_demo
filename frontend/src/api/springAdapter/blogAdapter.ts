import type { Article, BlogAdapter } from '../contracts';

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

async function listArticles(): Promise<Article[]> {
  const res = await fetch('/api/blog');

  if (!res.ok) {
    throw new Error(`Loading the news feed failed with status ${res.status}`);
  }

  const dtos: BlogArticleResponseDto[] = await res.json();
  return dtos.map((dto) => ({
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    excerpt: dto.excerpt,
    content: dto.content,
    imageUrl: dto.imageUrl,
    publishedAt: dto.publishedAt,
  }));
}

export const springBlogAdapter: BlogAdapter = {
  listArticles,
};
