import * as React from "react";
import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  max = 100,
  label,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.min(Math.max(0, value), max);
  const pct = Math.round((clamped / max) * 100);
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-2 flex items-baseline justify-between text-senior-sm">
          <span className="font-medium">{label}</span>
          <span aria-hidden="true" className="tabular-nums text-neutral-600">
            {pct}%
          </span>
        </div>
      ) : null}
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-neutral-200"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className="h-full rounded-full bg-trust-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
