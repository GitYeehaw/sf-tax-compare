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

  it('does NOT apply mental health surcharge at exactly $1,000,000 (strict greater than)', () => {
    const result = calculateCaliforniaTax(1000000);
    expect(result.mentalHealthSurcharge).toBe(0);
  });

  it('applies mental health surcharge one cent above $1,000,000', () => {
    const result = calculateCaliforniaTax(1000000.01);
    expect(result.mentalHealthSurcharge).toBeCloseTo(0.01 * 0.01, 6);
  });

  it('reaches the top 12.3% bracket above $742,953', () => {
    // Tax through bracket 8 (up to $742,953):
    // 1%:    11079 * 0.01     = 110.79
    // 2%:   (26264-11079)*.02 = 303.70
    // 4%:   (41452-26264)*.04 = 607.52
    // 6%:   (57542-41452)*.06 = 965.40
    // 8%:   (72724-57542)*.08 = 1214.56
    // 9.3%: (371479-72724)*.093 = 27784.215
    // 10.3%:(445771-371479)*.103 = 7652.076
    // 11.3%:(742953-445771)*.113 = 33581.566
    // Through bracket 8 ≈ 72219.83
    // 12.3%:(800000-742953)*.123 = 7016.78
    // Total ≈ 79236.61
    const result = calculateCaliforniaTax(800000);
    expect(result.baseTax).toBeCloseTo(79236.61, 0);
  });

  it('calculates tax at exactly $742,953 boundary (top of 11.3% bracket)', () => {
    // At the boundary, the 12.3% bracket should NOT be applied.
    // Through bracket 8 ≈ 72,219.83
    const result = calculateCaliforniaTax(742953);
    expect(result.baseTax).toBeCloseTo(72219.83, 0);
  });
});
