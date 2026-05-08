import { describe, it, expect } from 'vitest';
import { calculateAll } from '../calculator.js';

describe('calculateAll', () => {
  it('calculates gross income from inputs', () => {
    const result = calculateAll({
      hourlyRate: 150,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      sCorpSalaryPercent: 60,
      sCorpAdminCost: 2000,
    });
    expect(result.grossIncome).toBe(312000);
  });

  it('returns 4 entity results', () => {
    const result = calculateAll({
      hourlyRate: 150,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      sCorpSalaryPercent: 60,
      sCorpAdminCost: 2000,
    });
    expect(result.results).toHaveLength(4);
    expect(result.results[0].label).toBe('Sole Proprietorship');
    expect(result.results[1].label).toBe('LLC (Single-Member)');
    expect(result.results[2].label).toBe('S-Corporation');
    expect(result.results[3].label).toBe('W-2 Employee');
  });

  it('sole prop and LLC have identical totals', () => {
    const result = calculateAll({
      hourlyRate: 150,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      sCorpSalaryPercent: 60,
      sCorpAdminCost: 2000,
    });
    expect(result.results[0].totalTax).toBe(result.results[1].totalTax);
    expect(result.results[0].takeHomePay).toBe(result.results[1].takeHomePay);
  });

  it('S-Corp has lower tax than sole prop at $312K', () => {
    const result = calculateAll({
      hourlyRate: 150,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      sCorpSalaryPercent: 60,
      sCorpAdminCost: 2000,
    });
    expect(result.results[2].totalTax).toBeLessThan(result.results[0].totalTax);
  });

  it('returns empty results for zero rate', () => {
    const result = calculateAll({
      hourlyRate: 0,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      sCorpSalaryPercent: 60,
      sCorpAdminCost: 2000,
    });
    expect(result.grossIncome).toBe(0);
    expect(result.results).toHaveLength(0);
  });

  it('threads Section 179 through to all self-employed entities, ignoring W-2', () => {
    const result = calculateAll({
      hourlyRate: 150,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      sCorpSalaryPercent: 60,
      sCorpAdminCost: 2000,
      section179: 50000,
    });
    const [soleProp, llc, sCorp, w2] = result.results;
    expect(soleProp.section179).toBe(50000);
    expect(llc.section179).toBe(50000);
    expect(sCorp.section179).toBe(50000);
    expect(w2.section179).toBe(0);
  });

  it('Section 179 reduces total tax for self-employed entities', () => {
    const inputs = {
      hourlyRate: 150,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      sCorpSalaryPercent: 60,
      sCorpAdminCost: 2000,
    };
    const without = calculateAll(inputs);
    const withDeduction = calculateAll({ ...inputs, section179: 30000 });
    expect(withDeduction.results[0].totalTax).toBeLessThan(without.results[0].totalTax);
    expect(withDeduction.results[2].totalTax).toBeLessThan(without.results[2].totalTax);
    // W-2 unaffected
    expect(withDeduction.results[3].totalTax).toBe(without.results[3].totalTax);
  });

  it('defaults section179 to 0 when omitted', () => {
    const result = calculateAll({
      hourlyRate: 100,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      sCorpSalaryPercent: 60,
      sCorpAdminCost: 2000,
    });
    expect(result.results[0].section179).toBe(0);
  });

  it('every result has all required fields', () => {
    const result = calculateAll({
      hourlyRate: 75,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      sCorpSalaryPercent: 60,
      sCorpAdminCost: 2000,
    });

    const requiredFields = [
      'label', 'grossIncome', 'selfEmploymentTax', 'federalIncomeTax',
      'californiaTotal', 'totalTax', 'takeHomePay', 'effectiveRate',
      'quarterlyPayments', 'qbiDeduction', 'federalStandardDeduction',
      'caStandardDeduction',
    ];

    for (const entity of result.results) {
      for (const field of requiredFields) {
        expect(entity).toHaveProperty(field);
      }
    }
  });
});
