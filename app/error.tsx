"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="max-w-md text-center">
        <span className="text-5xl" aria-hidden>
          😔
        </span>
        <h1 className="mt-4 font-display text-[32px] text-text-primary">
          Something went wrong
        </h1>
        <p className="mt-3 text-body text-text-secondary">
          We hit an unexpected problem. This is not your fault — try tapping the
          button below, or go back to the home page.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[56px] w-full items-center justify-center rounded-xl bg-accent text-lg font-semibold text-white hover:bg-accent-hover"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[56px] w-full items-center justify-center rounded-xl border border-border bg-surface text-lg font-semibold text-text-primary hover:bg-surface-hover"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
