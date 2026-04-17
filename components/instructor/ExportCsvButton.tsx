"use client";

import { useCallback } from "react";

type Row = {
  name: string;
  email: string;
  lastActive: string;
  sessions: number;
  completionRate: number;
  joined: string;
};

function toCsv(rows: Row[]): string {
  const header = [
    "Name",
    "Email",
    "Last active",
    "Sessions",
    "Completion rate",
    "Joined",
  ];
  const escape = (v: string | number) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const body = rows.map((r) =>
    [
      r.name,
      r.email,
      r.lastActive,
      r.sessions,
      `${Math.round(r.completionRate * 100)}%`,
      r.joined,
    ]
      .map(escape)
      .join(",")
  );
  return [header.join(","), ...body].join("\n");
}

export function ExportCsvButton({ rows }: { rows: Row[] }) {
  const handleExport = useCallback(() => {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learners-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [rows]);

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex min-h-touch items-center justify-center rounded-senior border-2 border-trust-500 bg-white px-4 text-senior-base font-semibold text-trust-700 hover:bg-trust-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
    >
      Export CSV
    </button>
  );
}
