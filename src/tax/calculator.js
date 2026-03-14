import { calculateSoleProprietorship, calculateLLC, calculateSCorp } from './structures.js';

export function calculateAll({ hourlyRate, hoursPerWeek, weeksPerYear, sCorpSalaryPercent, sCorpAdminCost }) {
  const grossIncome = hourlyRate * hoursPerWeek * weeksPerYear;

  if (grossIncome <= 0) {
    return { grossIncome: 0, results: [] };
  }

  return {
    grossIncome,
    results: [
      calculateSoleProprietorship(grossIncome),
      calculateLLC(grossIncome),
      calculateSCorp(grossIncome, sCorpSalaryPercent, sCorpAdminCost),
    ],
  };
}
