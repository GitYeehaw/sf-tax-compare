import { calculateSoleProprietorship, calculateLLC, calculateSCorp, calculateW2Employee } from './structures.js';

export function calculateAll({ hourlyRate, hoursPerWeek, weeksPerYear, sCorpSalaryPercent, sCorpAdminCost, section179 = 0 }) {
  const grossIncome = hourlyRate * hoursPerWeek * weeksPerYear;

  if (grossIncome <= 0) {
    return { grossIncome: 0, results: [] };
  }

  return {
    grossIncome,
    results: [
      calculateSoleProprietorship(grossIncome, section179),
      calculateLLC(grossIncome, section179),
      calculateSCorp(grossIncome, sCorpSalaryPercent, sCorpAdminCost, section179),
      calculateW2Employee(grossIncome),
    ],
  };
}
