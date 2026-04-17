import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";
import { newRequestId } from "@/lib/telemetry";

export const runtime = "nodejs";

const GATE_TARGET = 85;

const bodySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "month must be YYYY-MM"),
  domain: z.string().min(1).max(120),
  completionPct: z.number().min(0).max(100),
  notes: z.string().max(2000).optional(),
  gateTarget: z.number().min(0).max(100).optional(),
});

export async function POST(req: NextRequest) {
  const requestId = newRequestId();
  const startedAt = Date.now();
  const route = "/api/v1/analytics/milestone";

  const session = await auth();
  if (
    session?.user?.role !== "INSTRUCTOR" &&
    session?.user?.role !== "ADMIN"
  ) {
    return fail("FORBIDDEN", "Instructors only.", {
      requestId,
      route,
      method: "POST",
      startedAt,
      status: 403,
    });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return fail("INVALID_JSON", "Body must be valid JSON.", {
      requestId,
      route,
      method: "POST",
      startedAt,
      status: 400,
    });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return fail("VALIDATION", parsed.error.issues[0]?.message ?? "Invalid body.", {
      requestId,
      route,
      method: "POST",
      startedAt,
      status: 400,
    });
  }

  const {
    month,
    domain,
    completionPct,
    notes,
    gateTarget = GATE_TARGET,
  } = parsed.data;

  try {
    const record = await prisma.milestoneRecord.create({
      data: {
        month,
        domain,
        completionPct,
        gateTarget,
        passed: completionPct >= gateTarget,
        notes: notes ?? null,
      },
    });

    return ok(
      { record },
      {
        requestId,
        route,
        method: "POST",
        startedAt,
        status: 201,
        userId: session.user.id,
      }
    );
  } catch (err) {
    return fail(
      "INTERNAL",
      err instanceof Error ? err.message : "Could not save milestone.",
      {
        requestId,
        route,
        method: "POST",
        startedAt,
        status: 500,
        userId: session.user.id,
      }
    );
  }
}
