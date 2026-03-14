import { FEDERAL_BRACKETS } from './constants.js';

export function calculateFederalIncomeTax(taxableIncome) {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  for (const bracket of FEDERAL_BRACKETS) {
    if (taxableIncome <= bracket.min) break;
    const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}
