import { QUARTERLY_DUE_DATES } from './constants.js';

export function calculateQuarterlyPayments(federalTax, seTax, californiaTax) {
  const totalFederalAndSE = federalTax + seTax;
  const quarterlyFederal = totalFederalAndSE / 4;
  const quarterlyCalifornia = californiaTax / 4;

  return QUARTERLY_DUE_DATES.map((q) => ({
    ...q,
    federal: quarterlyFederal,
    california: quarterlyCalifornia,
    total: quarterlyFederal + quarterlyCalifornia,
  }));
}
