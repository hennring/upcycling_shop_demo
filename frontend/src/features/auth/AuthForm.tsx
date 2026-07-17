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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto p-6">
      <h2 className="text-xl font-medium">{mode === 'login' ? 'Login' : 'Registrieren'}</h2>

      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border rounded px-3 py-2"
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        className="border rounded px-3 py-2"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-purple-600 text-white rounded px-3 py-2 disabled:opacity-50"
      >
        {mode === 'login' ? 'Anmelden' : 'Registrieren'}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="text-sm text-purple-600 underline"
      >
        {mode === 'login' ? 'Noch kein Konto? Registrieren' : 'Schon registriert? Anmelden'}
      </button>
    </form>
  );
}
