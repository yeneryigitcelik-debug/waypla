import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_RATE_LIMIT_MESSAGE =
  "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfterSeconds: number;
  limit: number;
};

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

export async function checkRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStartMs = Math.floor(now / windowMs) * windowMs;
  const resetAt = new Date(windowStartMs + windowMs);
  const storageKey = `${key}:${windowStartMs}`;

  const record = await prisma.rateLimit.upsert({
    where: { key: storageKey },
    update: {
      count: { increment: 1 },
      updatedAt: new Date(),
    },
    create: {
      key: storageKey,
      count: 1,
      windowStart: new Date(windowStartMs),
      expiresAt: resetAt,
    },
  });

  const remaining = Math.max(0, limit - record.count);
  const retryAfterSeconds = Math.max(
    0,
    Math.ceil((resetAt.getTime() - now) / 1000),
  );

  return {
    allowed: record.count <= limit,
    remaining,
    resetAt,
    retryAfterSeconds,
    limit,
  };
}

export function createRateLimitResponse(result: RateLimitResult) {
  const message = DEFAULT_RATE_LIMIT_MESSAGE;
  return NextResponse.json(
    {
      error: message,
      message,
      code: "RATE_LIMITED",
      retryAfterSeconds: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": result.retryAfterSeconds.toString(),
      },
    },
  );
}
