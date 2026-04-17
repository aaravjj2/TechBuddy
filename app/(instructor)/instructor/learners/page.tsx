import { format, formatDistanceToNow } from "date-fns";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LearnerFilters } from "@/components/instructor/LearnerFilters";
import { ExportCsvButton } from "@/components/instructor/ExportCsvButton";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string; status?: string };

const ACTIVE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export default async function LearnersPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").trim();
  const status = (sp.status ?? "all") as "all" | "active" | "inactive";

  const users = await prisma.user.findMany({
    where: {
      role: "SENIOR",
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
            ],
          }
        : {}),
    },
    include: {
      scamChecks: {
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      practiceRuns: {
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      phoneSessions: {
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      metrics: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: {
          scamChecks: true,
          practiceRuns: true,
          phoneSessions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const now = Date.now();
  const enriched = users.map((u) => {
    const lastActiveDate = [
      u.scamChecks[0]?.createdAt,
      u.practiceRuns[0]?.createdAt,
      u.phoneSessions[0]?.createdAt,
    ]
      .filter(Boolean)
      .sort((a, b) => (b as Date).getTime() - (a as Date).getTime())[0] as
      | Date
      | undefined;

    const sessions =
      u._count.scamChecks + u._count.practiceRuns + u._count.phoneSessions;
    const completionRate = u.metrics[0]?.completionRate ?? 0;
    const isActive =
      !!lastActiveDate && now - lastActiveDate.getTime() <= ACTIVE_WINDOW_MS;

    return {
      id: u.id,
      name: u.name ?? "Unnamed learner",
      email: u.email ?? "",
      joined: u.createdAt,
      lastActiveDate,
      sessions,
      completionRate,
      isActive,
    };
  });

  const filtered = enriched.filter((r) => {
    if (status === "active") return r.isActive;
    if (status === "inactive") return !r.isActive;
    return true;
  });

  const csvRows = filtered.map((r) => ({
    name: r.name,
    email: r.email,
    lastActive: r.lastActiveDate ? r.lastActiveDate.toISOString() : "",
    sessions: r.sessions,
    completionRate: r.completionRate,
    joined: r.joined.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-senior-2xl font-semibold text-neutral-900">
            Learners
          </h1>
          <p className="mt-1 text-senior-base text-neutral-700">
            {filtered.length} of {enriched.length} learners shown.
          </p>
        </div>
        <ExportCsvButton rows={csvRows} />
      </header>

      <Card>
        <LearnerFilters />
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-senior-base">
            <caption className="sr-only">
              Senior learners with last activity, total sessions, completion rate
              and join date.
            </caption>
            <thead className="bg-neutral-50">
              <tr className="text-senior-sm uppercase tracking-wide text-neutral-600">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Last active
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Sessions
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Completion rate
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Joined
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-senior-base text-neutral-600"
                  >
                    No learners match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-neutral-200 align-top"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-900">{r.name}</div>
                      {r.email ? (
                        <div className="text-senior-sm text-neutral-600">
                          {r.email}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      {r.lastActiveDate ? (
                        <time dateTime={r.lastActiveDate.toISOString()}>
                          {formatDistanceToNow(r.lastActiveDate, {
                            addSuffix: true,
                          })}
                        </time>
                      ) : (
                        <span className="text-neutral-500">Never</span>
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{r.sessions}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {Math.round(r.completionRate * 100)}%
                    </td>
                    <td className="px-4 py-3">
                      <time dateTime={r.joined.toISOString()}>
                        {format(r.joined, "yyyy-MM-dd")}
                      </time>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={r.isActive ? "safe" : "neutral"}>
                        {r.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
