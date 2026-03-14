import {
  SS_RATE,
  MEDICARE_RATE,
  SS_WAGE_BASE,
  ADDITIONAL_MEDICARE_THRESHOLD,
  ADDITIONAL_MEDICARE_RATE,
  SE_INCOME_FACTOR,
} from './constants.js';

export function calculateSelfEmploymentTax(netEarnings) {
  if (netEarnings <= 0) {
    return { seBase: 0, socialSecurity: 0, medicare: 0, additionalMedicare: 0, total: 0, deductibleHalf: 0 };
  }

  const seBase = netEarnings * SE_INCOME_FACTOR;

  const socialSecurity = Math.min(seBase, SS_WAGE_BASE) * SS_RATE;
  const medicare = seBase * MEDICARE_RATE;
  const additionalMedicare =
    seBase > ADDITIONAL_MEDICARE_THRESHOLD
      ? (seBase - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE
      : 0;

  const total = socialSecurity + medicare + additionalMedicare;
  const deductibleHalf = total * 0.5;

  return { seBase, socialSecurity, medicare, additionalMedicare, total, deductibleHalf };
}

export function calculatePayrollTax(salary) {
  if (salary <= 0) {
    return { employerSS: 0, employerMedicare: 0, employeeSS: 0, employeeMedicare: 0, additionalMedicare: 0, employerTotal: 0, employeeTotal: 0, total: 0 };
  }

  const employerSS = Math.min(salary, SS_WAGE_BASE) * (SS_RATE / 2);
  const employerMedicare = salary * (MEDICARE_RATE / 2);
  const employeeSS = Math.min(salary, SS_WAGE_BASE) * (SS_RATE / 2);
  const employeeMedicare = salary * (MEDICARE_RATE / 2);
  const additionalMedicare =
    salary > ADDITIONAL_MEDICARE_THRESHOLD
      ? (salary - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE
      : 0;

  const employerTotal = employerSS + employerMedicare;
  const employeeTotal = employeeSS + employeeMedicare + additionalMedicare;
  const total = employerTotal + employeeTotal;

  return { employerSS, employerMedicare, employeeSS, employeeMedicare, additionalMedicare, employerTotal, employeeTotal, total };
}
