import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { User } from '../api/contracts';
import { AuthForm } from '../features/auth/AuthForm';
import { useAuth } from '../features/auth/AuthContext';

/**
 * A caller-requested redirect target, e.g. the cart sends visitors back to "/cart" after
 * login. Only in-app paths are accepted, so the state cannot bounce someone to an
 * external site. Null means "no specific target was requested".
 */
function resolveExplicitReturnTo(state: unknown): string | null {
  const returnTo = (state as { returnTo?: unknown } | null)?.returnTo;
  return typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//')
    ? returnTo
    : null;
}

/**
 * Where to go after login. An explicit returnTo wins, unless it points into /admin and the
 * freshly logged-in user isn't an admin - that combination only arises when someone logged
 * out from an admin page (AdminRoute sends the ensuing redirect-to-login with returnTo:
 * "/admin") and then logs back in as a different, non-admin account. Otherwise admins land
 * on their dashboard instead of the public landing page.
 */
function landingPageFor(user: User, explicitReturnTo: string | null): string {
  if (explicitReturnTo && (user.role === 'ADMIN' || !explicitReturnTo.startsWith('/admin'))) {
    return explicitReturnTo;
  }
  return user.role === 'ADMIN' ? '/admin' : '/';
}

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const explicitReturnTo = resolveExplicitReturnTo(state);

  if (loading) {
    return <p className="mx-auto max-w-sm p-6 text-sm text-stone-500">Laden...</p>;
  }

  if (user) {
    return <Navigate to={landingPageFor(user, explicitReturnTo)} replace />;
  }

  return (
    <div className="py-16">
      <AuthForm
        onAuthenticated={(authenticatedUser, token) => {
          login(authenticatedUser, token);
          navigate(landingPageFor(authenticatedUser, explicitReturnTo), { replace: true });
        }}
      />
    </div>
  );
}
