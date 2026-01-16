"use server";

import { prisma } from "@/lib/prisma";
import { calculateFromCatalog, calculateAllQuotes, CoverageType, QuoteOutput } from "@/lib/pricing/engine";

// Types
export interface CatalogDevice {
    id: string;
    brand: string;
    model: string;
    storage: string | null;
    category: string;
    marketPrice: number;
    releaseYear: number | null;
    imageUrl: string | null;
    isActive: boolean;
}

export interface BrandWithCount {
    brand: string;
    count: number;
}

export interface ModelWithStorage {
    model: string;
    storageOptions: {
        storage: string | null;
        id: string;
        marketPrice: number;
    }[];
}

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Get all unique brands from catalog
 */
export async function getBrands(category?: string): Promise<BrandWithCount[]> {
    const where = {
        isActive: true,
        ...(category && { category }),
    };

    const brands = await prisma.deviceCatalog.groupBy({
        by: ["brand"],
        where,
        _count: { brand: true },
        orderBy: { brand: "asc" },
    });

    return brands.map((b) => ({
        brand: b.brand,
        count: b._count.brand,
    }));
}

/**
 * Get all models for a brand
 */
export async function getModels(brand: string, category?: string): Promise<ModelWithStorage[]> {
    const where = {
        brand,
        isActive: true,
        ...(category && { category }),
    };

    const devices = await prisma.deviceCatalog.findMany({
        where,
        select: {
            id: true,
            model: true,
            storage: true,
            marketPrice: true,
        },
        orderBy: [{ model: "asc" }, { marketPrice: "desc" }],
    });

    // Group by model
    const modelMap = new Map<string, ModelWithStorage>();

    for (const device of devices) {
        if (!modelMap.has(device.model)) {
            modelMap.set(device.model, {
                model: device.model,
                storageOptions: [],
            });
        }
        modelMap.get(device.model)!.storageOptions.push({
            storage: device.storage,
            id: device.id,
            marketPrice: device.marketPrice,
        });
    }

    return Array.from(modelMap.values());
}

/**
 * Get device categories with count
 */
export async function getCategories(): Promise<{ category: string; count: number }[]> {
    const categories = await prisma.deviceCatalog.groupBy({
        by: ["category"],
        where: { isActive: true },
        _count: { category: true },
        orderBy: { category: "asc" },
    });

    return categories.map((c) => ({
        category: c.category,
        count: c._count.category,
    }));
}

/**
 * Get single catalog device by ID
 */
export async function getCatalogDevice(id: string): Promise<CatalogDevice | null> {
    const device = await prisma.deviceCatalog.findUnique({
        where: { id },
    });

    if (!device) return null;

    return {
        id: device.id,
        brand: device.brand,
        model: device.model,
        storage: device.storage,
        category: device.category,
        marketPrice: device.marketPrice,
        releaseYear: device.releaseYear,
        imageUrl: device.imageUrl,
        isActive: device.isActive,
    };
}

/**
 * Search catalog devices
 */
export async function searchCatalogDevices(query: string, limit = 10): Promise<CatalogDevice[]> {
    const devices = await prisma.deviceCatalog.findMany({
        where: {
            isActive: true,
            OR: [
                { brand: { contains: query, mode: "insensitive" } },
                { model: { contains: query, mode: "insensitive" } },
            ],
        },
        take: limit,
        orderBy: { marketPrice: "desc" },
    });

    return devices.map((d) => ({
        id: d.id,
        brand: d.brand,
        model: d.model,
        storage: d.storage,
        category: d.category,
        marketPrice: d.marketPrice,
        releaseYear: d.releaseYear,
        imageUrl: d.imageUrl,
        isActive: d.isActive,
    }));
}

/**
 * Get all catalog devices (with pagination)
 */
export async function getAllCatalogDevices(
    page = 1,
    limit = 20,
    category?: string,
    brand?: string
): Promise<{ devices: CatalogDevice[]; total: number }> {
    const where = {
        ...(category && { category }),
        ...(brand && { brand }),
    };

    const [devices, total] = await Promise.all([
        prisma.deviceCatalog.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: [{ brand: "asc" }, { model: "asc" }, { marketPrice: "desc" }],
        }),
        prisma.deviceCatalog.count({ where }),
    ]);

    return {
        devices: devices.map((d) => ({
            id: d.id,
            brand: d.brand,
            model: d.model,
            storage: d.storage,
            category: d.category,
            marketPrice: d.marketPrice,
            releaseYear: d.releaseYear,
            imageUrl: d.imageUrl,
            isActive: d.isActive,
        })),
        total,
    };
}

// ============================================
// QUOTE OPERATIONS
// ============================================

/**
 * Get quote for a specific catalog device and coverage type
 */
export async function getQuote(
    catalogId: string,
    coverageType: CoverageType
): Promise<QuoteOutput | null> {
    const device = await prisma.deviceCatalog.findUnique({
        where: { id: catalogId },
    });

    if (!device || !device.isActive) return null;

    return calculateFromCatalog({
        catalogId: device.id,
        marketPrice: device.marketPrice,
        category: device.category,
        releaseYear: device.releaseYear ?? undefined,
        coverageType,
    });
}

/**
 * Get all coverage quotes for a catalog device
 */
export async function getAllQuotes(catalogId: string): Promise<Record<CoverageType, QuoteOutput> | null> {
    const device = await prisma.deviceCatalog.findUnique({
        where: { id: catalogId },
    });

    if (!device || !device.isActive) return null;

    return calculateAllQuotes(
        device.id,
        device.marketPrice,
        device.category,
        device.releaseYear ?? undefined
    );
}

// ============================================
// ADMIN OPERATIONS (CREATE/UPDATE/DELETE)
// ============================================

export interface CreateCatalogDeviceInput {
    brand: string;
    model: string;
    storage?: string;
    category: string;
    marketPrice: number;
    releaseYear?: number;
    imageUrl?: string;
}

export interface UpdateCatalogDeviceInput {
    id: string;
    marketPrice?: number;
    releaseYear?: number;
    imageUrl?: string;
    isActive?: boolean;
}

/**
 * Create new catalog device (Admin only)
 */
export async function createCatalogDevice(
    input: CreateCatalogDeviceInput
): Promise<CatalogDevice> {
    const device = await prisma.deviceCatalog.create({
        data: {
            brand: input.brand,
            model: input.model,
            storage: input.storage || null,
            category: input.category,
            marketPrice: input.marketPrice,
            releaseYear: input.releaseYear || null,
            imageUrl: input.imageUrl || null,
        },
    });

    return {
        id: device.id,
        brand: device.brand,
        model: device.model,
        storage: device.storage,
        category: device.category,
        marketPrice: device.marketPrice,
        releaseYear: device.releaseYear,
        imageUrl: device.imageUrl,
        isActive: device.isActive,
    };
}

/**
 * Update catalog device (Admin only)
 */
export async function updateCatalogDevice(
    input: UpdateCatalogDeviceInput
): Promise<CatalogDevice> {
    const device = await prisma.deviceCatalog.update({
        where: { id: input.id },
        data: {
            ...(input.marketPrice !== undefined && { marketPrice: input.marketPrice }),
            ...(input.releaseYear !== undefined && { releaseYear: input.releaseYear }),
            ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
            ...(input.isActive !== undefined && { isActive: input.isActive }),
        },
    });

    return {
        id: device.id,
        brand: device.brand,
        model: device.model,
        storage: device.storage,
        category: device.category,
        marketPrice: device.marketPrice,
        releaseYear: device.releaseYear,
        imageUrl: device.imageUrl,
        isActive: device.isActive,
    };
}

/**
 * Bulk update market prices (Admin only)
 */
export async function bulkUpdatePrices(
    updates: { id: string; marketPrice: number }[]
): Promise<number> {
    let count = 0;

    for (const update of updates) {
        await prisma.deviceCatalog.update({
            where: { id: update.id },
            data: { marketPrice: update.marketPrice },
        });
        count++;
    }

    return count;
}

/**
 * Toggle device active status (Admin only)
 */
export async function toggleDeviceStatus(id: string): Promise<boolean> {
    const device = await prisma.deviceCatalog.findUnique({
        where: { id },
        select: { isActive: true },
    });

    if (!device) return false;

    await prisma.deviceCatalog.update({
        where: { id },
        data: { isActive: !device.isActive },
    });

    return !device.isActive;
}
