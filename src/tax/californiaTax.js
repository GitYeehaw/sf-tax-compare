import {
  CA_BRACKETS,
  CA_MENTAL_HEALTH_THRESHOLD,
  CA_MENTAL_HEALTH_RATE,
} from './constants.js';

export function calculateCaliforniaTax(taxableIncome) {
  if (taxableIncome <= 0) {
    return { baseTax: 0, mentalHealthSurcharge: 0, total: 0 };
  }

  let baseTax = 0;
  for (const bracket of CA_BRACKETS) {
    if (taxableIncome <= bracket.min) break;
    const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    baseTax += taxableInBracket * bracket.rate;
  }

  const mentalHealthSurcharge =
    taxableIncome > CA_MENTAL_HEALTH_THRESHOLD
      ? (taxableIncome - CA_MENTAL_HEALTH_THRESHOLD) * CA_MENTAL_HEALTH_RATE
      : 0;

  return {
    baseTax,
    mentalHealthSurcharge,
    total: baseTax + mentalHealthSurcharge,
  };
}
