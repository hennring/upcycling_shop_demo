import { useAdminStats } from './useAdminStats';

interface Tile {
  label: string;
  value: number;
}

function StatTile({ tile }: { tile: Tile }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <p className="text-sm text-stone-500">{tile.label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-stone-900">{tile.value}</p>
    </div>
  );
}

/** Phase 4: one tile (Abonnenten). Phase 5/6 add more stats to this array as they land. */
export function DashboardPage() {
  const { stats, status } = useAdminStats();
  const tiles: Tile[] = stats ? [{ label: 'Abonnenten', value: stats.activeSubscriberCount }] : [];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-stone-900">Dashboard</h1>

      {status === 'loading' && <p className="mt-8 text-sm text-stone-500">Laden...</p>}

      {status === 'error' && (
        <p className="mt-8 rounded-2xl border border-brass/60 bg-brass/10 p-6 text-stone-700">
          Die Statistiken lassen sich gerade nicht laden. Bitte später erneut versuchen.
        </p>
      )}

      {status === 'ready' && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile) => (
            <StatTile key={tile.label} tile={tile} />
          ))}
        </div>
      )}
    </div>
  );
}
