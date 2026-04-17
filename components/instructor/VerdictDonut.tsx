"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Slice = { name: string; value: number };

const COLORS: Record<string, string> = {
  safe: "#22c55e",
  likely_safe: "#22c55e",
  scam: "#ef4444",
  likely_scam: "#ef4444",
  uncertain: "#eab308",
  unknown: "#a1a1aa",
};

function colorFor(name: string, idx: number) {
  const key = name.toLowerCase().replace(/\s+/g, "_");
  if (COLORS[key]) return COLORS[key];
  const fallback = ["#3b82f6", "#a855f7", "#ef4444", "#22c55e", "#eab308", "#14b8a6"];
  return fallback[idx % fallback.length];
}

function prettyName(name: string) {
  return name.replace(/_/g, " ");
}

export function VerdictDonut({ data }: { data: Slice[] }) {
  const total = data.reduce((a, d) => a + d.value, 0);

  if (total === 0) {
    return (
      <figure>
        <p
          role="img"
          aria-label="No scam check data available yet."
          className="flex h-56 w-full items-center justify-center rounded-senior border-2 border-dashed border-neutral-300 text-senior-sm text-neutral-500"
        >
          No scam checks yet
        </p>
        <figcaption className="mt-2 text-senior-sm text-neutral-600">
          Donut chart will appear once the first scam checks are recorded.
        </figcaption>
      </figure>
    );
  }

  const summary = data
    .map((d) => `${prettyName(d.name)} ${Math.round((d.value / total) * 100)}%`)
    .join(", ");

  return (
    <figure>
      <div
        role="img"
        aria-label={`Verdict distribution donut: ${summary}. Total ${total} checks.`}
        className="h-56 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={colorFor(entry.name, i)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                String(value),
                prettyName(String(name)),
              ]}
              contentStyle={{
                borderRadius: 12,
                fontSize: 16,
                border: "1px solid #d4d4d8",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 14 }}
              formatter={(v) => prettyName(String(v))}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="mt-2 text-senior-sm text-neutral-600">
        {total} recent scam checks shown. {summary}.
      </figcaption>
    </figure>
  );
}
