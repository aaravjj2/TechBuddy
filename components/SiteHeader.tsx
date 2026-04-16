"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function SiteHeader() {
  const searchParams = useSearchParams();
  const kiosk = searchParams.get("kiosk") === "1";

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[56px] min-w-[56px] items-center justify-center rounded-xl border border-border bg-surface px-5 font-display text-[22px] text-text-primary hover:bg-surface-hover"
        >
          Home
        </Link>
        {!kiosk ? (
          <>
            <Link
              href="/privacy"
              className="inline-flex min-h-[56px] items-center justify-center rounded-xl border border-border bg-surface px-4 text-body text-text-primary hover:bg-surface-hover"
            >
              Privacy
            </Link>
            <Link
              href="/for-centers"
              className="inline-flex min-h-[56px] items-center justify-center rounded-xl border border-border bg-surface px-4 text-body text-text-primary hover:bg-surface-hover"
            >
              For centers
            </Link>
            <Link
              href="/progress"
              className="inline-flex min-h-[56px] items-center justify-center rounded-xl border border-border bg-surface px-4 text-body text-text-primary hover:bg-surface-hover"
            >
              My progress
            </Link>
            <Link
              href="/emergency"
              className="inline-flex min-h-[56px] items-center justify-center rounded-xl border-2 border-danger bg-surface px-4 text-body font-semibold text-danger hover:bg-danger hover:text-white"
            >
              Get help now
            </Link>
          </>
        ) : null}
      </div>
      <p className="font-display text-[22px] text-text-secondary">TechBuddy</p>
    </header>
  );
}
