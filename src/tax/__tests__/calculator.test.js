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
