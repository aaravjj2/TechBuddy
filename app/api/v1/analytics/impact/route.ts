import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";
import { newRequestId } from "@/lib/telemetry";

export const runtime = "nodejs";

const DOMAINS = [
  "Seniors First Learning",
  "Scam Defense and Digital Safety",
  "AI Literacy and Everyday AI Use",
  "Accessibility and Inclusive Design",
  "Content and Curriculum Operations",
  "Partnerships and Community Centers",
  "Research and Learning",
  "Caregiver and Family Support",
  "Platform and Reliability",
  "Impact Measurement and Reporting",
];

const GATE_TARGET = 85;
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function monthLabel(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  const requestId = newRequestId();
  const startedAt = Date.now();
  const route = "/api/v1/analytics/impact";

  const session = await auth();
  if (
    session?.user?.role !== "INSTRUCTOR" &&
    session?.user?.role !== "ADMIN"
  ) {
    return fail("FORBIDDEN", "Instructors only.", {
      requestId,
      route,
      method: "GET",
      startedAt,
      status: 403,
    });
  }

  const url = new URL(req.url);
  const month = url.searchParams.get("month") ?? monthLabel(new Date());
  if (!MONTH_RE.test(month)) {
    return fail("INVALID_MONTH", "month must be YYYY-MM.", {
      requestId,
      route,
      method: "GET",
      startedAt,
      status: 400,
    });
  }

  try {
    const records = await prisma.milestoneRecord.findMany({
      where: { month },
      orderBy: { createdAt: "desc" },
    });
    const latestByDomain = new Map<string, (typeof records)[number]>();
    for (const r of records) {
      if (!latestByDomain.has(r.domain)) latestByDomain.set(r.domain, r);
    }

    const domains = DOMAINS.map((d) => {
      const rec = latestByDomain.get(d);
      const completionPct = rec?.completionPct ?? 0;
      const gateTarget = rec?.gateTarget ?? GATE_TARGET;
      const passed = completionPct >= gateTarget;
      const status: "red" | "amber" | "green" =
        completionPct >= gateTarget
          ? "green"
          : completionPct >= 70
            ? "amber"
            : "red";
      return { domain: d, completionPct, gateTarget, passed, status };
    });

    const now = new Date();
    const trendMonths: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trendMonths.push(monthLabel(d));
    }

    const metrics = await prisma.learnerMetric.findMany({
      where: { month: { in: trendMonths } },
      select: { month: true, taskSuccessRate: true, completionRate: true },
    });
    const agg: Record<
      string,
      { task: number; comp: number; n: number }
    > = {};
    for (const m of trendMonths) agg[m] = { task: 0, comp: 0, n: 0 };
    for (const r of metrics) {
      if (!agg[r.month]) continue;
      agg[r.month].task += r.taskSuccessRate;
      agg[r.month].comp += r.completionRate;
      agg[r.month].n += 1;
    }
    const trend = trendMonths.map((m) => ({
      month: m,
      taskSuccessRate: agg[m].n ? agg[m].task / agg[m].n : 0,
      completionRate: agg[m].n ? agg[m].comp / agg[m].n : 0,
    }));

    return ok(
      { month, domains, trend },
      {
        requestId,
        route,
        method: "GET",
        startedAt,
        userId: session.user.id,
      }
    );
  } catch (err) {
    return fail(
      "INTERNAL",
      err instanceof Error ? err.message : "Unknown error.",
      {
        requestId,
        route,
        method: "GET",
        startedAt,
        status: 500,
        userId: session.user.id,
      }
    );
  }
}
