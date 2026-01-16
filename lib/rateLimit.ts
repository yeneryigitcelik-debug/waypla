/**
 * Rate Limiting Utility
 * 
 * Provides in-memory rate limiting for API routes.
 * For production with multiple instances, consider using Redis or database-backed storage.
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// In-memory store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of rateLimitStore.entries()) {
            if (entry.resetAt < now) {
                rateLimitStore.delete(key);
            }
        }
    }, 5 * 60 * 1000);
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    retryAfter?: number; // seconds until reset
}

export interface RateLimitOptions {
    /** Maximum number of requests allowed in the window */
    limit: number;
    /** Time window in milliseconds */
    windowMs: number;
    /** Optional prefix for the identifier (e.g., 'auth', 'api') */
    prefix?: string;
}

/**
 * Check if a request is within rate limits
 * 
 * @param identifier - Unique identifier (usually IP address or user ID)
 * @param options - Rate limit configuration
 * @returns RateLimitResult indicating if request is allowed
 * 
 * @example
 * ```ts
 * const result = await checkRateLimit(clientIp, { limit: 10, windowMs: 60000 });
 * if (!result.allowed) {
 *   return new Response('Too many requests', { status: 429 });
 * }
 * ```
 */
export function checkRateLimit(
    identifier: string,
    options: RateLimitOptions
): RateLimitResult {
    const { limit, windowMs, prefix = 'default' } = options;
    const key = `${prefix}:${identifier}`;
    const now = Date.now();

    const entry = rateLimitStore.get(key);

    // If no entry exists or window has expired, create new entry
    if (!entry || entry.resetAt < now) {
        const newEntry: RateLimitEntry = {
            count: 1,
            resetAt: now + windowMs,
        };
        rateLimitStore.set(key, newEntry);
        return {
            allowed: true,
            remaining: limit - 1,
            resetAt: newEntry.resetAt,
        };
    }

    // Increment count
    entry.count += 1;
    rateLimitStore.set(key, entry);

    const remaining = Math.max(0, limit - entry.count);
    const allowed = entry.count <= limit;

    return {
        allowed,
        remaining,
        resetAt: entry.resetAt,
        retryAfter: allowed ? undefined : Math.ceil((entry.resetAt - now) / 1000),
    };
}

/**
 * Get the client IP from request headers
 * Handles various proxy configurations
 */
export function getClientIp(headers: Headers): string {
    // Check common proxy headers
    const forwarded = headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIp = headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Cloudflare
    const cfConnectingIp = headers.get('cf-connecting-ip');
    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    // Default fallback
    return 'unknown';
}

/**
 * Create rate limit headers for response
 * Following IETF draft-polli-ratelimit-headers
 */
export function createRateLimitHeaders(result: RateLimitResult, limit: number): Headers {
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', String(limit));
    headers.set('X-RateLimit-Remaining', String(result.remaining));
    headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));

    if (result.retryAfter !== undefined) {
        headers.set('Retry-After', String(result.retryAfter));
    }

    return headers;
}

/**
 * Predefined rate limit configurations
 */
export const RateLimitPresets = {
    /** Standard API: 100 requests per minute */
    api: { limit: 100, windowMs: 60 * 1000, prefix: 'api' },

    /** Authentication: 5 attempts per 15 minutes */
    auth: { limit: 5, windowMs: 15 * 60 * 1000, prefix: 'auth' },

    /** Strict: 10 requests per minute */
    strict: { limit: 10, windowMs: 60 * 1000, prefix: 'strict' },

    /** Lenient: 1000 requests per minute */
    lenient: { limit: 1000, windowMs: 60 * 1000, prefix: 'lenient' },
} as const;
