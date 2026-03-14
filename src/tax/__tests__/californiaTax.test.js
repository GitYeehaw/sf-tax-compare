import { describe, it, expect } from 'vitest';
import { calculateCaliforniaTax } from '../californiaTax.js';

describe('calculateCaliforniaTax', () => {
  it('returns zeros for zero income', () => {
    const result = calculateCaliforniaTax(0);
    expect(result.baseTax).toBe(0);
    expect(result.mentalHealthSurcharge).toBe(0);
    expect(result.total).toBe(0);
  });

  it('returns zeros for negative income', () => {
    const result = calculateCaliforniaTax(-1000);
    expect(result.total).toBe(0);
  });

  it('calculates 1% bracket correctly', () => {
    // $10,000 * 1% = $100
    const result = calculateCaliforniaTax(10000);
    expect(result.baseTax).toBeCloseTo(100, 2);
    expect(result.mentalHealthSurcharge).toBe(0);
  });

  it('calculates tax at $50,000', () => {
    // 1%: $11,079 * 0.01 = $110.79
    // 2%: ($26,264 - $11,079) * 0.02 = $303.70
    // 4%: ($41,452 - $26,264) * 0.04 = $607.52
    // 6%: ($50,000 - $41,452) * 0.06 = $512.88
    // Total = $1,534.89
    const result = calculateCaliforniaTax(50000);
    expect(result.baseTax).toBeCloseTo(1534.89, 0);
    expect(result.mentalHealthSurcharge).toBe(0);
  });

  it('calculates tax at $100,000', () => {
    // Through 8% bracket + partial 9.3%
    const result = calculateCaliforniaTax(100000);
    expect(result.baseTax).toBeGreaterThan(0);
    expect(result.mentalHealthSurcharge).toBe(0);
  });

  it('does not apply mental health surcharge below $1M', () => {
    const result = calculateCaliforniaTax(999999);
    expect(result.mentalHealthSurcharge).toBe(0);
  });

  it('applies mental health surcharge above $1M', () => {
    const result = calculateCaliforniaTax(1200000);
    // Surcharge: ($1,200,000 - $1,000,000) * 0.01 = $2,000
    expect(result.mentalHealthSurcharge).toBeCloseTo(2000, 2);
    expect(result.total).toBe(result.baseTax + result.mentalHealthSurcharge);
  });

  it('total equals baseTax + surcharge', () => {
    const result = calculateCaliforniaTax(1500000);
    expect(result.total).toBeCloseTo(result.baseTax + result.mentalHealthSurcharge, 2);
  });
});
