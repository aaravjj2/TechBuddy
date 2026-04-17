import { prisma } from "@/lib/prisma";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

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

function monthLabel(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

type Status = "green" | "amber" | "red" | "none";

const STATUS_STYLES: Record<Status, { bg: string; label: string; letter: string }> = {
  green: {
    bg: "bg-safe-500 text-white",
    label: "Green — passed gate target",
    letter: "G",
  },
  amber: {
    bg: "bg-warn-500 text-neutral-900",
    label: "Amber — at risk",
    letter: "A",
  },
  red: {
    bg: "bg-scam-500 text-white",
    label: "Red — off target",
    letter: "R",
  },
  none: {
    bg: "bg-neutral-200 text-neutral-500",
    label: "No record",
    letter: "–",
  },
};

export default async function AdminGovernancePage() {
  const now = new Date();
  const months: string[] = [];
  for (let i = 35; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(monthLabel(d));
  }

  const records = await prisma.milestoneRecord.findMany({
    where: { month: { in: months } },
    orderBy: { createdAt: "desc" },
  });

  const cell = new Map<string, Status>();
  for (const r of records) {
    const key = `${r.month}::${r.domain}`;
    if (cell.has(key)) continue;
    const gate = r.gateTarget ?? GATE_TARGET;
    const s: Status =
      r.completionPct >= gate
        ? "green"
        : r.completionPct >= 70
          ? "amber"
          : "red";
    cell.set(key, s);
  }

  const totals = { green: 0, amber: 0, red: 0, none: 0 };
  for (const m of months) {
    for (const d of DOMAINS) {
      const s = cell.get(`${m}::${d}`) ?? "none";
      totals[s] += 1;
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-senior-2xl font-semibold text-neutral-900">
          Governance grid
        </h1>
        <p className="mt-1 text-senior-base text-neutral-700">
          36 months × 10 domains. Each cell shows the latest milestone status
          recorded for that month.
        </p>
      </header>

      <Card>
        <CardTitle>Overall coverage</CardTitle>
        <CardDescription>
          Green {totals.green}, Amber {totals.amber}, Red {totals.red}, No record{" "}
          {totals.none} of {months.length * DOMAINS.length} cells.
        </CardDescription>
        <ul className="mt-4 flex flex-wrap gap-3 text-senior-sm">
          {(["green", "amber", "red", "none"] as Status[]).map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`inline-block h-5 w-5 rounded ${STATUS_STYLES[s].bg}`}
              />
              <span>{STATUS_STYLES[s].label}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-senior-sm">
            <caption className="sr-only">
              Governance grid: milestone status per month and domain. Statuses
              are Green (passed), Amber (at risk), Red (off target) or – (no
              record).
            </caption>
            <thead className="bg-neutral-50">
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-neutral-50 px-3 py-2 text-left font-semibold text-neutral-800"
                >
                  Month
                </th>
                {DOMAINS.map((d) => (
                  <th
                    key={d}
                    scope="col"
                    className="min-w-[7rem] px-2 py-2 font-semibold text-neutral-800"
                    title={d}
                  >
                    <span className="block max-w-[7rem] truncate">{d}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m} className="border-t border-neutral-200">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-white px-3 py-2 text-left font-medium text-neutral-900"
                  >
                    {m}
                  </th>
                  {DOMAINS.map((d) => {
                    const s = cell.get(`${m}::${d}`) ?? "none";
                    const st = STATUS_STYLES[s];
                    return (
                      <td key={`${m}-${d}`} className="px-2 py-1">
                        <span
                          role="img"
                          aria-label={`${m}, ${d}: ${st.label}`}
                          className={`inline-flex h-8 w-full min-w-[2rem] items-center justify-center rounded font-semibold ${st.bg}`}
                        >
                          {st.letter}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
