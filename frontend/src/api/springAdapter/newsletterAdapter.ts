import type { NewsletterAdapter } from '../contracts';

async function subscribe(email: string): Promise<void> {
  const res = await fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  // 204 on success, 400 if the backend rejects the address format
  if (!res.ok) {
    throw new Error(`Newsletter sign-up failed with status ${res.status}`);
  }
}

export const springNewsletterAdapter: NewsletterAdapter = {
  subscribe,
};
