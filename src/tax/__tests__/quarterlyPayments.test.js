import { describe, it, expect } from 'vitest';
import { calculateQuarterlyPayments } from '../quarterlyPayments.js';
import { QUARTERLY_DUE_DATES } from '../constants.js';

describe('calculateQuarterlyPayments', () => {
  it('returns 4 quarters', () => {
    const result = calculateQuarterlyPayments(40000, 20000, 8000);
    expect(result).toHaveLength(4);
  });

  it('preserves quarter labels and due dates from constants', () => {
    const result = calculateQuarterlyPayments(40000, 20000, 8000);
    result.forEach((q, i) => {
      expect(q.quarter).toBe(QUARTERLY_DUE_DATES[i].quarter);
      expect(q.dueDate).toBe(QUARTERLY_DUE_DATES[i].dueDate);
    });
  });

  it('combines federal income tax and SE tax into a single quarterly federal payment', () => {
    const federalTax = 40000;
    const seTax = 20000;
    const caTax = 8000;
    const result = calculateQuarterlyPayments(federalTax, seTax, caTax);
    expect(result[0].federal).toBeCloseTo((federalTax + seTax) / 4, 2);
  });

  it('divides California tax evenly across 4 quarters', () => {
    const result = calculateQuarterlyPayments(0, 0, 8000);
    expect(result[0].california).toBeCloseTo(2000, 2);
  });

  it('total equals federal + california per quarter', () => {
    const result = calculateQuarterlyPayments(40000, 20000, 8000);
    result.forEach((q) => {
      expect(q.total).toBeCloseTo(q.federal + q.california, 2);
    });
  });

  it('sum of all quarter totals equals federal + SE + CA', () => {
    const federalTax = 40000;
    const seTax = 20000;
    const caTax = 8000;
    const result = calculateQuarterlyPayments(federalTax, seTax, caTax);
    const annualSum = result.reduce((s, q) => s + q.total, 0);
    expect(annualSum).toBeCloseTo(federalTax + seTax + caTax, 2);
  });

  it('returns four zero quarters for zero inputs', () => {
    const result = calculateQuarterlyPayments(0, 0, 0);
    expect(result).toHaveLength(4);
    result.forEach((q) => {
      expect(q.federal).toBe(0);
      expect(q.california).toBe(0);
      expect(q.total).toBe(0);
    });
  });

  it('produces equal payments across all four quarters', () => {
    const result = calculateQuarterlyPayments(40000, 20000, 8000);
    const first = result[0];
    result.forEach((q) => {
      expect(q.federal).toBeCloseTo(first.federal, 2);
      expect(q.california).toBeCloseTo(first.california, 2);
      expect(q.total).toBeCloseTo(first.total, 2);
    });
  });
});
