import { useState } from 'react';
import { useNewsletterSignup } from './useNewsletterSignup';

interface NewsletterFormProps {
  /** Address of the signed-in account; the subscription always uses this one. */
  email: string;
}

export function NewsletterForm({ email }: NewsletterFormProps) {
  const { status, subscribe } = useNewsletterSignup();
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await subscribe(email);
  }

  if (status === 'subscribed') {
    return (
      <div role="status" className="text-stone-700">
        <h3 className="font-display text-xl font-semibold text-stone-900">Eingetragen.</h3>
        <p className="mt-3 leading-relaxed">
          Der nächste Werkstattbrief geht an <strong className="text-stone-900">{email}</strong>. Im
          Fuß jeder Mail steht der Abmeldelink.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h3 className="font-display text-xl font-semibold text-stone-900">Werkstattbrief abonnieren</h3>

      <div>
        <label htmlFor="newsletter-email" className="text-sm font-medium text-stone-700">
          Ihre Adresse
        </label>
        {/* readOnly, not disabled: the value stays selectable and keeps normal contrast */}
        <input
          id="newsletter-email"
          type="email"
          value={email}
          readOnly
          className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-600"
        />
        <p className="mt-2 text-xs text-stone-500">
          Die Adresse Ihres Kontos. Eine andere Adresse abonnieren geht nicht.
        </p>
      </div>

      <label className="flex gap-3 text-sm leading-relaxed text-stone-600">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          className="mt-1 size-4 shrink-0 accent-rust"
        />
        Ja, schickt mir den Werkstattbrief an diese Adresse. Ich kann mich jederzeit wieder
        abmelden.
      </label>

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-700">
          Das hat gerade nicht funktioniert. Bitte später erneut versuchen.
        </p>
      )}

      <button
        type="submit"
        disabled={!consent || status === 'submitting'}
        className="rounded-lg bg-rust px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-dark disabled:opacity-50"
      >
        {status === 'submitting' ? 'Wird eingetragen...' : 'Abonnieren'}
      </button>
    </form>
  );
}
