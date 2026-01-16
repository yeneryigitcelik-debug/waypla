import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateFromCatalog, calculateAllQuotes, CoverageType } from "@/lib/pricing/engine";

// GET /api/catalog - List devices or get quotes
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    try {
        // Get brands list
        if (action === "brands") {
            const category = searchParams.get("category");
            const brands = await prisma.deviceCatalog.groupBy({
                by: ["brand"],
                where: {
                    isActive: true,
                    ...(category && { category }),
                },
                _count: { brand: true },
                orderBy: { brand: "asc" },
            });

            return NextResponse.json({
                success: true,
                data: brands.map(b => ({ brand: b.brand, count: b._count.brand })),
            });
        }

        // Get models for a brand
        if (action === "models") {
            const brand = searchParams.get("brand");
            if (!brand) {
                return NextResponse.json({ success: false, error: "Brand required" }, { status: 400 });
            }

            const devices = await prisma.deviceCatalog.findMany({
                where: { brand, isActive: true },
                select: { id: true, model: true, storage: true, marketPrice: true },
                orderBy: [{ model: "asc" }, { marketPrice: "desc" }],
            });

            // Group by model
            const modelMap = new Map<string, { model: string; options: { id: string; storage: string | null; price: number }[] }>();
            for (const d of devices) {
                if (!modelMap.has(d.model)) {
                    modelMap.set(d.model, { model: d.model, options: [] });
                }
                modelMap.get(d.model)!.options.push({
                    id: d.id,
                    storage: d.storage,
                    price: d.marketPrice,
                });
            }

            return NextResponse.json({
                success: true,
                data: Array.from(modelMap.values()),
            });
        }

        // Get quote for a device
        if (action === "quote") {
            const catalogId = searchParams.get("catalogId");
            const coverageType = searchParams.get("coverage") as CoverageType | null;

            if (!catalogId) {
                return NextResponse.json({ success: false, error: "catalogId required" }, { status: 400 });
            }

            const device = await prisma.deviceCatalog.findUnique({
                where: { id: catalogId },
            });

            if (!device || !device.isActive) {
                return NextResponse.json({ success: false, error: "Device not found" }, { status: 404 });
            }

            // Single coverage quote
            if (coverageType) {
                const quote = calculateFromCatalog({
                    catalogId: device.id,
                    marketPrice: device.marketPrice,
                    category: device.category,
                    releaseYear: device.releaseYear ?? undefined,
                    coverageType,
                });

                return NextResponse.json({
                    success: true,
                    data: {
                        device: {
                            id: device.id,
                            brand: device.brand,
                            model: device.model,
                            storage: device.storage,
                            marketPrice: device.marketPrice,
                        },
                        quote,
                    },
                });
            }

            // All coverage quotes
            const quotes = calculateAllQuotes(
                device.id,
                device.marketPrice,
                device.category,
                device.releaseYear ?? undefined
            );

            return NextResponse.json({
                success: true,
                data: {
                    device: {
                        id: device.id,
                        brand: device.brand,
                        model: device.model,
                        storage: device.storage,
                        category: device.category,
                        marketPrice: device.marketPrice,
                    },
                    quotes,
                },
            });
        }

        // Get categories
        if (action === "categories") {
            const categories = await prisma.deviceCatalog.groupBy({
                by: ["category"],
                where: { isActive: true },
                _count: { category: true },
            });

            return NextResponse.json({
                success: true,
                data: categories.map(c => ({ category: c.category, count: c._count.category })),
            });
        }

        // Default: list all devices (paginated)
        const page = parseInt(searchParams.get("page") || "1");
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
        const category = searchParams.get("category");
        const brand = searchParams.get("brand");
        const search = searchParams.get("search");

        const where = {
            isActive: true,
            ...(category && { category }),
            ...(brand && { brand }),
            ...(search && {
                OR: [
                    { brand: { contains: search, mode: "insensitive" as const } },
                    { model: { contains: search, mode: "insensitive" as const } },
                ],
            }),
        };

        const [devices, total] = await Promise.all([
            prisma.deviceCatalog.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [{ brand: "asc" }, { marketPrice: "desc" }],
            }),
            prisma.deviceCatalog.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: devices,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (error) {
        console.error("Catalog API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
