import { prisma } from "@/lib/prisma";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

type ArtifactOutcomes = string[];
type ArtifactMetrics = Record<string, string | number>;

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default async function AdminResearchPage() {
  const artifacts = await prisma.artifactPage.findMany({
    where: { domain: "Research and Learning" },
    orderBy: { pageNumber: "asc" },
    take: 60,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-senior-2xl font-semibold text-neutral-900">
          Research & learning notes
        </h1>
        <p className="mt-1 text-senior-base text-neutral-700">
          Aggregated research artifacts from the program&apos;s month-by-month
          workbook — {artifacts.length} entries.
        </p>
      </header>

      {artifacts.length === 0 ? (
        <Card tone="warn">
          <CardTitle>No research artifacts yet</CardTitle>
          <CardDescription>
            Once the artifact workbook is seeded with Research & Learning pages,
            they will appear here as cards.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {artifacts.map((a) => {
            const outcomes = parseJson<ArtifactOutcomes>(a.outcomes, []);
            const metrics = parseJson<ArtifactMetrics>(a.metrics, {});
            return (
              <Card key={a.id} tone="calm" className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-senior-sm text-neutral-500">
                      Page {a.pageNumber} · Y{a.year} M{a.monthInYear} · Q
                      {a.quarter}
                    </p>
                    <CardTitle className="mt-1">{a.title}</CardTitle>
                  </div>
                  <Badge tone="info">Research</Badge>
                </div>
                <CardDescription>{a.primaryGoal}</CardDescription>

                {outcomes.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-senior-sm font-semibold text-neutral-800">
                      Outcomes
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-senior-sm text-neutral-700">
                      {outcomes.slice(0, 4).map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {Object.keys(metrics).length > 0 ? (
                  <dl className="mt-4 grid grid-cols-2 gap-2 text-senior-sm">
                    {Object.entries(metrics)
                      .slice(0, 4)
                      .map(([k, v]) => (
                        <div
                          key={k}
                          className="rounded-senior bg-neutral-50 p-2"
                        >
                          <dt className="text-neutral-500">{k}</dt>
                          <dd className="font-medium text-neutral-900">{String(v)}</dd>
                        </div>
                      ))}
                  </dl>
                ) : null}

                <p className="mt-auto pt-4 text-senior-sm italic text-neutral-600">
                  DoD: {a.dod}
                </p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
