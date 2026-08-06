import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

/** Sits left of the header instead of inside it, so it doesn't crowd the header's own content. */
export function AdminEntry() {
  const { user } = useAuth();
  if (user?.role !== 'ADMIN') return null;

  return (
    <Link
      to="/admin"
      className="flex shrink-0 items-center bg-stone-900 px-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-stone-700"
    >
      Admin
    </Link>
  );
}
