import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ActivityChart } from "@/components/instructor/ActivityChart";
import { VerdictDonut } from "@/components/instructor/VerdictDonut";

export const dynamic = "force-dynamic";

type MonthBucket = { month: string; scam: number; practice: number; phone: number };

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

function monthLabel(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function InstructorDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const currentMonth = monthLabel(now);

  const [
    totalLearners,
    activeUserGroups,
    scamChecksRun,
    last6MonthsMetrics,
    scamRows,
    practiceRows,
    phoneRows,
    recentScamChecks,
    latestMilestones,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "SENIOR" } }),
    prisma.scamCheck.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: startOfMonth }, userId: { not: null } },
    }),
    prisma.scamCheck.count(),
    prisma.learnerMetric.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { taskSuccessRate: true },
    }),
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
    prisma.scamCheck.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { verdict: true },
    }),
    prisma.milestoneRecord.findMany({
      where: { month: currentMonth },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const avgTaskSuccessRate =
    last6MonthsMetrics.length === 0
      ? 0
      : last6MonthsMetrics.reduce((a, m) => a + m.taskSuccessRate, 0) /
        last6MonthsMetrics.length;

  const buckets: Record<string, MonthBucket> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets[monthLabel(d)] = { month: monthLabel(d), scam: 0, practice: 0, phone: 0 };
  }
  for (const r of scamRows) {
    const k = monthLabel(r.createdAt);
    if (buckets[k]) buckets[k].scam += 1;
  }
  for (const r of practiceRows) {
    const k = monthLabel(r.createdAt);
    if (buckets[k]) buckets[k].practice += 1;
  }
  for (const r of phoneRows) {
    const k = monthLabel(r.createdAt);
    if (buckets[k]) buckets[k].phone += 1;
  }
  const activity = Object.values(buckets);

  const verdictCounts: Record<string, number> = {};
  for (const c of recentScamChecks) {
    verdictCounts[c.verdict] = (verdictCounts[c.verdict] ?? 0) + 1;
  }
  const verdictData = Object.entries(verdictCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const GATE_TARGET = 85;
  const latestByDomain = new Map<string, (typeof latestMilestones)[number]>();
  for (const m of latestMilestones) {
    if (!latestByDomain.has(m.domain)) latestByDomain.set(m.domain, m);
  }
  const domainMilestones = DOMAINS.map((d) => {
    const rec = latestByDomain.get(d);
    return {
      domain: d,
      completionPct: rec?.completionPct ?? 0,
      passed: rec ? rec.completionPct >= GATE_TARGET : false,
      hasRecord: Boolean(rec),
    };
  });
  const avgCompletion =
    domainMilestones.reduce((a, d) => a + d.completionPct, 0) /
    Math.max(1, domainMilestones.length);
  const passedCount = domainMilestones.filter((d) => d.passed).length;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-senior-2xl font-semibold text-neutral-900">
          Instructor dashboard
        </h1>
        <p className="text-senior-base text-neutral-700">
          A snapshot of learners, activity, and milestone progress for{" "}
          {currentMonth}.
        </p>
      </header>

      {/* KPI row */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">
          Key indicators
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card tone="trust">
            <CardDescription className="!mt-0 text-senior-sm uppercase tracking-wide text-neutral-600">
              Total learners
            </CardDescription>
            <p className="mt-2 text-senior-2xl font-bold text-neutral-900">
              {totalLearners}
            </p>
            <p className="mt-1 text-senior-sm text-neutral-600">Role = SENIOR</p>
          </Card>

          <Card tone="safe">
            <CardDescription className="!mt-0 text-senior-sm uppercase tracking-wide text-neutral-600">
              Active this month
            </CardDescription>
            <p className="mt-2 text-senior-2xl font-bold text-neutral-900">
              {activeUserGroups.length}
            </p>
            <p className="mt-1 text-senior-sm text-neutral-600">
              Distinct scam-check users
            </p>
          </Card>

          <Card tone="calm">
            <CardDescription className="!mt-0 text-senior-sm uppercase tracking-wide text-neutral-600">
              Avg task success rate
            </CardDescription>
            <p className="mt-2 text-senior-2xl font-bold text-neutral-900">
              {Math.round(avgTaskSuccessRate * 100)}%
            </p>
            <p className="mt-1 text-senior-sm text-neutral-600">Last 6 months</p>
          </Card>

          <Card tone="warn">
            <CardDescription className="!mt-0 text-senior-sm uppercase tracking-wide text-neutral-600">
              Scam checks run
            </CardDescription>
            <p className="mt-2 text-senior-2xl font-bold text-neutral-900">
              {scamChecksRun}
            </p>
            <p className="mt-1 text-senior-sm text-neutral-600">All time</p>
          </Card>
        </div>
      </section>

      {/* Charts row */}
      <section aria-labelledby="charts-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <h2 id="charts-heading" className="sr-only">
          Usage charts
        </h2>

        <Card className="lg:col-span-2">
          <CardTitle>Last 6 months activity</CardTitle>
          <CardDescription>
            Scam checks, practice sessions, and phone help sessions per month.
          </CardDescription>
          <div className="mt-4">
            <ActivityChart data={activity} />
          </div>
        </Card>

        <Card>
          <CardTitle>Recent verdict mix</CardTitle>
          <CardDescription>
            Distribution across the last 200 scam checks.
          </CardDescription>
          <div className="mt-4">
            <VerdictDonut data={verdictData} />
          </div>
        </Card>
      </section>

      {/* Milestones */}
      <section aria-labelledby="milestones-heading">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="milestones-heading" className="text-senior-lg font-semibold text-neutral-900">
                Milestone progress — {currentMonth}
              </h2>
              <p className="mt-1 text-senior-base text-neutral-700">
                Gate target is {GATE_TARGET}% across all 10 program domains.
              </p>
            </div>
            <Badge tone={passedCount >= 7 ? "safe" : passedCount >= 4 ? "warn" : "scam"}>
              {passedCount} of {DOMAINS.length} domains passing
            </Badge>
          </div>

          <div className="mt-4">
            <p className="text-senior-sm text-neutral-600">
              Average completion across domains
            </p>
            <div className="mt-2">
              <ProgressBar
                value={Math.round(avgCompletion)}
                label={`Average completion ${Math.round(avgCompletion)}%`}
              />
            </div>
            <p className="mt-2 text-senior-sm text-neutral-600">
              {Math.round(avgCompletion)}% vs. {GATE_TARGET}% target
            </p>
          </div>

          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {domainMilestones.map((d) => (
              <li
                key={d.domain}
                className="rounded-senior border border-neutral-200 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-senior-base font-medium text-neutral-900">
                    {d.domain}
                  </p>
                  <Badge
                    tone={
                      !d.hasRecord
                        ? "neutral"
                        : d.passed
                          ? "safe"
                          : d.completionPct >= 70
                            ? "warn"
                            : "scam"
                    }
                  >
                    {!d.hasRecord
                      ? "No data"
                      : d.passed
                        ? "Green"
                        : d.completionPct >= 70
                          ? "Amber"
                          : "Red"}
                  </Badge>
                </div>
                <p className="mt-2 text-senior-sm text-neutral-600">
                  {d.hasRecord
                    ? `${Math.round(d.completionPct)}% complete`
                    : "No milestone recorded yet"}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="actions-heading">
        <h2
          id="actions-heading"
          className="mb-3 text-senior-lg font-semibold text-neutral-900"
        >
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="#add-learner"
            className="flex min-h-touch items-center justify-center rounded-senior border-2 border-trust-500 bg-white px-4 py-3 text-senior-base font-semibold text-trust-700 hover:bg-trust-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
          >
            Add learner
          </Link>
          <Link
            href="#export"
            className="flex min-h-touch items-center justify-center rounded-senior border-2 border-trust-500 bg-white px-4 py-3 text-senior-base font-semibold text-trust-700 hover:bg-trust-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
          >
            Export report
          </Link>
          <Link
            href="/artifacts"
            className="flex min-h-touch items-center justify-center rounded-senior bg-trust-700 px-4 py-3 text-senior-base font-semibold text-white hover:bg-trust-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
          >
            View artifacts gallery
          </Link>
        </div>
      </section>
    </div>
  );
}
