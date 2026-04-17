"use client";

import * as React from "react";
import { use } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const DOMAINS = [
  "Frontend Experience and Design",
  "Accessibility and Inclusion",
  "AI Safety and Content",
  "Backend and Data",
  "Privacy and Security",
  "Operations and Reliability",
  "Partnerships and Community Centers",
  "Research and Learning",
  "Impact and Measurement",
  "Governance and Program",
] as const;

const DOMAIN_COLOR: Record<string, string> = {
  "Frontend Experience and Design": "border-l-trust-500 bg-trust-50",
  "Accessibility and Inclusion": "border-l-calm-500 bg-calm-50",
  "AI Safety and Content": "border-l-scam-500 bg-scam-50",
  "Backend and Data": "border-l-trust-700 bg-trust-50",
  "Privacy and Security": "border-l-warn-700 bg-warn-50",
  "Operations and Reliability": "border-l-safe-700 bg-safe-50",
  "Partnerships and Community Centers": "border-l-calm-500 bg-calm-50",
  "Research and Learning": "border-l-warn-500 bg-warn-50",
  "Impact and Measurement": "border-l-safe-500 bg-safe-50",
  "Governance and Program": "border-l-neutral-500 bg-neutral-50",
};

type Artifact = {
  id: string;
  pageNumber: number;
  year: number;
  monthInYear: number;
  globalMonth: number;
  quarter: number;
  domain: string;
  title: string;
  primaryGoal: string;
  outcomes: string[];
  metrics: Record<string, number | string>;
  risks: Array<{ risk: string; mitigation: string; owner?: string }>;
  dod: string;
};

type GalleryState = {
  year: "all" | 1 | 2 | 3;
  month: number; // 1..36 or 0 = all
  domains: string[];
  q: string;
  view: "grid" | "list";
  page: number;
};

export function ArtifactsGallery({
  initialParams,
}: {
  initialParams: Promise<{
    year?: string;
    month?: string;
    domain?: string;
    q?: string;
    view?: string;
  }>;
}) {
  const seed = use(initialParams);

  const [state, setState] = React.useState<GalleryState>(() => ({
    year: (() => {
      const y = Number(seed.year);
      return y === 1 || y === 2 || y === 3 ? (y as 1 | 2 | 3) : "all";
    })(),
    month: Math.max(0, Math.min(36, Number(seed.month) || 0)),
    domains: seed.domain ? [decodeURIComponent(seed.domain)] : [],
    q: seed.q ?? "",
    view: seed.view === "list" ? "list" : "grid",
    page: 1,
  }));
  const [data, setData] = React.useState<{
    items: Artifact[];
    total: number;
    totalPages: number;
  }>({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = React.useState(true);
  const [openId, setOpenId] = React.useState<string | null>(null);

  // Build query string for fetching
  const qs = React.useMemo(() => {
    const sp = new URLSearchParams();
    if (state.year !== "all") sp.set("year", String(state.year));
    if (state.month > 0) sp.set("month", String(state.month));
    if (state.domains.length === 1) sp.set("domain", state.domains[0]);
    if (state.q.trim()) sp.set("q", state.q.trim());
    sp.set("page", String(state.page));
    sp.set("limit", "24");
    return sp.toString();
  }, [state]);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/v1/artifacts?${qs}`)
      .then((r) => r.json())
      .then((json) => {
        if (!alive) return;
        if (json?.data) {
          // client-side filter for multi-domain since API takes a single domain
          const allItems = json.data.items as Artifact[];
          const filtered =
            state.domains.length > 1
              ? allItems.filter((i) => state.domains.includes(i.domain))
              : allItems;
          setData({
            items: filtered,
            total:
              state.domains.length > 1 ? filtered.length : json.data.total,
            totalPages: json.data.totalPages,
          });
        }
      })
      .catch(() => {
        if (alive) setData({ items: [], total: 0, totalPages: 1 });
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [qs, state.domains]);

  const resetFilters = () =>
    setState({ year: "all", month: 0, domains: [], q: "", view: state.view, page: 1 });

  const current = data.items.find((i) => i.id === openId) ?? null;
  const openIndex = current ? data.items.findIndex((i) => i.id === current.id) : -1;
  const openPrev = () => {
    if (openIndex > 0) setOpenId(data.items[openIndex - 1].id);
  };
  const openNext = () => {
    if (openIndex !== -1 && openIndex < data.items.length - 1)
      setOpenId(data.items[openIndex + 1].id);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      {/* Filters sidebar */}
      <aside
        aria-label="Filter artifacts"
        className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto"
      >
        <div>
          <label
            htmlFor="artifact-search"
            className="block text-senior-sm font-semibold text-neutral-900"
          >
            Search
          </label>
          <input
            id="artifact-search"
            type="search"
            value={state.q}
            onChange={(e) =>
              setState((s) => ({ ...s, q: e.target.value, page: 1 }))
            }
            placeholder="Try: scam, privacy, onboarding"
            className="mt-2 w-full rounded-senior border-2 border-neutral-300 px-4 py-3 text-senior-base focus:border-trust-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500/40"
          />
        </div>

        <fieldset>
          <legend className="text-senior-sm font-semibold text-neutral-900">
            Year
          </legend>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
            {(["all", 1, 2, 3] as const).map((y) => (
              <label
                key={String(y)}
                className={cn(
                  "inline-flex min-h-touch cursor-pointer items-center gap-2 rounded-senior border-2 px-4 py-2 text-senior-sm transition",
                  state.year === y
                    ? "border-trust-500 bg-trust-50 text-trust-900"
                    : "border-neutral-300 bg-white hover:border-trust-500"
                )}
              >
                <input
                  type="radio"
                  name="year"
                  value={String(y)}
                  checked={state.year === y}
                  onChange={() =>
                    setState((s) => ({ ...s, year: y, page: 1 }))
                  }
                  className="sr-only"
                />
                {y === "all" ? "All years" : `Year ${y}`}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="month-slider"
            className="block text-senior-sm font-semibold text-neutral-900"
          >
            Global month {state.month > 0 ? `· ${state.month}` : "· all"}
          </label>
          <input
            id="month-slider"
            type="range"
            min={0}
            max={36}
            step={1}
            value={state.month}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                month: Number(e.target.value),
                page: 1,
              }))
            }
            className="mt-3 w-full accent-trust-500"
            aria-valuemin={0}
            aria-valuemax={36}
            aria-valuenow={state.month}
          />
          <div className="mt-1 flex justify-between text-senior-sm text-neutral-600">
            <span>All</span>
            <span>36</span>
          </div>
        </div>

        <fieldset>
          <legend className="text-senior-sm font-semibold text-neutral-900">
            Domains
          </legend>
          <div className="mt-2 space-y-2">
            {DOMAINS.map((d) => {
              const checked = state.domains.includes(d);
              return (
                <label
                  key={d}
                  className="flex min-h-touch items-center gap-3 rounded-senior px-2 py-1 text-senior-sm text-neutral-800 hover:bg-neutral-50"
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-neutral-400 text-trust-700 focus:ring-trust-500"
                    checked={checked}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        domains: e.target.checked
                          ? [...s.domains, d]
                          : s.domains.filter((x) => x !== d),
                        page: 1,
                      }))
                    }
                  />
                  {d}
                </label>
              );
            })}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={resetFilters}
          className="text-senior-sm font-semibold text-trust-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500/40"
        >
          Reset all filters
        </button>
      </aside>

      {/* Main content */}
      <section aria-label="Artifact results">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <p
            role="status"
            aria-live="polite"
            className="text-senior-base text-neutral-800"
          >
            {loading
              ? "Loading briefs…"
              : `Showing ${data.items.length} of ${data.total} ${data.total === 1 ? "brief" : "briefs"}`}
          </p>
          <div className="inline-flex rounded-senior border border-neutral-300 p-1" role="group" aria-label="Layout">
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, view: "grid" }))}
              className={cn(
                "min-h-touch px-4 text-senior-sm",
                state.view === "grid"
                  ? "bg-trust-700 text-white rounded"
                  : "text-neutral-700"
              )}
              aria-pressed={state.view === "grid"}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, view: "list" }))}
              className={cn(
                "min-h-touch px-4 text-senior-sm",
                state.view === "list"
                  ? "bg-trust-700 text-white rounded"
                  : "text-neutral-700"
              )}
              aria-pressed={state.view === "list"}
            >
              List
            </button>
          </div>
        </div>

        {!loading && data.items.length === 0 ? (
          <Card tone="trust">
            <h2 className="text-senior-lg font-semibold">No briefs match these filters.</h2>
            <p className="mt-2 text-senior-base text-neutral-700">
              Try clearing a filter, or reset all filters to see every page.
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={resetFilters}
            >
              Reset filters
            </Button>
          </Card>
        ) : (
          <ul
            className={cn(
              state.view === "grid"
                ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                : "flex flex-col gap-3"
            )}
          >
            {data.items.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(a.id)}
                  className={cn(
                    "group flex w-full flex-col items-start gap-3 rounded-2xl border-l-4 bg-white p-5 text-left shadow-sm ring-1 ring-black/5 transition",
                    DOMAIN_COLOR[a.domain] ?? "border-l-neutral-300",
                    "hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500/50"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="trust">Page {a.pageNumber}</Badge>
                    <Badge tone="neutral">Year {a.year}</Badge>
                    <Badge tone="info">Month {a.monthInYear}</Badge>
                    <Badge tone="neutral">Q{a.quarter}</Badge>
                  </div>
                  <span className="text-senior-sm font-semibold uppercase tracking-wide text-neutral-600">
                    {a.domain}
                  </span>
                  <h3 className="text-senior-lg font-semibold leading-snug text-neutral-900 group-hover:text-trust-900">
                    {a.title}
                  </h3>
                  <p className="line-clamp-2 text-senior-base text-neutral-700">
                    {a.primaryGoal}
                  </p>
                  <span className="mt-auto text-senior-sm font-semibold text-trust-700">
                    View brief →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {data.totalPages > 1 && state.domains.length <= 1 ? (
          <nav
            className="mt-6 flex items-center justify-between"
            aria-label="Artifact pagination"
          >
            <Button
              variant="secondary"
              size="sm"
              disabled={state.page <= 1}
              onClick={() => setState((s) => ({ ...s, page: s.page - 1 }))}
            >
              Previous
            </Button>
            <span className="text-senior-sm text-neutral-700">
              Page {state.page} of {data.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={state.page >= data.totalPages}
              onClick={() => setState((s) => ({ ...s, page: s.page + 1 }))}
            >
              Next
            </Button>
          </nav>
        ) : null}
      </section>

      <Dialog.Root open={!!current} onOpenChange={(o) => !o && setOpenId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl outline-none focus:outline-none"
            aria-describedby="artifact-primary-goal"
          >
            {current ? (
              <div className="space-y-4">
                <header className={cn("rounded-xl border-l-4 p-4", DOMAIN_COLOR[current.domain] ?? "border-l-neutral-300 bg-neutral-50")}>
                  <p className="text-senior-sm font-semibold uppercase tracking-wider text-neutral-600">
                    {current.domain} · Year {current.year} · Month {current.monthInYear} · Q{current.quarter}
                  </p>
                  <Dialog.Title className="mt-1 text-senior-xl font-bold text-neutral-900">
                    {current.title}
                  </Dialog.Title>
                </header>
                <section>
                  <h3 className="text-senior-base font-semibold text-neutral-900">Primary goal</h3>
                  <p id="artifact-primary-goal" className="mt-1 text-senior-base text-neutral-800">
                    {current.primaryGoal}
                  </p>
                </section>
                <section>
                  <h3 className="text-senior-base font-semibold text-neutral-900">Outcomes</h3>
                  <ol className="ml-5 mt-1 list-decimal space-y-1 text-senior-base text-neutral-800">
                    {current.outcomes.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ol>
                </section>
                <section>
                  <h3 className="text-senior-base font-semibold text-neutral-900">Metrics</h3>
                  <table className="mt-1 w-full overflow-hidden rounded-xl text-left text-senior-sm">
                    <thead className="bg-neutral-100 text-neutral-700">
                      <tr>
                        <th className="px-3 py-2">Key</th>
                        <th className="px-3 py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(current.metrics).map(([k, v]) => (
                        <tr key={k} className="border-t border-neutral-200">
                          <td className="px-3 py-2 font-medium">{k}</td>
                          <td className="px-3 py-2 tabular-nums text-neutral-800">
                            {typeof v === "number" ? v : String(v)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
                <section>
                  <h3 className="text-senior-base font-semibold text-neutral-900">Risks &amp; mitigations</h3>
                  <ul className="mt-1 space-y-3">
                    {current.risks.map((r, i) => (
                      <li key={i} className="rounded-xl bg-warn-50 p-3">
                        <p className="text-senior-sm font-semibold text-warn-700">{r.risk}</p>
                        <p className="mt-1 text-senior-sm text-neutral-800">
                          <span className="font-semibold">Mitigation:</span> {r.mitigation}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="rounded-xl bg-safe-50 p-4">
                  <h3 className="text-senior-base font-semibold text-safe-700">Definition of done</h3>
                  <p className="mt-1 text-senior-base text-neutral-800">{current.dod}</p>
                </section>

                <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={openPrev}
                      disabled={openIndex <= 0}
                    >
                      ← Prev
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={openNext}
                      disabled={
                        openIndex === -1 || openIndex >= data.items.length - 1
                      }
                    >
                      Next →
                    </Button>
                  </div>
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="sm">Close</Button>
                  </Dialog.Close>
                </footer>
              </div>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
