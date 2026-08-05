import type { BackendAdapter } from '../contracts';
import { springAuthAdapter } from './authAdapter';
import { springBlogAdapter } from './blogAdapter';
import { springNewsletterAdapter } from './newsletterAdapter';

export const springAdapter: BackendAdapter = {
  auth: springAuthAdapter,
  blog: springBlogAdapter,
  newsletter: springNewsletterAdapter,
};
