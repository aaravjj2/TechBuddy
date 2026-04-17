import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";
import {
  newRequestId,
  getApiRing,
  getAiRing,
  latencySummary,
} from "@/lib/telemetry";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const requestId = newRequestId();
  const startedAt = Date.now();
  const route = "/api/v1/telemetry";

  const session = await auth();
  const role = session?.user?.role;
  if (role !== "INSTRUCTOR" && role !== "ADMIN") {
    return fail(
      "FORBIDDEN",
      "Telemetry is only visible to instructors.",
      {
        requestId,
        route,
        method: "GET",
        startedAt,
        status: 403,
        userId: session?.user?.id ?? null,
      }
    );
  }

  const limit = Math.min(
    500,
    Math.max(10, Number(new URL(req.url).searchParams.get("limit") ?? 200))
  );

  return ok(
    {
      summary: latencySummary(),
      recent: getApiRing(limit),
      ai: getAiRing(limit),
    },
    {
      requestId,
      route,
      method: "GET",
      startedAt,
      userId: session?.user?.id ?? null,
    }
  );
}
