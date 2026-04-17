import * as React from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "trust" | "safe" | "warn" | "scam" | "calm";

const BORDER: Record<Tone, string> = {
  neutral: "border-l-4 border-l-neutral-200",
  trust: "border-l-4 border-l-trust-500",
  safe: "border-l-4 border-l-safe-500",
  warn: "border-l-4 border-l-warn-500",
  scam: "border-l-4 border-l-scam-500",
  calm: "border-l-4 border-l-calm-500",
};

export function Card({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: Tone }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5",
        BORDER[tone],
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-senior-lg font-semibold text-neutral-900", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-2 text-senior-base text-neutral-700", className)}
      {...props}
    />
  );
}
