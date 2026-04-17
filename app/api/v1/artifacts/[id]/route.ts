import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { newRequestId } from "@/lib/telemetry";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const requestId = newRequestId();
  const startedAt = Date.now();
  const route = "/api/v1/artifacts/[id]";
  void req;
  const { id } = await context.params;

  // id can be either the cuid or the page number (1..360)
  const numeric = Number(id);
  const row = await prisma.artifactPage.findFirst({
    where: Number.isInteger(numeric) ? { pageNumber: numeric } : { id },
  });
  if (!row) {
    return fail("NOT_FOUND", "Artifact not found", {
      requestId,
      route,
      method: "GET",
      startedAt,
      status: 404,
    });
  }

  return ok(
    {
      id: row.id,
      pageNumber: row.pageNumber,
      year: row.year,
      monthInYear: row.monthInYear,
      globalMonth: row.globalMonth,
      quarter: row.quarter,
      domain: row.domain,
      title: row.title,
      primaryGoal: row.primaryGoal,
      outcomes: safeParse(row.outcomes, []),
      metrics: safeParse(row.metrics, {}),
      risks: safeParse(row.risks, []),
      dod: row.dod,
    },
    { requestId, route, method: "GET", startedAt }
  );
}

function safeParse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
