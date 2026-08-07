import type {
  AdminAdapter,
  AdminBlogArticle,
  AdminNewsletter,
  AdminStats,
  BlogArticleInput,
  NewsletterInput,
  NewsletterStatus,
} from '../contracts';
import { ForbiddenError, UnauthorizedError } from '../errors';

/** The backend also returns createdAt/updatedAt; the admin UI has no use for them yet. */
interface BlogArticleAdminResponseDto {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  published: boolean;
  publishedAt: string | null;
}

interface ImageUploadResponseDto {
  imageUrl: string;
}

interface NewsletterAdminResponseDto {
  id: number;
  subject: string;
  content: string;
  status: NewsletterStatus;
  blogArticleId: number | null;
  blogArticleTitle: string | null;
  blogArticleSlug: string | null;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
}

async function request(token: string, path: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(`/api/admin${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...init.headers },
  });

  if (res.status === 401) {
    throw new UnauthorizedError('Admin request rejected - token expired or missing');
  }
  // authenticated, but the account is not ADMIN
  if (res.status === 403) {
    throw new ForbiddenError('Account lacks the ADMIN role');
  }
  if (!res.ok) {
    throw new Error(`Admin request failed with status ${res.status}`);
  }

  return res;
}

function toAdminArticle(dto: BlogArticleAdminResponseDto): AdminBlogArticle {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    excerpt: dto.excerpt,
    content: dto.content,
    imageUrl: dto.imageUrl,
    published: dto.published,
    publishedAt: dto.publishedAt,
  };
}

async function getStats(token: string): Promise<AdminStats> {
  const res = await request(token, '/newsletter/subscribers/active-count');
  const activeSubscriberCount: number = await res.json();
  return { activeSubscriberCount };
}

async function listArticles(token: string): Promise<AdminBlogArticle[]> {
  const res = await request(token, '/blog');
  const dtos: BlogArticleAdminResponseDto[] = await res.json();
  return dtos.map(toAdminArticle);
}

async function getArticle(token: string, id: number): Promise<AdminBlogArticle> {
  const res = await request(token, `/blog/${id}`);
  return toAdminArticle(await res.json());
}

async function createArticle(token: string, input: BlogArticleInput): Promise<AdminBlogArticle> {
  const res = await request(token, '/blog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return toAdminArticle(await res.json());
}

async function updateArticle(token: string, id: number, input: BlogArticleInput): Promise<AdminBlogArticle> {
  const res = await request(token, `/blog/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return toAdminArticle(await res.json());
}

async function deleteArticle(token: string, id: number): Promise<void> {
  await request(token, `/blog/${id}`, { method: 'DELETE' });
}

async function uploadArticleImage(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  // no Content-Type header here - the browser sets the multipart boundary for FormData bodies
  const res = await request(token, '/blog/images', { method: 'POST', body: formData });
  const dto: ImageUploadResponseDto = await res.json();
  return dto.imageUrl;
}

function toAdminNewsletter(dto: NewsletterAdminResponseDto): AdminNewsletter {
  return {
    id: dto.id,
    subject: dto.subject,
    content: dto.content,
    status: dto.status,
    blogArticleId: dto.blogArticleId,
    blogArticleTitle: dto.blogArticleTitle,
    blogArticleSlug: dto.blogArticleSlug,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    sentAt: dto.sentAt,
  };
}

async function listNewsletters(token: string): Promise<AdminNewsletter[]> {
  const res = await request(token, '/newsletter/campaigns');
  const dtos: NewsletterAdminResponseDto[] = await res.json();
  return dtos.map(toAdminNewsletter);
}

async function getNewsletter(token: string, id: number): Promise<AdminNewsletter> {
  const res = await request(token, `/newsletter/campaigns/${id}`);
  return toAdminNewsletter(await res.json());
}

async function createNewsletter(token: string, input: NewsletterInput): Promise<AdminNewsletter> {
  const res = await request(token, '/newsletter/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return toAdminNewsletter(await res.json());
}

async function updateNewsletter(token: string, id: number, input: NewsletterInput): Promise<AdminNewsletter> {
  const res = await request(token, `/newsletter/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return toAdminNewsletter(await res.json());
}

async function deleteNewsletter(token: string, id: number): Promise<void> {
  await request(token, `/newsletter/campaigns/${id}`, { method: 'DELETE' });
}

export const springAdminAdapter: AdminAdapter = {
  getStats,
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  uploadArticleImage,
  listNewsletters,
  getNewsletter,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
};
