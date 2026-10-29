import { useEffect, useState } from 'react';

/** After this long the request is most likely waiting for a cold start, not just slow. */
const COLD_START_HINT_DELAY_MS = 3000;

interface LoadingNoticeProps {
  className?: string;
  label?: string;
}

/**
 * Spinner plus "Laden...". The backend runs on Render's free tier and sleeps after a while
 * of inactivity - waking it up takes up to a few minutes, so once a request takes longer
 * than a moment the notice explains the wait instead of looking stuck.
 */
export function LoadingNotice({ className = '', label = 'Laden...' }: LoadingNoticeProps) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), COLD_START_HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div role="status" aria-live="polite" className={`text-sm text-stone-500 ${className}`}>
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-rust"
        />
        <span>{label}</span>
      </div>
      {slow && (
        <p className="mt-2 max-w-md text-stone-600">
          Der Server wird gerade gestartet, weil er eine Weile nicht genutzt wurde. Das kann beim
          ersten Aufruf bis zu ein paar Minuten dauern.
        </p>
      )}
    </div>
  );
}
