import {
  QBI_DEDUCTION_RATE,
  QBI_PHASE_OUT_START,
  QBI_PHASE_OUT_RANGE,
  QBI_MINIMUM_DEDUCTION,
  QBI_MINIMUM_THRESHOLD,
} from './constants.js';

export function calculateQBIDeduction(qualifiedBusinessIncome, taxableIncomeBeforeQBI) {
  if (qualifiedBusinessIncome <= 0 || taxableIncomeBeforeQBI <= 0) return 0;

  const fullDeduction = qualifiedBusinessIncome * QBI_DEDUCTION_RATE;

  let deduction;
  if (taxableIncomeBeforeQBI <= QBI_PHASE_OUT_START) {
    deduction = fullDeduction;
  } else {
    const phaseOutEnd = QBI_PHASE_OUT_START + QBI_PHASE_OUT_RANGE;
    if (taxableIncomeBeforeQBI >= phaseOutEnd) {
      deduction = 0;
    } else {
      // Linear phase-out
      const excessIncome = taxableIncomeBeforeQBI - QBI_PHASE_OUT_START;
      const reductionFactor = excessIncome / QBI_PHASE_OUT_RANGE;
      deduction = fullDeduction * (1 - reductionFactor);
    }
  }

  // OBBBA minimum: $400 if QBI >= $1,000 (materially participating)
  if (qualifiedBusinessIncome >= QBI_MINIMUM_THRESHOLD && deduction < QBI_MINIMUM_DEDUCTION) {
    deduction = QBI_MINIMUM_DEDUCTION;
  }

  return deduction;
}
