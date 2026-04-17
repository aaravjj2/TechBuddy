import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const centers = await prisma.communityCenter.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      coordinator: { select: { name: true, email: true } },
      _count: { select: { learners: true } },
    },
  });

  const ACTIVE_WINDOW = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const activeByCenter = await Promise.all(
    centers.map(async (c) => {
      const activeLearners = await prisma.user.count({
        where: {
          centerId: c.id,
          role: "SENIOR",
          OR: [
            { scamChecks: { some: { createdAt: { gte: ACTIVE_WINDOW } } } },
            { practiceRuns: { some: { createdAt: { gte: ACTIVE_WINDOW } } } },
            { phoneSessions: { some: { createdAt: { gte: ACTIVE_WINDOW } } } },
          ],
        },
      });
      return [c.id, activeLearners] as const;
    })
  );
  const activeMap = new Map(activeByCenter);

  function statusFor(
    total: number,
    active: number,
    coordinatorId: string | null
  ): { label: string; tone: "safe" | "warn" | "scam" | "neutral" } {
    if (!coordinatorId) return { label: "Needs coordinator", tone: "warn" };
    if (total === 0) return { label: "Onboarding", tone: "neutral" };
    const ratio = active / Math.max(1, total);
    if (ratio >= 0.4) return { label: "Thriving", tone: "safe" };
    if (ratio >= 0.15) return { label: "Active", tone: "safe" };
    if (ratio > 0) return { label: "Low engagement", tone: "warn" };
    return { label: "Dormant", tone: "scam" };
  }

  const totalLearners = centers.reduce((a, c) => a + c._count.learners, 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-senior-2xl font-semibold text-neutral-900">
          Community partners
        </h1>
        <p className="mt-1 text-senior-base text-neutral-700">
          {centers.length} centers, {totalLearners} enrolled learners.
        </p>
      </header>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-senior-base">
            <caption className="sr-only">
              Community centers with their coordinator, learner count, and
              status.
            </caption>
            <thead className="bg-neutral-50">
              <tr className="text-senior-sm uppercase tracking-wide text-neutral-600">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Center
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Coordinator
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Learners
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Active (30d)
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Added
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {centers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-senior-base text-neutral-600"
                  >
                    No community centers have been added yet.
                  </td>
                </tr>
              ) : (
                centers.map((c) => {
                  const active = activeMap.get(c.id) ?? 0;
                  const s = statusFor(
                    c._count.learners,
                    active,
                    c.coordinatorId
                  );
                  return (
                    <tr
                      key={c.id}
                      className="border-t border-neutral-200 align-top"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-neutral-900">
                          {c.name}
                        </div>
                        <div className="text-senior-sm text-neutral-600">
                          {c.city}, {c.state}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {c.coordinator ? (
                          <>
                            <div className="text-neutral-900">
                              {c.coordinator.name ?? "Unnamed"}
                            </div>
                            <div className="text-senior-sm text-neutral-600">
                              {c.coordinator.email ?? ""}
                            </div>
                          </>
                        ) : (
                          <span className="text-neutral-500">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {c._count.learners}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{active}</td>
                      <td className="px-4 py-3">
                        <time dateTime={c.createdAt.toISOString()}>
                          {format(c.createdAt, "yyyy-MM-dd")}
                        </time>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={s.tone}>{s.label}</Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
