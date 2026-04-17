import * as React from "react";
import { cn } from "@/lib/cn";

type Tone =
  | "safe"
  | "scam"
  | "uncertain"
  | "info"
  | "neutral"
  | "trust"
  | "warn";

const STYLES: Record<Tone, string> = {
  safe: "bg-safe-100 text-safe-700 ring-safe-500/30",
  scam: "bg-scam-100 text-scam-700 ring-scam-500/30",
  uncertain: "bg-warn-100 text-warn-700 ring-warn-500/30",
  warn: "bg-warn-100 text-warn-700 ring-warn-500/30",
  info: "bg-trust-50 text-trust-700 ring-trust-500/30",
  trust: "bg-trust-100 text-trust-900 ring-trust-500/40",
  neutral: "bg-neutral-100 text-neutral-700 ring-neutral-300",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  ...rest
}: {
  tone?: Tone;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-senior-sm font-medium ring-1",
        STYLES[tone],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
