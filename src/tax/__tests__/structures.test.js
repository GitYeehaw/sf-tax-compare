import { describe, it, expect } from 'vitest';
import { calculateSoleProprietorship, calculateLLC, calculateSCorp, calculateW2Employee } from '../structures.js';

describe('calculateSoleProprietorship', () => {
  it('returns correct structure for $100K income', () => {
    const result = calculateSoleProprietorship(100000);
    expect(result.grossIncome).toBe(100000);
    expect(result.selfEmploymentTax).toBeGreaterThan(0);
    expect(result.federalIncomeTax).toBeGreaterThan(0);
    expect(result.californiaTotal).toBeGreaterThan(0);
    expect(result.totalTax).toBeGreaterThan(0);
    expect(result.takeHomePay).toBeLessThan(100000);
    expect(result.takeHomePay).toBeGreaterThan(0);
    expect(result.effectiveRate).toBeGreaterThan(0);
    expect(result.effectiveRate).toBeLessThan(1);
  });

  it('includes quarterly payments', () => {
    const result = calculateSoleProprietorship(100000);
    expect(result.quarterlyPayments).toHaveLength(4);
    const totalQuarterly = result.quarterlyPayments.reduce((sum, q) => sum + q.total, 0);
    expect(totalQuarterly).toBeCloseTo(
      result.federalIncomeTax + result.selfEmploymentTax + result.californiaTotal,
      0
    );
  });

  it('handles zero income', () => {
    const result = calculateSoleProprietorship(0);
    expect(result.totalTax).toBe(0);
    expect(result.takeHomePay).toBe(0);
  });
});

describe('calculateLLC', () => {
  it('produces identical numbers to sole proprietorship', () => {
    const soleProp = calculateSoleProprietorship(200000);
    const llc = calculateLLC(200000);

    expect(llc.selfEmploymentTax).toBe(soleProp.selfEmploymentTax);
    expect(llc.federalIncomeTax).toBe(soleProp.federalIncomeTax);
    expect(llc.californiaTotal).toBe(soleProp.californiaTotal);
    expect(llc.totalTax).toBe(soleProp.totalTax);
    expect(llc.takeHomePay).toBe(soleProp.takeHomePay);
  });

  it('has different label than sole proprietorship', () => {
    const llc = calculateLLC(100000);
    expect(llc.label).toBe('LLC (Single-Member)');
  });
});

describe('calculateSCorp', () => {
  it('has lower total tax than sole prop at $300K (high income shows savings)', () => {
    const soleProp = calculateSoleProprietorship(300000);
    const sCorp = calculateSCorp(300000, 60, 2000);
    expect(sCorp.totalTax).toBeLessThan(soleProp.totalTax);
  });

  it('admin costs can offset savings at moderate income ($200K)', () => {
    // At $200K with $2K admin, S-Corp may not save vs sole prop
    const soleProp = calculateSoleProprietorship(200000);
    const sCorp = calculateSCorp(200000, 60, 2000);
    // Difference should be small either way
    expect(Math.abs(sCorp.totalTax - soleProp.totalTax)).toBeLessThan(5000);
  });

  it('salary + distribution + expenses equals gross income', () => {
    const result = calculateSCorp(200000, 60, 2000);
    const reconstructed = result.salary + result.distribution + result.payrollEmployer + result.adminCosts;
    expect(reconstructed).toBeCloseTo(200000, 0);
  });

  it('higher salary % means higher payroll tax', () => {
    const low = calculateSCorp(200000, 40, 2000);
    const high = calculateSCorp(200000, 80, 2000);
    expect(high.payrollTax).toBeGreaterThan(low.payrollTax);
  });

  it('includes quarterly payments', () => {
    const result = calculateSCorp(200000, 60, 2000);
    expect(result.quarterlyPayments).toHaveLength(4);
  });

  it('has zero self-employment tax', () => {
    const result = calculateSCorp(200000, 60, 2000);
    expect(result.selfEmploymentTax).toBe(0);
  });

  it('clamps salary when it would exceed gross - admin', () => {
    const result = calculateSCorp(3000, 90, 2000);
    expect(result.salary).toBeLessThanOrEqual(result.grossIncome - result.adminCosts);
  });
});

describe('calculateW2Employee', () => {
  it('returns correct structure for $100K income', () => {
    const result = calculateW2Employee(100000);
    expect(result.label).toBe('W-2 Employee');
    expect(result.grossIncome).toBe(100000);
    expect(result.agi).toBe(100000);
    expect(result.federalIncomeTax).toBeGreaterThan(0);
    expect(result.californiaTotal).toBeGreaterThan(0);
    expect(result.totalTax).toBeGreaterThan(0);
    expect(result.takeHomePay).toBeLessThan(100000);
    expect(result.takeHomePay).toBeGreaterThan(0);
  });

  it('has employee FICA but no self-employment tax', () => {
    const result = calculateW2Employee(100000);
    expect(result.selfEmploymentTax).toBe(0);
    expect(result.payrollTax).toBeGreaterThan(0);
    // Employee SS: 6.2% of $100K = $6,200, Medicare: 1.45% of $100K = $1,450
    expect(result.payrollTax).toBeCloseTo(6200 + 1450, 0);
  });

  it('has no QBI deduction', () => {
    const result = calculateW2Employee(200000);
    expect(result.qbiDeduction).toBe(0);
  });

  it('has no SE tax deduction', () => {
    const result = calculateW2Employee(200000);
    expect(result.seTaxDeduction).toBe(0);
  });

  it('has no quarterly payments', () => {
    const result = calculateW2Employee(100000);
    expect(result.quarterlyPayments).toBeNull();
  });

  it('pays less FICA than sole prop SE tax', () => {
    const result = calculateW2Employee(200000);
    const soleProp = calculateSoleProprietorship(200000);
    // Employee-only FICA is roughly half of full SE tax
    expect(result.payrollTax).toBeLessThan(soleProp.selfEmploymentTax);
  });

  it('handles zero income', () => {
    const result = calculateW2Employee(0);
    expect(result.totalTax).toBe(0);
    expect(result.takeHomePay).toBe(0);
  });

  it('applies additional Medicare tax over $200K', () => {
    const result = calculateW2Employee(300000);
    // Additional Medicare: 0.9% on $100K over threshold = $900
    const expectedAdditionalMedicare = (300000 - 200000) * 0.009;
    const baseFica = Math.min(300000, 184500) * 0.062 + 300000 * 0.0145;
    expect(result.payrollTax).toBeCloseTo(baseFica + expectedAdditionalMedicare, 0);
  });
});
