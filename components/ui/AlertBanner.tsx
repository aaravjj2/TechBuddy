"use client";

import { cn } from "@/lib/cn";

type Tone = "trust" | "warn" | "scam" | "safe";

const tones: Record<
  Tone,
  { box: string; border: string; title: string; body: string }
> = {
  trust: {
    box: "bg-trust-50",
    border: "border-l-4 border-trust-500",
    title: "text-trust-900",
    body: "text-trust-700",
  },
  warn: {
    box: "bg-warn-50",
    border: "border-l-4 border-warn-500",
    title: "text-warn-700",
    body: "text-warn-700",
  },
  scam: {
    box: "bg-scam-50",
    border: "border-l-4 border-scam-500",
    title: "text-scam-700",
    body: "text-scam-700",
  },
  safe: {
    box: "bg-safe-50",
    border: "border-l-4 border-safe-500",
    title: "text-safe-700",
    body: "text-safe-700",
  },
};

export type AlertBannerProps = {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
  /** When true, uses role="alert" for urgent messages */
  assertive?: boolean;
  className?: string;
};

export function AlertBanner({
  tone = "trust",
  title,
  children,
  assertive = false,
  className,
}: AlertBannerProps) {
  const t = tones[tone];
  return (
    <div
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      className={cn(
        "rounded-senior p-4 text-senior-base",
        t.box,
        t.border,
        className
      )}
    >
      {title ? (
        <p className={cn("font-semibold", t.title)}>{title}</p>
      ) : null}
      <div className={cn(title ? "mt-2" : "", t.body)}>{children}</div>
    </div>
  );
}
