import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Health check endpoint
 * GET /api/health
 */
export async function GET() {
    const health = {
        status: "ok",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
        checks: {
            database: "unknown",
        },
    };

    // Check database connection
    try {
        await prisma.$queryRaw`SELECT 1`;
        health.checks.database = "ok";
    } catch (error) {
        health.checks.database = "error";
        health.status = "degraded";
        console.error("[Health] Database check failed:", error);
    }

    const statusCode = health.status === "ok" ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });
}
