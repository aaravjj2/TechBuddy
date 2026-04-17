"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ActivityRow = {
  month: string;
  scam: number;
  practice: number;
  phone: number;
};

export function ActivityChart({ data }: { data: ActivityRow[] }) {
  const totalScam = data.reduce((a, d) => a + d.scam, 0);
  const totalPractice = data.reduce((a, d) => a + d.practice, 0);
  const totalPhone = data.reduce((a, d) => a + d.phone, 0);

  return (
    <figure>
      <div
        role="img"
        aria-label={`Stacked bar chart of last ${data.length} months of activity. Total scam checks ${totalScam}, practice sessions ${totalPractice}, phone help ${totalPhone}.`}
        className="h-72 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 14 }} />
            <YAxis tick={{ fontSize: 14 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                fontSize: 16,
                border: "1px solid #d4d4d8",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 14 }}
              formatter={(v) =>
                v === "scam"
                  ? "Scam checks"
                  : v === "practice"
                    ? "Practice sessions"
                    : "Phone help"
              }
            />
            <Bar dataKey="scam" stackId="a" fill="#ef4444" />
            <Bar dataKey="practice" stackId="a" fill="#3b82f6" />
            <Bar dataKey="phone" stackId="a" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="mt-2 text-senior-sm text-neutral-600">
        Monthly activity across scam checks, practice sessions, and phone help
        for the last {data.length} months.
      </figcaption>
    </figure>
  );
}
