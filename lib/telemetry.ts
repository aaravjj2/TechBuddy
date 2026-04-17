// lib/telemetry.ts
// Lightweight in-memory telemetry ring buffer. Tracks API requests and AI
// calls so /api/v1/telemetry can report p50/p95 latency per route without any
// external dependency. Persisted to ApiCallLog table for INSTRUCTOR dashboards.

import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export type ApiCallEntry = {
  requestId: string;
  route: string;
  method: string;
  statusCode: number;
  durationMs: number;
  userId?: string | null;
  at: number;
};

export type AiCallEntry = {
  requestId?: string;
  provider: "anthropic" | "zai" | "fallback";
  model: string;
  route?: string;
  latencyMs: number;
  ok: boolean;
  reason?: string;
  at: number;
};

const RING_MAX = 1000;
const apiRing: ApiCallEntry[] = [];
const aiRing: AiCallEntry[] = [];

export function newRequestId(): string {
  return randomUUID();
}

export function logApiCall(e: Omit<ApiCallEntry, "at">): void {
  apiRing.push({ ...e, at: Date.now() });
  if (apiRing.length > RING_MAX) apiRing.splice(0, apiRing.length - RING_MAX);

  // Persist asynchronously; don't block the request path.
  prisma.apiCallLog
    .create({
      data: {
        requestId: e.requestId,
        route: e.route,
        method: e.method,
        statusCode: e.statusCode,
        durationMs: e.durationMs,
        userId: e.userId ?? null,
      },
    })
    .catch(() => {
      /* swallow — telemetry must never break a request */
    });
}

export function logAiCall(e: Omit<AiCallEntry, "at">): void {
  aiRing.push({ ...e, at: Date.now() });
  if (aiRing.length > RING_MAX) aiRing.splice(0, aiRing.length - RING_MAX);
}

export function getApiRing(limit = 200): ApiCallEntry[] {
  return apiRing.slice(-limit).reverse();
}

export function getAiRing(limit = 200): AiCallEntry[] {
  return aiRing.slice(-limit).reverse();
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

export function latencySummary(): {
  byRoute: Array<{
    route: string;
    count: number;
    p50: number;
    p95: number;
    errorRate: number;
  }>;
} {
  const byRoute = new Map<string, { durations: number[]; errors: number }>();
  for (const e of apiRing) {
    const agg = byRoute.get(e.route) ?? { durations: [], errors: 0 };
    agg.durations.push(e.durationMs);
    if (e.statusCode >= 500) agg.errors += 1;
    byRoute.set(e.route, agg);
  }
  return {
    byRoute: Array.from(byRoute.entries())
      .map(([route, { durations, errors }]) => {
        const sorted = [...durations].sort((a, b) => a - b);
        return {
          route,
          count: durations.length,
          p50: percentile(sorted, 50),
          p95: percentile(sorted, 95),
          errorRate: durations.length ? errors / durations.length : 0,
        };
      })
      .sort((a, b) => b.count - a.count),
  };
}
