// lib/rate-limit-v1.ts
// In-memory sliding-window rate limiter used by /api/v1/* routes.
// Complements the existing lib/rate-limit.ts (Upstash) — this one has zero
// external dependencies so tests and local dev work without secrets.

export type RateLimitConfig = {
  windowMs: number;
  max: number;
};

type Bucket = { hits: number[] };
const store = new Map<string, Bucket>();

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  limit: number;
  resetAt: Date;
  retryAfterSeconds: number;
};

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  const bucket = store.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((ts) => ts > windowStart);
  const overLimit = bucket.hits.length >= config.max;

  if (!overLimit) {
    bucket.hits.push(now);
  }
  store.set(key, bucket);

  const oldest = bucket.hits[0] ?? now;
  const resetAt = new Date(oldest + config.windowMs);
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((resetAt.getTime() - now) / 1000)
  );

  return {
    success: !overLimit,
    remaining: Math.max(0, config.max - bucket.hits.length),
    limit: config.max,
    resetAt,
    retryAfterSeconds,
  };
}

export function resetRateLimit(key?: string): void {
  if (key) store.delete(key);
  else store.clear();
}

export function ipKey(req: Request, suffix: string): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
  return `${ip}:${suffix}`;
}
