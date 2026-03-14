// 2026 Tax Data — sourced from IRS.gov and CA FTB
// Includes One Big Beautiful Bill Act provisions

export const FEDERAL_BRACKETS = [
  { min: 0, max: 12400, rate: 0.10 },
  { min: 12400, max: 50400, rate: 0.12 },
  { min: 50400, max: 105700, rate: 0.22 },
  { min: 105700, max: 201775, rate: 0.24 },
  { min: 201775, max: 256225, rate: 0.32 },
  { min: 256225, max: 640600, rate: 0.35 },
  { min: 640600, max: Infinity, rate: 0.37 },
];

export const FEDERAL_STANDARD_DEDUCTION = 16100;

export const CA_BRACKETS = [
  { min: 0, max: 11079, rate: 0.01 },
  { min: 11079, max: 26264, rate: 0.02 },
  { min: 26264, max: 41452, rate: 0.04 },
  { min: 41452, max: 57542, rate: 0.06 },
  { min: 57542, max: 72724, rate: 0.08 },
  { min: 72724, max: 371479, rate: 0.093 },
  { min: 371479, max: 445771, rate: 0.103 },
  { min: 445771, max: 742953, rate: 0.113 },
  { min: 742953, max: Infinity, rate: 0.123 },
];

export const CA_STANDARD_DEDUCTION = 5706;
export const CA_MENTAL_HEALTH_THRESHOLD = 1000000;
export const CA_MENTAL_HEALTH_RATE = 0.01;

export const SS_RATE = 0.124;
export const MEDICARE_RATE = 0.029;
export const SS_WAGE_BASE = 184500;
export const ADDITIONAL_MEDICARE_THRESHOLD = 200000;
export const ADDITIONAL_MEDICARE_RATE = 0.009;
export const SE_INCOME_FACTOR = 0.9235;

export const QBI_DEDUCTION_RATE = 0.20;
export const QBI_PHASE_OUT_START = 201775;
export const QBI_PHASE_OUT_RANGE = 75000; // Expanded by OBBBA from $50K to $75K for 2026
export const QBI_MINIMUM_DEDUCTION = 400; // New OBBBA minimum if QBI >= $1,000
export const QBI_MINIMUM_THRESHOLD = 1000; // Must have at least $1K QBI to get minimum

// Estimated quarterly payment due dates for tax year 2026
export const QUARTERLY_DUE_DATES = [
  { quarter: 'Q1', dueDate: 'April 15, 2026' },
  { quarter: 'Q2', dueDate: 'June 15, 2026' },
  { quarter: 'Q3', dueDate: 'September 15, 2026' },
  { quarter: 'Q4', dueDate: 'January 15, 2027' },
];
