import type { BackendAdapter } from '../contracts';
import { springAuthAdapter } from './authAdapter';
import { springBlogAdapter } from './blogAdapter';

export const springAdapter: BackendAdapter = {
  auth: springAuthAdapter,
  blog: springBlogAdapter,
};
