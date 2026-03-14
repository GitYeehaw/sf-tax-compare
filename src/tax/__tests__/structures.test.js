import { describe, it, expect } from 'vitest';
import { calculateSoleProprietorship, calculateLLC, calculateSCorp } from '../structures.js';

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
