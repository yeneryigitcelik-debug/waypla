/**
 * Pricing Engine for Device Insurance
 * Deterministic premium calculation based on device and coverage
 */

export type CoverageType = "EXTENDED_WARRANTY" | "ACCIDENTAL_DAMAGE" | "FULL_COVERAGE" | "THEFT_LOSS";

export interface PricingInput {
  declaredValue: number; // Device value in TRY
  deviceCategory: string; // phone, laptop, tablet, etc.
  purchaseAgeMonths: number; // Age of device in months
  coverageType: CoverageType;
  termYears?: number; // For one-time payments: 1, 2, or 3
}

export interface CatalogPricingInput {
  catalogId: string;
  marketPrice: number;
  category: string;
  releaseYear?: number;
  coverageType: CoverageType;
  termYears?: number;
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

export interface QuoteOutput extends PricingOutput {
  catalogId?: string;
  marketPrice: number;
  deviceCategory: string;
  coverageType: CoverageType;
  validUntil: Date; // Quote expiry (24 hours)
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
  console: 0.85,
  default: 1.0,
};

// Coverage type multipliers
const coverageMultipliers: Record<string, number> = {
  EXTENDED_WARRANTY: 0.6,
  ACCIDENTAL_DAMAGE: 0.8,
  FULL_COVERAGE: 1.0,
  THEFT_LOSS: 1.2,
};

// Base rates by coverage type (percentage of device value per year)
const baseRates: Record<string, number> = {
  EXTENDED_WARRANTY: 0.05, // 5% annual
  ACCIDENTAL_DAMAGE: 0.08, // 8% annual
  FULL_COVERAGE: 0.10,     // 10% annual
  THEFT_LOSS: 0.12,        // 12% annual
};

// Age depreciation factor (older devices = lower premium base)
function getAgeFactor(ageMonths: number): number {
  if (ageMonths <= 6) return 1.0;
  if (ageMonths <= 12) return 0.95;
  if (ageMonths <= 24) return 0.85;
  if (ageMonths <= 36) return 0.75;
  return 0.65; // 36+ months
}

// Calculate age from release year
function getAgeFromReleaseYear(releaseYear?: number): number {
  if (!releaseYear) return 12; // Default to 1 year
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const ageYears = currentYear - releaseYear;
  // Assume device was released mid-year
  return Math.max(0, ageYears * 12 + currentMonth - 6);
}

// Base annual premium calculation
function calculateBaseAnnualPremium(input: PricingInput): number {
  const categoryMultiplier = categoryMultipliers[input.deviceCategory.toLowerCase()] || categoryMultipliers.default;
  const coverageMultiplier = coverageMultipliers[input.coverageType] || 1.0;
  const baseRate = baseRates[input.coverageType] || 0.08;
  const ageFactor = getAgeFactor(input.purchaseAgeMonths);

  // Base formula: value * baseRate * multipliers
  const annualPremium = input.declaredValue * baseRate * categoryMultiplier * coverageMultiplier * ageFactor;

  // Minimum premium of 300 TL
  return Math.max(300, Math.round(annualPremium * 100) / 100);
}

// Deductible calculation
function getDeductible(coverageType: string, declaredValue: number): { type: "percentage" | "fixed"; value: number } {
  switch (coverageType) {
    case "EXTENDED_WARRANTY":
      return { type: "percentage", value: 10 }; // 10% of repair cost
    case "ACCIDENTAL_DAMAGE":
      return { type: "fixed", value: Math.min(750, declaredValue * 0.02) }; // 750 TL or 2% whichever is lower
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
      return { maxClaims: 3, maxAmount: Math.round(declaredValue * 0.5) };
    case "ACCIDENTAL_DAMAGE":
      return { maxClaims: 2, maxAmount: Math.round(declaredValue * 0.8) };
    case "FULL_COVERAGE":
      return { maxClaims: 4, maxAmount: declaredValue };
    case "THEFT_LOSS":
      return { maxClaims: 1, maxAmount: Math.round(declaredValue * 0.9) };
    default:
      return { maxClaims: 2, maxAmount: Math.round(declaredValue * 0.7) };
  }
}

// Term discounts for one-time payments
function getTermDiscount(termYears?: number): { discountPercent: number } | undefined {
  if (!termYears) return undefined;

  const discounts: Record<number, number> = {
    1: 0, // No discount for 1 year
    2: 10, // 10% discount for 2 years
    3: 15, // 15% discount for 3 years
  };

  const discountPercent = discounts[termYears];
  if (discountPercent === undefined) return undefined;

  return { discountPercent };
}

/**
 * Calculate insurance premium (legacy - manual device value)
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

/**
 * Calculate premium from catalog device (new - market price based)
 */
export function calculateFromCatalog(input: CatalogPricingInput): QuoteOutput {
  const ageMonths = getAgeFromReleaseYear(input.releaseYear);

  const pricingInput: PricingInput = {
    declaredValue: input.marketPrice,
    deviceCategory: input.category,
    purchaseAgeMonths: ageMonths,
    coverageType: input.coverageType,
    termYears: input.termYears,
  };

  const basePricing = calculatePremium(pricingInput);

  // Quote valid for 24 hours
  const validUntil = new Date();
  validUntil.setHours(validUntil.getHours() + 24);

  return {
    ...basePricing,
    catalogId: input.catalogId,
    marketPrice: input.marketPrice,
    deviceCategory: input.category,
    coverageType: input.coverageType,
    validUntil,
  };
}

/**
 * Calculate all coverage type quotes for a catalog device
 */
export function calculateAllQuotes(catalogId: string, marketPrice: number, category: string, releaseYear?: number): Record<CoverageType, QuoteOutput> {
  const coverageTypes: CoverageType[] = ["EXTENDED_WARRANTY", "ACCIDENTAL_DAMAGE", "FULL_COVERAGE", "THEFT_LOSS"];

  const quotes: Partial<Record<CoverageType, QuoteOutput>> = {};

  for (const coverageType of coverageTypes) {
    quotes[coverageType] = calculateFromCatalog({
      catalogId,
      marketPrice,
      category,
      releaseYear,
      coverageType,
    });
  }

  return quotes as Record<CoverageType, QuoteOutput>;
}

/**
 * Format price for display (Turkish Lira)
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
