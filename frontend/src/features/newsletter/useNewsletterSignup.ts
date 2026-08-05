import { useState } from 'react';
import { api } from '../../api';

type SignupStatus = 'idle' | 'submitting' | 'subscribed' | 'error';

interface NewsletterSignup {
  status: SignupStatus;
  subscribe: (email: string) => Promise<void>;
}

/**
 * Wraps the one-shot newsletter opt-in. Backend-agnostic: it only talks to the adapter.
 *
 * The status lives in component state on purpose - the backend deliberately does not
 * expose whether an address is subscribed, so "subscribed" only ever means "this visit
 * signed up", never "is on the list".
 */
export function useNewsletterSignup(): NewsletterSignup {
  const [status, setStatus] = useState<SignupStatus>('idle');

  async function subscribe(email: string) {
    setStatus('submitting');
    try {
      await api.newsletter.subscribe(email);
      setStatus('subscribed');
    } catch {
      setStatus('error');
    }
  }

  return { status, subscribe };
}
