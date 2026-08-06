const PRICE_FORMAT = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

/** Prices always come from the backend; this only formats them. */
export function formatPrice(amount: number): string {
  return PRICE_FORMAT.format(amount);
}
