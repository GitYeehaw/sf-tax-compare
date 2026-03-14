import { describe, it, expect } from 'vitest';
import { calculateSelfEmploymentTax, calculatePayrollTax } from '../selfEmploymentTax.js';

describe('calculateSelfEmploymentTax', () => {
  it('returns zeros for zero earnings', () => {
    const result = calculateSelfEmploymentTax(0);
    expect(result.total).toBe(0);
    expect(result.deductibleHalf).toBe(0);
  });

  it('returns zeros for negative earnings', () => {
    const result = calculateSelfEmploymentTax(-1000);
    expect(result.total).toBe(0);
  });

  it('calculates SE tax below SS wage base', () => {
    const income = 100000;
    const seBase = income * 0.9235; // $92,350
    const result = calculateSelfEmploymentTax(income);

    expect(result.seBase).toBeCloseTo(seBase, 2);
    expect(result.socialSecurity).toBeCloseTo(seBase * 0.124, 2);
    expect(result.medicare).toBeCloseTo(seBase * 0.029, 2);
    expect(result.additionalMedicare).toBe(0);
    expect(result.deductibleHalf).toBeCloseTo(result.total / 2, 2);
  });

  it('caps Social Security at wage base', () => {
    const income = 250000;
    const seBase = income * 0.9235; // $230,875
    const result = calculateSelfEmploymentTax(income);

    // SS should cap at 2026 wage base ($184,500)
    expect(result.socialSecurity).toBeCloseTo(184500 * 0.124, 2);
    // Medicare on full amount
    expect(result.medicare).toBeCloseTo(seBase * 0.029, 2);
  });

  it('applies additional Medicare above $200K threshold', () => {
    const income = 300000;
    const seBase = income * 0.9235; // $277,050
    const result = calculateSelfEmploymentTax(income);

    expect(result.additionalMedicare).toBeCloseTo((seBase - 200000) * 0.009, 2);
  });

  it('does not apply additional Medicare below $200K SE base', () => {
    const income = 200000;
    const seBase = income * 0.9235; // $184,700
    const result = calculateSelfEmploymentTax(income);

    // SE base is $184,700, below $200K threshold
    expect(result.additionalMedicare).toBe(0);
  });

  it('deductible half is exactly 50% of total', () => {
    const result = calculateSelfEmploymentTax(150000);
    expect(result.deductibleHalf).toBeCloseTo(result.total / 2, 2);
  });
});

describe('calculatePayrollTax', () => {
  it('returns zeros for zero salary', () => {
    const result = calculatePayrollTax(0);
    expect(result.total).toBe(0);
  });

  it('splits employer and employee evenly for SS and Medicare', () => {
    const result = calculatePayrollTax(100000);
    expect(result.employerSS).toBeCloseTo(result.employeeSS, 2);
    expect(result.employerMedicare).toBeCloseTo(result.employeeMedicare, 2);
  });

  it('caps SS at wage base for both employer and employee', () => {
    const result = calculatePayrollTax(250000);
    expect(result.employerSS).toBeCloseTo(184500 * 0.062, 2);
    expect(result.employeeSS).toBeCloseTo(184500 * 0.062, 2);
  });

  it('applies additional Medicare only to employee above $200K', () => {
    const result = calculatePayrollTax(250000);
    expect(result.additionalMedicare).toBeCloseTo(50000 * 0.009, 2);
  });

  it('total equals employer + employee totals', () => {
    const result = calculatePayrollTax(150000);
    expect(result.total).toBeCloseTo(result.employerTotal + result.employeeTotal, 2);
  });
});
