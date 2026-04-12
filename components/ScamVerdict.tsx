import type { ScamCheckResult } from "@/lib/types";

function ListSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="font-display text-[20px] text-text-primary">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-body text-text-primary">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export type ScamVerdictProps = {
  result: ScamCheckResult;
  /** When the first action step is shown separately (e.g. primary callout), omit it from the list. */
  omitFirstActionStep?: boolean;
};

export function ScamVerdict({
  result,
  omitFirstActionStep = false,
}: ScamVerdictProps) {
  const { verdict, headline, explanation, warning_signs, action_steps, already_clicked } =
    result;

  const displayedSteps =
    omitFirstActionStep && action_steps?.length
      ? action_steps.slice(1)
      : action_steps ?? [];

  const borderAccent =
    verdict === "SAFE"
      ? "border-success"
      : verdict === "SCAM"
        ? "border-danger"
        : "border-warning";

  const icon =
    verdict === "SAFE" ? "✅" : verdict === "SCAM" ? "🚨" : "⚠️";

  const statusLabel =
    verdict === "SAFE"
      ? "Safe"
      : verdict === "SCAM"
        ? "Scam risk"
        : "Suspicious";

  return (
    <section
      className={`rounded-2xl border-2 ${borderAccent} bg-surface p-8 shadow-sm`}
      aria-labelledby="verdict-headline"
    >
      <div className="flex flex-wrap items-start gap-3">
        <span className="text-3xl" aria-hidden>
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
            {statusLabel}
          </p>
          <h2 id="verdict-headline" className="font-display text-[28px] text-text-primary">
            {headline}
          </h2>
        </div>
      </div>
      <p className="mt-4 text-body text-text-primary">{explanation}</p>

      {warning_signs && warning_signs.length > 0 ? (
        <ListSection title="Warning signs" items={warning_signs} />
      ) : null}

      {displayedSteps && displayedSteps.length > 0 ? (
        <div className="mt-6 border-t border-border pt-4">
          <p className="font-display text-[20px] text-text-primary">
            {verdict === "SCAM"
              ? omitFirstActionStep
                ? "Then:"
                : "What to do right now:"
              : verdict === "SUSPICIOUS"
                ? omitFirstActionStep
                  ? "Then:"
                  : "What to do:"
                : "Tips:"}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-body text-text-primary">
            {displayedSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {verdict === "SCAM" && already_clicked ? (
        <div className="mt-4 rounded-xl bg-bg p-4 text-body text-text-primary">
          <p className="font-semibold">If you already clicked or shared info:</p>
          <p className="mt-1">{already_clicked}</p>
        </div>
      ) : null}
    </section>
  );
}
