import type { BackendAdapter } from '../contracts';
import { springAuthAdapter } from './authAdapter';
import { springBlogAdapter } from './blogAdapter';
import { springCartAdapter } from './cartAdapter';
import { springNewsletterAdapter } from './newsletterAdapter';
import { springShopAdapter } from './productAdapter';

export const springAdapter: BackendAdapter = {
  auth: springAuthAdapter,
  blog: springBlogAdapter,
  shop: springShopAdapter,
  cart: springCartAdapter,
  newsletter: springNewsletterAdapter,
};
