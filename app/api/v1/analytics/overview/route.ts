import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";
import { newRequestId } from "@/lib/telemetry";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  void req;
  const requestId = newRequestId();
  const startedAt = Date.now();
  const route = "/api/v1/analytics/overview";
  const session = await auth();
  if (session?.user?.role !== "INSTRUCTOR" && session?.user?.role !== "ADMIN") {
    return fail("FORBIDDEN", "Instructors only.", {
      requestId,
      route,
      method: "GET",
      startedAt,
      status: 403,
    });
  }

  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const [
    totalLearners,
    activeScamCheckers,
    scamCount,
    practiceCount,
    phoneCount,
    recentScamChecks,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "SENIOR" } }),
    prisma.scamCheck.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } },
    }),
    prisma.scamCheck.count(),
    prisma.practiceSession.count(),
    prisma.phoneHelpSession.count(),
    prisma.scamCheck.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { verdict: true, createdAt: true },
    }),
  ]);

  const metrics = await prisma.learnerMetric.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
  });
  const avgTaskSuccess =
    metrics.length > 0
      ? metrics.reduce((a, m) => a + m.taskSuccessRate, 0) / metrics.length
      : 0;

  const verdictCounts = recentScamChecks.reduce(
    (acc, c) => {
      acc[c.verdict] = (acc[c.verdict] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Build a 6-month activity series stacked by source
  const byMonth: Record<string, { scam: number; practice: number; phone: number }> = {};
  const label = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    byMonth[label(d)] = { scam: 0, practice: 0, phone: 0 };
  }
  const [scamRows, practiceRows, phoneRows] = await Promise.all([
    prisma.scamCheck.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.practiceSession.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.phoneHelpSession.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
  ]);
  for (const r of scamRows) {
    const l = label(r.createdAt);
    if (byMonth[l]) byMonth[l].scam += 1;
  }
  for (const r of practiceRows) {
    const l = label(r.createdAt);
    if (byMonth[l]) byMonth[l].practice += 1;
  }
  for (const r of phoneRows) {
    const l = label(r.createdAt);
    if (byMonth[l]) byMonth[l].phone += 1;
  }

  return ok(
    {
      kpis: {
        totalLearners,
        activeThisMonth: activeScamCheckers.length,
        avgTaskSuccessRate: Number(avgTaskSuccess.toFixed(3)),
        scamChecksRun: scamCount,
        practiceSessions: practiceCount,
        phoneHelpSessions: phoneCount,
      },
      activity: Object.entries(byMonth).map(([month, counts]) => ({
        month,
        ...counts,
      })),
      verdictDistribution: verdictCounts,
    },
    { requestId, route, method: "GET", startedAt, userId: session.user.id }
  );
}
