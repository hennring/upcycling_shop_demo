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
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-lg border border-stone-300 py-2 pl-3 pr-10 focus:border-rust focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
          title={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-stone-500 hover:text-rust"
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

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
