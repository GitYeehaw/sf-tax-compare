import { describe, it, expect } from 'vitest';
import { calculateQBIDeduction } from '../qbiDeduction.js';

// 2026: 20% rate, phase-out starts at $201,775, range $75,000, ends at $276,775
// OBBBA minimum: $400 if QBI >= $1,000

describe('calculateQBIDeduction', () => {
  it('returns 0 for zero QBI', () => {
    expect(calculateQBIDeduction(0, 100000)).toBe(0);
  });

  it('returns 0 for zero taxable income', () => {
    expect(calculateQBIDeduction(100000, 0)).toBe(0);
  });

  it('returns 0 for negative QBI', () => {
    expect(calculateQBIDeduction(-5000, 100000)).toBe(0);
  });

  it('returns full 20% below phase-out threshold', () => {
    const qbi = 150000;
    const taxableIncome = 150000; // below $201,775
    expect(calculateQBIDeduction(qbi, taxableIncome)).toBeCloseTo(30000, 2);
  });

  it('returns full 20% at exactly the phase-out start', () => {
    const qbi = 150000;
    expect(calculateQBIDeduction(qbi, 201775)).toBeCloseTo(30000, 2);
  });

  it('returns reduced deduction in phase-out range', () => {
    const qbi = 100000;
    // Midpoint of phase-out ($201,775 + $37,500 = $239,275)
    const taxableIncome = 239275;
    const fullDeduction = 20000; // 20% of $100K
    const reduction = (239275 - 201775) / 75000; // 50%
    const expected = fullDeduction * (1 - reduction);
    expect(calculateQBIDeduction(qbi, taxableIncome)).toBeCloseTo(expected, 2);
  });

  it('applies $400 minimum when QBI >= $1,000 and deduction phases below $400', () => {
    // At near end of phase-out, normal deduction would be very small
    // QBI = $5,000 -> full deduction = $1,000
    // At $274,775 taxable: reduction = (274775-201775)/75000 = 97.3%
    // Normal deduction = $1,000 * (1 - 0.973) = $27 -> should floor to $400
    expect(calculateQBIDeduction(5000, 274775)).toBeCloseTo(400, 2);
  });

  it('applies $400 minimum at phase-out end when QBI >= $1,000', () => {
    // At $276,775 normally would be $0, but minimum kicks in
    expect(calculateQBIDeduction(5000, 276775)).toBe(400);
  });

  it('does NOT apply minimum when QBI < $1,000', () => {
    // QBI = $500, even though deduction would be $0 at phase-out end
    expect(calculateQBIDeduction(500, 300000)).toBe(0);
  });

  it('returns 0 above phase-out end when QBI < $1,000', () => {
    expect(calculateQBIDeduction(500, 300000)).toBe(0);
  });

  it('applies $400 floor at low taxable income when 20% deduction is below $400', () => {
    // QBI = $1,000 → fullDeduction = $200, but floor raises it to $400
    expect(calculateQBIDeduction(1000, 50000)).toBe(400);
  });

  it('applies $400 floor exactly at the $1,000 QBI threshold', () => {
    // QBI = $1,000 (boundary), well above phase-out → deduction = 0, floor → $400
    expect(calculateQBIDeduction(1000, 300000)).toBe(400);
  });

  it('does NOT apply floor one dollar below QBI threshold', () => {
    // QBI = $999 → no floor
    expect(calculateQBIDeduction(999, 300000)).toBe(0);
  });

  it('returns 0 above phase-out end when QBI is exactly at $999 (one below threshold)', () => {
    expect(calculateQBIDeduction(999, 276775)).toBe(0);
  });

  it('returns full deduction (no floor) when 20% exceeds $400', () => {
    // QBI = $5,000 below phase-out → 20% = $1,000, no floor needed
    expect(calculateQBIDeduction(5000, 50000)).toBeCloseTo(1000, 2);
  });
});
