import * as React from "react";
import { cn } from "@/lib/cn";

export function ConfidenceGauge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const clamped = Math.min(Math.max(0, Math.round(score)), 100);
  const tone =
    clamped >= 80
      ? "bg-safe-500"
      : clamped >= 50
        ? "bg-warn-500"
        : "bg-scam-500";
  const label =
    clamped >= 80 ? "High confidence" : clamped >= 50 ? "Medium confidence" : "Low confidence";
  return (
    <div className={cn("space-y-2", className)} aria-live="polite">
      <div className="flex items-baseline justify-between text-senior-base">
        <span className="font-semibold">Confidence</span>
        <span className="tabular-nums">{clamped}%</span>
      </div>
      <div
        className="h-4 w-full overflow-hidden rounded-full bg-neutral-200 ring-1 ring-black/5"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Confidence ${clamped}% — ${label}`}
      >
        <div
          className={cn("h-full transition-all duration-500", tone)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="text-senior-sm text-neutral-700">{label}. This is a guide, not a guarantee.</p>
    </div>
  );
}
