import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { newRequestId } from "@/lib/telemetry";

export const runtime = "nodejs";

const START_TIME = Date.now();

export async function GET(req: NextRequest) {
  const requestId = newRequestId();
  const startedAt = Date.now();
  const route = "/api/v1/health";

  let db: "connected" | "error" = "connected";
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
  } catch {
    db = "error";
  }

  // AI provider health: we consider the provider "available" if either
  // ANTHROPIC_API_KEY or a Z_AI key is present. A real probe ping would spend
  // a token, so we do a cheap config check for the health endpoint.
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasZai = !!(process.env.Z_AI_API_KEY || process.env.ZAI_API_KEY);
  const ai: "available" | "degraded" =
    hasAnthropic || hasZai ? "available" : "degraded";

  const uptimeSeconds = Math.floor((Date.now() - START_TIME) / 1000);
  const status = db === "connected" ? "ok" : "degraded";

  void req; // silence unused
  return ok(
    { status, db, ai, uptimeSeconds, model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5" },
    { requestId, route, method: "GET", startedAt, status: db === "connected" ? 200 : 503 }
  );
}

void fail; // exported for consistency, unused here
