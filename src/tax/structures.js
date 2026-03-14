import { FEDERAL_STANDARD_DEDUCTION, CA_STANDARD_DEDUCTION } from './constants.js';
import { calculateFederalIncomeTax } from './federalTax.js';
import { calculateCaliforniaTax } from './californiaTax.js';
import { calculateSelfEmploymentTax, calculatePayrollTax } from './selfEmploymentTax.js';
import { calculateQBIDeduction } from './qbiDeduction.js';
import { calculateQuarterlyPayments } from './quarterlyPayments.js';

export function calculateSoleProprietorship(grossIncome) {
  const seTax = calculateSelfEmploymentTax(grossIncome);

  const agi = grossIncome - seTax.deductibleHalf;

  const federalTaxableBeforeQBI = Math.max(0, agi - FEDERAL_STANDARD_DEDUCTION);
  const qbiDeduction = calculateQBIDeduction(grossIncome, federalTaxableBeforeQBI);
  const federalTaxableIncome = Math.max(0, federalTaxableBeforeQBI - qbiDeduction);

  const federalIncomeTax = calculateFederalIncomeTax(federalTaxableIncome);

  const caTaxableIncome = Math.max(0, agi - CA_STANDARD_DEDUCTION);
  const caTax = calculateCaliforniaTax(caTaxableIncome);

  const totalTax = seTax.total + federalIncomeTax + caTax.total;
  const takeHomePay = grossIncome - totalTax;

  const quarterlyPayments = calculateQuarterlyPayments(
    federalIncomeTax,
    seTax.total,
    caTax.total
  );

  return {
    label: 'Sole Proprietorship',
    grossIncome,
    agi,
    selfEmploymentTax: seTax.total,
    seTaxDeduction: seTax.deductibleHalf,
    qbiDeduction,
    federalStandardDeduction: FEDERAL_STANDARD_DEDUCTION,
    federalTaxableIncome,
    federalIncomeTax,
    caStandardDeduction: CA_STANDARD_DEDUCTION,
    caTaxableIncome,
    californiaIncomeTax: caTax.baseTax,
    californiaMentalHealthSurcharge: caTax.mentalHealthSurcharge,
    californiaTotal: caTax.total,
    adminCosts: 0,
    payrollTax: 0,
    totalTax,
    takeHomePay,
    effectiveRate: grossIncome > 0 ? totalTax / grossIncome : 0,
    quarterlyPayments,
  };
}

export function calculateLLC(grossIncome) {
  const result = calculateSoleProprietorship(grossIncome);
  return { ...result, label: 'LLC (Single-Member)' };
}

export function calculateSCorp(grossIncome, salaryPercent = 60, adminCost = 2000) {
  const salary = Math.min(grossIncome * (salaryPercent / 100), Math.max(0, grossIncome - adminCost));

  const payroll = calculatePayrollTax(salary);

  // Employer payroll tax + admin are business expenses
  const businessExpenses = payroll.employerTotal + adminCost;
  const distribution = Math.max(0, grossIncome - salary - businessExpenses);

  // Personal income = salary + distribution
  const personalIncome = salary + distribution;
  const agi = personalIncome;

  const federalTaxableBeforeQBI = Math.max(0, agi - FEDERAL_STANDARD_DEDUCTION);
  // QBI applies to distribution portion only
  const qbiDeduction = calculateQBIDeduction(distribution, federalTaxableBeforeQBI);
  const federalTaxableIncome = Math.max(0, federalTaxableBeforeQBI - qbiDeduction);

  const federalIncomeTax = calculateFederalIncomeTax(federalTaxableIncome);

  const caTaxableIncome = Math.max(0, agi - CA_STANDARD_DEDUCTION);
  const caTax = calculateCaliforniaTax(caTaxableIncome);

  // Total tax includes both employer and employee payroll, income taxes, and admin
  const totalTax = payroll.total + federalIncomeTax + caTax.total + adminCost;
  const takeHomePay = grossIncome - totalTax;

  const quarterlyPayments = calculateQuarterlyPayments(
    federalIncomeTax,
    payroll.total,
    caTax.total
  );

  return {
    label: 'S-Corporation',
    grossIncome,
    salary,
    distribution,
    agi,
    selfEmploymentTax: 0,
    payrollTax: payroll.total,
    payrollEmployer: payroll.employerTotal,
    payrollEmployee: payroll.employeeTotal,
    seTaxDeduction: 0,
    qbiDeduction,
    federalStandardDeduction: FEDERAL_STANDARD_DEDUCTION,
    federalTaxableIncome,
    federalIncomeTax,
    caStandardDeduction: CA_STANDARD_DEDUCTION,
    caTaxableIncome,
    californiaIncomeTax: caTax.baseTax,
    californiaMentalHealthSurcharge: caTax.mentalHealthSurcharge,
    californiaTotal: caTax.total,
    adminCosts: adminCost,
    totalTax,
    takeHomePay,
    effectiveRate: grossIncome > 0 ? totalTax / grossIncome : 0,
    quarterlyPayments,
  };
}
