import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

/** Absolutely positioned over the header instead of inside it, so it doesn't crowd the header's own content or shift its centering. */
export function AdminEntry() {
  const { user } = useAuth();
  if (user?.role !== 'ADMIN') return null;

  return (
    <Link
      to="/admin"
      className="absolute left-0 top-0 z-10 flex h-full items-center bg-stone-900 px-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-stone-700"
    >
      Admin
    </Link>
  );
}
