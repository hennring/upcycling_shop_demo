import { useState } from 'react';
import { api } from '../../api';
import type { User } from '../../api/contracts';

interface AuthFormProps {
  onAuthenticated: (user: User, token: string) => void;
}

export function AuthForm({ onAuthenticated }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = mode === 'login'
        ? await api.auth.login(email, password)
        : await api.auth.register(email, password);
      onAuthenticated(result.user, result.token);
    } catch {
      setError(mode === 'login' ? 'Login fehlgeschlagen' : 'Registrierung fehlgeschlagen');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-sm flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm"
    >
      <h2 className="font-display text-xl font-semibold text-stone-900">
        {mode === 'login' ? 'Anmelden' : 'Konto anlegen'}
      </h2>
      <p className="-mt-2 text-sm text-stone-500">
        Für Bestellungen, den Warenkorb und das Werkstattbuch-Abo.
      </p>

      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="rounded-lg border border-stone-300 px-3 py-2 focus:border-rust focus:outline-none"
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        className="rounded-lg border border-stone-300 px-3 py-2 focus:border-rust focus:outline-none"
      />

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-rust px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-rust-dark disabled:opacity-50"
      >
        {mode === 'login' ? 'Anmelden' : 'Registrieren'}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="text-sm text-rust underline"
      >
        {mode === 'login' ? 'Noch kein Konto? Registrieren' : 'Schon registriert? Anmelden'}
      </button>
    </form>
  );
}
