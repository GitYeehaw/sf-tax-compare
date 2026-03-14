const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const currencyDetailedFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

export function formatCurrencyDetailed(amount) {
  return currencyDetailedFormatter.format(amount);
}

export function formatPercent(rate) {
  return (rate * 100).toFixed(1) + '%';
}
