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
