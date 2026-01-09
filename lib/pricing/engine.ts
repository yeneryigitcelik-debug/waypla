/**
 * Pricing Engine for Device Insurance
 * Deterministic premium calculation based on device and coverage
 */

export interface PricingInput {
  declaredValue: number; // Device value in TRY
  deviceCategory: string; // phone, laptop, tablet, etc.
  purchaseAgeMonths: number; // Age of device in months
  coverageType: "EXTENDED_WARRANTY" | "ACCIDENTAL_DAMAGE" | "FULL_COVERAGE" | "THEFT_LOSS";
  termYears?: number; // For one-time payments: 1, 2, or 3
}

export interface PricingOutput {
  annualPremium: number;
  monthlyPremium: number;
  deductible: {
    type: "percentage" | "fixed";
    value: number;
  };
  limits: {
    maxClaims: number;
    maxAmount: number;
  };
  discounts?: {
    termYears?: number;
    discountPercent?: number;
  };
}

// Risk multipliers by device category
const categoryMultipliers: Record<string, number> = {
  phone: 1.0,
  smartphone: 1.0,
  laptop: 0.8,
  tablet: 0.9,
  watch: 1.2,
  headphones: 1.1,
  camera: 0.9,
  default: 1.0,
};

// Coverage type multipliers
const coverageMultipliers: Record<string, number> = {
  EXTENDED_WARRANTY: 0.6,
  ACCIDENTAL_DAMAGE: 0.8,
  FULL_COVERAGE: 1.0,
  THEFT_LOSS: 1.2,
};

// Age depreciation factor (older devices = lower premium base)
function getAgeFactor(ageMonths: number): number {
  if (ageMonths <= 6) return 1.0;
  if (ageMonths <= 12) return 0.95;
  if (ageMonths <= 24) return 0.85;
  if (ageMonths <= 36) return 0.75;
  return 0.65; // 36+ months
}

// Base annual premium calculation
function calculateBaseAnnualPremium(input: PricingInput): number {
  const categoryMultiplier = categoryMultipliers[input.deviceCategory.toLowerCase()] || categoryMultipliers.default;
  const coverageMultiplier = coverageMultipliers[input.coverageType] || 1.0;
  const ageFactor = getAgeFactor(input.purchaseAgeMonths);
  
  // Base formula: value * 0.08 (8% annual) * multipliers
  const baseRate = 0.08;
  const annualPremium = input.declaredValue * baseRate * categoryMultiplier * coverageMultiplier * ageFactor;
  
  return Math.round(annualPremium * 100) / 100; // Round to 2 decimals
}

// Deductible calculation
function getDeductible(coverageType: string, declaredValue: number): { type: "percentage" | "fixed"; value: number } {
  switch (coverageType) {
    case "EXTENDED_WARRANTY":
      return { type: "percentage", value: 10 }; // 10% of repair cost
    case "ACCIDENTAL_DAMAGE":
      return { type: "fixed", value: 500 }; // 500 TRY fixed
    case "FULL_COVERAGE":
      return { type: "percentage", value: 5 }; // 5% of repair cost
    case "THEFT_LOSS":
      return { type: "percentage", value: 15 }; // 15% of device value
    default:
      return { type: "percentage", value: 10 };
  }
}

// Limits calculation
function getLimits(coverageType: string, declaredValue: number): { maxClaims: number; maxAmount: number } {
  switch (coverageType) {
    case "EXTENDED_WARRANTY":
      return { maxClaims: 3, maxAmount: declaredValue * 0.5 };
    case "ACCIDENTAL_DAMAGE":
      return { maxClaims: 2, maxAmount: declaredValue * 0.8 };
    case "FULL_COVERAGE":
      return { maxClaims: 4, maxAmount: declaredValue };
    case "THEFT_LOSS":
      return { maxClaims: 1, maxAmount: declaredValue * 0.9 };
    default:
      return { maxClaims: 2, maxAmount: declaredValue * 0.7 };
  }
}

// Term discounts for one-time payments
function getTermDiscount(termYears?: number): { discountPercent: number } | undefined {
  if (!termYears) return undefined;
  
  const discounts: Record<number, number> = {
    1: 0, // No discount for 1 year
    2: 8, // 8% discount for 2 years
    3: 12, // 12% discount for 3 years
  };
  
  const discountPercent = discounts[termYears];
  if (discountPercent === undefined) return undefined;
  
  return { discountPercent };
}

/**
 * Calculate insurance premium
 */
export function calculatePremium(input: PricingInput): PricingOutput {
  const annualPremium = calculateBaseAnnualPremium(input);
  const monthlyPremium = annualPremium / 12;
  
  const deductible = getDeductible(input.coverageType, input.declaredValue);
  const limits = getLimits(input.coverageType, input.declaredValue);
  const discounts = getTermDiscount(input.termYears);
  
  let finalAnnualPremium = annualPremium;
  if (discounts && discounts.discountPercent > 0) {
    finalAnnualPremium = annualPremium * (1 - discounts.discountPercent / 100);
  }
  
  return {
    annualPremium: Math.round(finalAnnualPremium * 100) / 100,
    monthlyPremium: Math.round(monthlyPremium * 100) / 100,
    deductible,
    limits,
    discounts: discounts ? { termYears: input.termYears, discountPercent: discounts.discountPercent } : undefined,
  };
}


