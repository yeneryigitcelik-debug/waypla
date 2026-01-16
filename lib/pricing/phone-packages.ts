/**
 * Fixed Phone Package Pricing
 * iOS and Android phones have single fixed-price packages
 */

export interface PhonePackage {
    name: string;
    monthlyPrice: number;
    annualPrice: number;
    coverageType: "FULL_COVERAGE";
    features: string[];
    deductible: {
        type: "percentage" | "fixed";
        value: number;
    };
    maxClaims: number;
}

// Fixed packages for phones - single option per type
export const phonePackages: Record<string, PhonePackage> = {
    iphone: {
        name: "iPhone Tam Koruma",
        monthlyPrice: 149,
        annualPrice: 1490, // ~2 months free
        coverageType: "FULL_COVERAGE",
        features: [
            "Ekran kırılması",
            "Sıvı teması",
            "Düşme hasarı",
            "Batarya değişimi",
            "Orijinal parça garantisi",
            "7/24 destek",
        ],
        deductible: { type: "percentage", value: 10 },
        maxClaims: 3,
    },
    android: {
        name: "Android Tam Koruma",
        monthlyPrice: 129,
        annualPrice: 1290, // ~2 months free
        coverageType: "FULL_COVERAGE",
        features: [
            "Ekran kırılması",
            "Sıvı teması",
            "Düşme hasarı",
            "Batarya değişimi",
            "Orijinal parça garantisi",
            "7/24 destek",
        ],
        deductible: { type: "percentage", value: 10 },
        maxClaims: 3,
    },
};

// iPhone brand keywords
const iphoneBrands = ["apple", "iphone"];

// Android brand keywords (major brands)
const androidBrands = [
    "samsung",
    "xiaomi",
    "huawei",
    "oppo",
    "vivo",
    "oneplus",
    "google",
    "pixel",
    "realme",
    "poco",
    "honor",
    "motorola",
    "nokia",
    "sony",
    "lg",
    "asus",
    "tcl",
];

/**
 * Check if a device is a phone
 */
export function isPhone(category: string): boolean {
    const phoneCategories = ["phone", "smartphone", "telefon", "akıllı telefon"];
    return phoneCategories.includes(category.toLowerCase());
}

/**
 * Get phone type (iphone or android)
 */
export function getPhoneType(brand: string): "iphone" | "android" | null {
    const brandLower = brand.toLowerCase();

    if (iphoneBrands.some(b => brandLower.includes(b))) {
        return "iphone";
    }

    if (androidBrands.some(b => brandLower.includes(b))) {
        return "android";
    }

    // Default to android for unknown phone brands
    return "android";
}

/**
 * Get fixed package for a phone
 */
export function getPhonePackage(brand: string): PhonePackage | null {
    const phoneType = getPhoneType(brand);
    if (!phoneType) return null;
    return phonePackages[phoneType];
}

/**
 * Check if device uses fixed pricing (phones only)
 */
export function usesFixedPricing(category: string): boolean {
    return isPhone(category);
}

/**
 * Format price for display
 */
export function formatPhonePrice(pkg: PhonePackage, annual: boolean = false): string {
    const price = annual ? pkg.annualPrice : pkg.monthlyPrice;
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}
