import { FEDERAL_STANDARD_DEDUCTION, CA_STANDARD_DEDUCTION, SECTION_179_LIMIT } from './constants.js';
import { calculateFederalIncomeTax } from './federalTax.js';
import { calculateCaliforniaTax } from './californiaTax.js';
import { calculateSelfEmploymentTax, calculatePayrollTax } from './selfEmploymentTax.js';
import { calculateQBIDeduction } from './qbiDeduction.js';
import { calculateQuarterlyPayments } from './quarterlyPayments.js';

function applySection179(grossIncome, section179Input) {
  // Section 179 can't exceed the limit or create a loss
  const capped = Math.min(section179Input, SECTION_179_LIMIT, grossIncome);
  return Math.max(0, capped);
}

export function calculateSoleProprietorship(grossIncome, section179Input = 0) {
  const section179 = applySection179(grossIncome, section179Input);
  const businessIncome = grossIncome - section179;

  const seTax = calculateSelfEmploymentTax(businessIncome);

  const agi = businessIncome - seTax.deductibleHalf;

  const federalTaxableBeforeQBI = Math.max(0, agi - FEDERAL_STANDARD_DEDUCTION);
  const qbiDeduction = calculateQBIDeduction(businessIncome, federalTaxableBeforeQBI);
  const federalTaxableIncome = Math.max(0, federalTaxableBeforeQBI - qbiDeduction);

  const federalIncomeTax = calculateFederalIncomeTax(federalTaxableIncome);

  const caTaxableIncome = Math.max(0, agi - CA_STANDARD_DEDUCTION);
  const caTax = calculateCaliforniaTax(caTaxableIncome);

  const totalTax = seTax.total + federalIncomeTax + caTax.total;
  const takeHomePay = grossIncome - section179 - totalTax;

  const quarterlyPayments = calculateQuarterlyPayments(
    federalIncomeTax,
    seTax.total,
    caTax.total
  );

  return {
    label: 'Sole Proprietorship',
    grossIncome,
    section179,
    businessIncome,
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

export function calculateLLC(grossIncome, section179Input = 0) {
  const result = calculateSoleProprietorship(grossIncome, section179Input);
  return { ...result, label: 'LLC (Single-Member)' };
}

export function calculateW2Employee(grossIncome) {
  const payroll = calculatePayrollTax(grossIncome);

  // W-2 employee: AGI = gross income (no SE deduction)
  const agi = grossIncome;

  const federalTaxableIncome = Math.max(0, agi - FEDERAL_STANDARD_DEDUCTION);
  const federalIncomeTax = calculateFederalIncomeTax(federalTaxableIncome);

  const caTaxableIncome = Math.max(0, agi - CA_STANDARD_DEDUCTION);
  const caTax = calculateCaliforniaTax(caTaxableIncome);

  // Employee pays only their half of FICA + income taxes
  const totalTax = payroll.employeeTotal + federalIncomeTax + caTax.total;
  const takeHomePay = grossIncome - totalTax;

  return {
    label: 'W-2 Employee',
    grossIncome,
    section179: 0,
    businessIncome: grossIncome,
    agi,
    selfEmploymentTax: 0,
    seTaxDeduction: 0,
    qbiDeduction: 0,
    payrollTax: payroll.employeeTotal,
    federalStandardDeduction: FEDERAL_STANDARD_DEDUCTION,
    federalTaxableIncome,
    federalIncomeTax,
    caStandardDeduction: CA_STANDARD_DEDUCTION,
    caTaxableIncome,
    californiaIncomeTax: caTax.baseTax,
    californiaMentalHealthSurcharge: caTax.mentalHealthSurcharge,
    californiaTotal: caTax.total,
    adminCosts: 0,
    totalTax,
    takeHomePay,
    effectiveRate: grossIncome > 0 ? totalTax / grossIncome : 0,
    quarterlyPayments: null,
  };
}

export function calculateSCorp(grossIncome, salaryPercent = 60, adminCost = 2000, section179Input = 0) {
  const section179 = applySection179(grossIncome, section179Input);
  const businessIncome = grossIncome - section179;

  const salary = Math.min(businessIncome * (salaryPercent / 100), Math.max(0, businessIncome - adminCost));

  const payroll = calculatePayrollTax(salary);

  // Employer payroll tax + admin are business expenses
  const businessExpenses = payroll.employerTotal + adminCost;
  const distribution = Math.max(0, businessIncome - salary - businessExpenses);

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
  const takeHomePay = grossIncome - section179 - totalTax;

  const quarterlyPayments = calculateQuarterlyPayments(
    federalIncomeTax,
    payroll.total,
    caTax.total
  );

  return {
    label: 'S-Corporation',
    grossIncome,
    section179,
    businessIncome,
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
