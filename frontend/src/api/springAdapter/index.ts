import type { BackendAdapter } from '../contracts';
import { springAuthAdapter } from './authAdapter';

export const springAdapter: BackendAdapter = {
  auth: springAuthAdapter,
};
