import { Navigate, useNavigate } from 'react-router-dom';
import { AuthForm } from '../features/auth/AuthForm';
import { useAuth } from '../features/auth/AuthContext';

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <p className="mx-auto max-w-sm p-6 text-sm text-stone-500">Laden...</p>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="py-16">
      <AuthForm
        onAuthenticated={(authenticatedUser, token) => {
          login(authenticatedUser, token);
          navigate('/', { replace: true });
        }}
      />
    </div>
  );
}
