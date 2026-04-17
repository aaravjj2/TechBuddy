"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type DomainRow = {
  domain: string;
  completionPct: number;
  gateTarget: number;
  passed: boolean;
  status: "red" | "amber" | "green";
};

type TrendRow = {
  month: string;
  taskSuccessRate: number;
  completionRate: number;
};

type ImpactResponse = {
  data: {
    month: string;
    domains: DomainRow[];
    trend: TrendRow[];
  };
};

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function InstructorImpactPage() {
  const [month, setMonth] = useState<string>(currentMonth());
  const [domains, setDomains] = useState<DomainRow[]>([]);
  const [trend, setTrend] = useState<TrendRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const fetchImpact = useCallback(async (m: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/analytics/impact?month=${m}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = (await res.json()) as ImpactResponse;
      setDomains(json.data.domains);
      setTrend(json.data.trend);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load impact data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImpact(month);
  }, [month, fetchImpact]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  async function publishBrief() {
    setPublishing(true);
    try {
      const res = await fetch("/api/v1/analytics/milestone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          domain: "Impact Measurement and Reporting",
          completionPct: 100,
          notes: `Impact brief published for ${month}`,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        throw new Error(body?.error?.message ?? "Publish failed.");
      }
      setToast("Published!");
      fetchImpact(month);
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Publish failed.");
    } finally {
      setPublishing(false);
    }
  }

  const greens = domains.filter((d) => d.status === "green").length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-senior-2xl font-semibold text-neutral-900">
            Impact
          </h1>
          <p className="mt-1 text-senior-base text-neutral-700">
            Monthly outcomes across the 10 program domains, plus the 12-month
            trend.
          </p>
        </div>
        <div className="flex items-end gap-3">
          <div>
            <label
              htmlFor="impact-month"
              className="block text-senior-sm font-medium text-neutral-800"
            >
              Month
            </label>
            <input
              id="impact-month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              max={currentMonth()}
              className="mt-1 min-h-touch rounded-senior border-2 border-neutral-300 bg-white px-4 text-senior-base text-neutral-900 focus:border-trust-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
            />
          </div>
          <button
            type="button"
            onClick={publishBrief}
            disabled={publishing}
            aria-busy={publishing || undefined}
            className="inline-flex min-h-touch items-center justify-center rounded-senior bg-trust-700 px-5 text-senior-base font-semibold text-white hover:bg-trust-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {publishing ? "Publishing…" : "Publish impact brief"}
          </button>
        </div>
      </header>

      {error ? (
        <Card tone="scam" role="alert">
          <CardTitle>Could not load impact data</CardTitle>
          <CardDescription>{error}</CardDescription>
        </Card>
      ) : null}

      <Card>
        <CardTitle>12-month trend</CardTitle>
        <CardDescription>
          Average task success rate and completion rate by month.
        </CardDescription>
        <figure className="mt-4">
          <div
            role="img"
            aria-label={`Line chart showing average task success rate and completion rate over the last ${trend.length} months.`}
            className="h-72 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trend}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 14 }} />
                <YAxis
                  domain={[0, 1]}
                  tickFormatter={(v) => `${Math.round(v * 100)}%`}
                  tick={{ fontSize: 14 }}
                />
                <Tooltip
                  formatter={(v) =>
                    `${Math.round(Number(v) * 100)}%`
                  }
                  contentStyle={{
                    borderRadius: 12,
                    fontSize: 16,
                    border: "1px solid #d4d4d8",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 14 }}
                  formatter={(v) =>
                    v === "taskSuccessRate"
                      ? "Task success rate"
                      : "Completion rate"
                  }
                />
                <Line
                  type="monotone"
                  dataKey="taskSuccessRate"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <figcaption className="mt-2 text-senior-sm text-neutral-600">
            Trend data from LearnerMetric records over the last 12 months.
          </figcaption>
        </figure>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Domain milestones for {month}</CardTitle>
            <CardDescription>
              RAG rating per domain — Red under 70%, Amber 70–84%, Green 85% or
              higher.
            </CardDescription>
          </div>
          <Badge tone={greens >= 7 ? "safe" : greens >= 4 ? "warn" : "scam"}>
            {greens} green
          </Badge>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-senior-base">
            <caption className="sr-only">
              Milestone status for each program domain in {month}.
            </caption>
            <thead className="bg-neutral-50">
              <tr className="text-senior-sm uppercase tracking-wide text-neutral-600">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Domain
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Completion
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Gate target
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && domains.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-600">
                    Loading…
                  </td>
                </tr>
              ) : domains.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-600">
                    No milestones recorded for {month}.
                  </td>
                </tr>
              ) : (
                domains.map((d) => (
                  <tr key={d.domain} className="border-t border-neutral-200">
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {d.domain}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {Math.round(d.completionPct)}%
                    </td>
                    <td className="px-4 py-3 tabular-nums">{d.gateTarget}%</td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={
                          d.status === "green"
                            ? "safe"
                            : d.status === "amber"
                              ? "warn"
                              : "scam"
                        }
                      >
                        {d.status === "green"
                          ? "Green (on target)"
                          : d.status === "amber"
                            ? "Amber (at risk)"
                            : "Red (off target)"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 rounded-senior bg-trust-900 px-4 py-3 text-senior-base font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
