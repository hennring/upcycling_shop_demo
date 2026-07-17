import type { BackendAdapter } from './contracts';
import { springAdapter } from './springAdapter';

const backend = import.meta.env.VITE_BACKEND ?? 'spring';

function resolveAdapter(): BackendAdapter {
  switch (backend) {
    case 'spring':
      return springAdapter;
    case 'firebase':
      throw new Error('Firebase adapter not implemented yet (Phase 7)');
    default:
      throw new Error(`Unknown VITE_BACKEND value: ${backend}`);
  }
}

export const api = resolveAdapter();
