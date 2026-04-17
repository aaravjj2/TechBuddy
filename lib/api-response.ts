// lib/api-response.ts
// Unified API response envelope so every route returns { data, meta } or
// { error, meta }. Meta always carries requestId + version + timestamp.

import { NextResponse } from "next/server";
import { logApiCall } from "@/lib/telemetry";

export const API_VERSION = "v1";

export type ApiMeta = {
  requestId: string;
  version: string;
  timestamp: string;
};

export type ApiError = {
  code: string;
  message: string;
  requestId: string;
};

export function makeMeta(requestId: string): ApiMeta {
  return {
    requestId,
    version: API_VERSION,
    timestamp: new Date().toISOString(),
  };
}

export function ok<T>(
  data: T,
  opts: { requestId: string; route: string; method: string; startedAt: number; status?: number; userId?: string | null }
) {
  const durationMs = Date.now() - opts.startedAt;
  const status = opts.status ?? 200;
  logApiCall({
    requestId: opts.requestId,
    route: opts.route,
    method: opts.method,
    statusCode: status,
    durationMs,
    userId: opts.userId ?? null,
  });
  return NextResponse.json(
    { data, meta: makeMeta(opts.requestId) },
    {
      status,
      headers: {
        "x-request-id": opts.requestId,
        "x-api-version": API_VERSION,
      },
    }
  );
}

export function fail(
  code: string,
  message: string,
  opts: {
    requestId: string;
    route: string;
    method: string;
    startedAt: number;
    status: number;
    userId?: string | null;
    extraHeaders?: Record<string, string>;
  }
) {
  const durationMs = Date.now() - opts.startedAt;
  logApiCall({
    requestId: opts.requestId,
    route: opts.route,
    method: opts.method,
    statusCode: opts.status,
    durationMs,
    userId: opts.userId ?? null,
  });
  return NextResponse.json(
    {
      error: { code, message, requestId: opts.requestId } satisfies ApiError,
      meta: makeMeta(opts.requestId),
    },
    {
      status: opts.status,
      headers: {
        "x-request-id": opts.requestId,
        "x-api-version": API_VERSION,
        ...(opts.extraHeaders ?? {}),
      },
    }
  );
}
