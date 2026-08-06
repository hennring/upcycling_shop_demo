/**
 * How many pieces the current batch still holds. brand.md, Abschnitt 10: the shop says
 * "vergriffen", never "ausverkauft" - the batch is through, that is all.
 */
export function StockLabel({ stock, className = '' }: { stock: number; className?: string }) {
  if (stock <= 0) {
    return (
      <p className={`text-sm font-medium text-rust ${className}`}>Vergriffen</p>
    );
  }

  return (
    <p className={`text-sm text-stone-500 ${className}`}>
      {stock === 1 ? 'Letztes Stück' : `Noch ${stock} Stück`}
    </p>
  );
}
