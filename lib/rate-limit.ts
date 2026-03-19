import { NextRequest } from "next/server";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
};

// In-memory fallback store for generic rate limits when Redis is unavailable.
// This is per-instance and resets on cold start, but it's much safer than
// completely disabling limits when Redis/KV is misconfigured.
const rateStore = new Map<
  string,
  { count: number; resetAt: number }
>();

function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;

  try {
    const { Redis } = require("@upstash/redis");
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

export function getRequestIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

export async function checkRateLimit(params: {
  key: string;
  limit: number;
  windowSec: number;
}): Promise<RateLimitResult> {
  const { key, limit, windowSec } = params;
  const redis = getRedisClient();

  if (!redis) {
    const now = Date.now();
    const windowMs = windowSec * 1000;
    const existing = rateStore.get(key);

    if (!existing || existing.resetAt <= now) {
      // First call in this window
      rateStore.set(key, { count: 1, resetAt: now + windowMs });
      return {
        allowed: true,
        remaining: limit - 1,
        retryAfter: windowSec,
      };
    }

    if (existing.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil((existing.resetAt - now) / 1000),
      };
    }

    existing.count += 1;
    return {
      allowed: true,
      remaining: Math.max(0, limit - existing.count),
      retryAfter: Math.max(
        0,
        Math.ceil((existing.resetAt - now) / 1000)
      ),
    };
  }

  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSec);
    }

    const ttl = await redis.ttl(key);
    const remaining = Math.max(0, limit - count);
    const allowed = count <= limit;

    return {
      allowed,
      remaining,
      retryAfter: ttl > 0 ? ttl : windowSec,
    };
  } catch (error) {
    console.error("[RateLimit] Error:", error);
    return {
      allowed: true,
      remaining: limit,
      retryAfter: 0,
    };
  }
}
/**
 * Simple in-memory rate limiter for AI routes.
 * Production: use Upstash Redis + @upstash/ratelimit for distributed limits.
 * 
 * Protects against:
 * - Cost explosion from GPT/Claude abuse
 * - Single-account rapid-fire generation
 */

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_PER_WINDOW = 10;   // 10 AI calls per minute per user

// In-memory: resets on cold start. Use Redis in production.
const store = new Map<string, { count: number; resetAt: number }>();

function cleanup() {
  const now = Date.now();
  Array.from(store.entries()).forEach(([key, val]) => {
    if (val.resetAt < now) store.delete(key);
  });
}

export function checkAIRateLimit(userId: string): { ok: boolean; retryAfter?: number } {
  if (!userId) return { ok: false };
  cleanup();
  const now = Date.now();
  const key = `ai:${userId}`;
  const entry = store.get(key);
  if (!entry) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { ok: true };
}
