import { describe, it, expect } from 'vitest';
import { calculateFederalIncomeTax } from '../federalTax.js';

// 2026 brackets: 10% (0-12400), 12% (12400-50400), 22% (50400-105700),
// 24% (105700-201775), 32% (201775-256225), 35% (256225-640600), 37% (640600+)

describe('calculateFederalIncomeTax', () => {
  it('returns 0 for zero income', () => {
    expect(calculateFederalIncomeTax(0)).toBe(0);
  });

  it('returns 0 for negative income', () => {
    expect(calculateFederalIncomeTax(-5000)).toBe(0);
  });

  it('calculates tax in 10% bracket only', () => {
    // $10,000 * 10% = $1,000
    expect(calculateFederalIncomeTax(10000)).toBeCloseTo(1000, 2);
  });

  it('calculates tax at first bracket boundary ($12,400)', () => {
    // $12,400 * 10% = $1,240
    expect(calculateFederalIncomeTax(12400)).toBeCloseTo(1240, 2);
  });

  it('calculates tax spanning 10% and 12% brackets', () => {
    // $30,000: $12,400 * 10% + ($30,000 - $12,400) * 12%
    // = $1,240 + $17,600 * 12% = $1,240 + $2,112 = $3,352
    expect(calculateFederalIncomeTax(30000)).toBeCloseTo(3352, 2);
  });

  it('calculates tax at second bracket boundary ($50,400)', () => {
    // $12,400 * 10% + ($50,400 - $12,400) * 12%
    // = $1,240 + $38,000 * 12% = $1,240 + $4,560 = $5,800
    expect(calculateFederalIncomeTax(50400)).toBeCloseTo(5800, 2);
  });

  it('calculates tax at $100,000 (spans 10%, 12%, 22%)', () => {
    // 10%: $12,400 * 0.10 = $1,240
    // 12%: ($50,400 - $12,400) * 0.12 = $4,560
    // 22%: ($100,000 - $50,400) * 0.22 = $10,912
    // Total = $16,712
    expect(calculateFederalIncomeTax(100000)).toBeCloseTo(16712, 2);
  });

  it('calculates tax at $250,000 (spans through 32%)', () => {
    // 10%: $1,240
    // 12%: $4,560
    // 22%: ($105,700 - $50,400) * 0.22 = $12,166
    // 24%: ($201,775 - $105,700) * 0.24 = $23,058
    // 32%: ($250,000 - $201,775) * 0.32 = $15,432
    // Total = $56,456
    expect(calculateFederalIncomeTax(250000)).toBeCloseTo(56456, 2);
  });

  it('calculates tax above $640,600 (37% bracket)', () => {
    const tax = calculateFederalIncomeTax(700000);
    expect(tax).toBeGreaterThan(0);
    // 10%: $1,240
    // 12%: $4,560
    // 22%: $12,166
    // 24%: $23,058
    // 32%: ($256,225 - $201,775) * 0.32 = $17,424
    // 35%: ($640,600 - $256,225) * 0.35 = $134,531.25
    // 37%: ($700,000 - $640,600) * 0.37 = $21,978
    // Total = $214,957.25
    expect(tax).toBeCloseTo(214957.25, 0);
  });

  // Boundary tests: at exactly bracket.min, the higher bracket should NOT be applied
  // (loop breaks via `taxableIncome <= bracket.min`).
  it('calculates tax at exactly $105,700 boundary (top of 22% bracket)', () => {
    // 10%: $1,240
    // 12%: $4,560
    // 22%: ($105,700 - $50,400) * 0.22 = $12,166
    // Total = $17,966
    expect(calculateFederalIncomeTax(105700)).toBeCloseTo(17966, 2);
  });

  it('calculates tax at exactly $201,775 boundary (top of 24% bracket)', () => {
    // Through 22%: $17,966
    // 24%: ($201,775 - $105,700) * 0.24 = $23,058
    // Total = $41,024
    expect(calculateFederalIncomeTax(201775)).toBeCloseTo(41024, 2);
  });

  it('calculates tax at exactly $256,225 boundary (top of 32% bracket)', () => {
    // Through 24%: $41,024
    // 32%: ($256,225 - $201,775) * 0.32 = $17,424
    // Total = $58,448
    expect(calculateFederalIncomeTax(256225)).toBeCloseTo(58448, 2);
  });

  it('calculates tax at exactly $640,600 boundary (top of 35% bracket)', () => {
    // Through 32%: $58,448
    // 35%: ($640,600 - $256,225) * 0.35 = $134,531.25
    // Total = $192,979.25
    expect(calculateFederalIncomeTax(640600)).toBeCloseTo(192979.25, 2);
  });

  it('one cent above a boundary uses the higher bracket', () => {
    // At $105,700.01 we cross into the 24% bracket for one cent
    const atBoundary = calculateFederalIncomeTax(105700);
    const justAbove = calculateFederalIncomeTax(105700.01);
    expect(justAbove - atBoundary).toBeCloseTo(0.01 * 0.24, 4);
  });
});
