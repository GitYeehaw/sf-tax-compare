import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCurrencyDetailed, formatPercent } from '../formatters.js';

describe('formatCurrency', () => {
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('formats whole dollars without cents', () => {
    expect(formatCurrency(1234)).toBe('$1,234');
  });

  it('rounds fractional dollars to whole', () => {
    expect(formatCurrency(99.4)).toBe('$99');
    expect(formatCurrency(99.6)).toBe('$100');
  });

  it('inserts thousands separators', () => {
    expect(formatCurrency(1234567)).toBe('$1,234,567');
  });

  it('formats negative numbers', () => {
    expect(formatCurrency(-500)).toBe('-$500');
  });
});

describe('formatCurrencyDetailed', () => {
  it('shows two decimal places for whole numbers', () => {
    expect(formatCurrencyDetailed(1234)).toBe('$1,234.00');
  });

  it('shows two decimal places for fractional amounts', () => {
    expect(formatCurrencyDetailed(1234.56)).toBe('$1,234.56');
  });

  it('formats zero with cents', () => {
    expect(formatCurrencyDetailed(0)).toBe('$0.00');
  });
});

describe('formatPercent', () => {
  it('formats zero rate', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('formats whole rate', () => {
    expect(formatPercent(1)).toBe('100.0%');
  });

  it('rounds to one decimal place', () => {
    expect(formatPercent(0.1234)).toBe('12.3%');
    expect(formatPercent(0.126)).toBe('12.6%');
  });

  it('formats small rates', () => {
    expect(formatPercent(0.005)).toBe('0.5%');
  });
});
