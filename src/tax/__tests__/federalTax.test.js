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
});
