import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthForm } from '../features/auth/AuthForm';
import { useAuth } from '../features/auth/AuthContext';

/**
 * Where to go after a successful login. Links that send visitors here for a specific
 * purpose (e.g. the newsletter opt-in) pass their own target as router state, everything
 * else lands on the landing page. Only in-app paths are accepted, so the state cannot
 * bounce someone to an external site.
 */
function resolveReturnTo(state: unknown): string {
  const returnTo = (state as { returnTo?: unknown } | null)?.returnTo;
  return typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//')
    ? returnTo
    : '/';
}

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const returnTo = resolveReturnTo(state);

  if (loading) {
    return <p className="mx-auto max-w-sm p-6 text-sm text-stone-500">Laden...</p>;
  }

  if (user) {
    return <Navigate to={returnTo} replace />;
  }

  return (
    <div className="py-16">
      <AuthForm
        onAuthenticated={(authenticatedUser, token) => {
          login(authenticatedUser, token);
          navigate(returnTo, { replace: true });
        }}
      />
    </div>
  );
}
