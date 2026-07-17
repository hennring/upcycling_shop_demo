import { AuthForm } from './features/auth/AuthForm';
import { useAuth } from './features/auth/AuthContext';

function App() {
  const { user, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="max-w-sm mx-auto p-6">
        <p className="text-sm text-gray-500">Laden...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="max-w-sm mx-auto p-6">
        <h1 className="text-xl font-medium">Angemeldet als {user.email}</h1>
        <p className="text-sm text-gray-500">Rolle: {user.role}</p>
      </div>
    );
  }

  return <AuthForm onAuthenticated={login} />;
}

export default App;
