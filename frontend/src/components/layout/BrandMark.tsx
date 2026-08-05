interface BrandMarkProps {
  /** Header uses the larger variant, the footer the smaller one. */
  size?: 'md' | 'sm';
  /** Dark backgrounds need the paper-coloured wordmark. */
  tone?: 'ink' | 'paper';
}

/**
 * Wordmark used in header and footer. The mark itself is the "2C" monogram from
 * brand.md - deliberately set in the display serif so it reads as a stamp, not a logo
 * that was generated somewhere.
 */
export function BrandMark({ size = 'md', tone = 'ink' }: BrandMarkProps) {
  const box = size === 'md' ? 'size-9 text-sm' : 'size-8 text-xs';
  const label = size === 'md' ? 'text-lg' : 'text-base';

  return (
    <span className={`flex items-center gap-3 font-semibold ${label}`}>
      <span
        aria-hidden="true"
        className={`grid ${box} shrink-0 place-items-center rounded-lg bg-rust font-display font-bold tracking-tight text-white`}
      >
        2C
      </span>
      <span className="flex flex-col leading-none">
        <span className={tone === 'paper' ? 'text-white' : 'text-stone-900'}>Zweite Chance</span>
        <span
          className={`mt-1 text-[0.625rem] font-medium tracking-[0.18em] uppercase ${
            tone === 'paper' ? 'text-stone-400' : 'text-stone-500'
          }`}
        >
          Upcycling-Manufaktur
        </span>
      </span>
    </span>
  );
}
