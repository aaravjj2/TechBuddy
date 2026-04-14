"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "techbuddy-onboarding-dismissed";

export function FirstVisitChecklist() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY) === "true";
    setVisible(!dismissed);
  }, []);

  if (!visible) return null;

  return (
    <section
      aria-label="Getting started"
      className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            New here?
          </p>
          <h2 className="mt-1 font-display text-[24px] text-text-primary">
            Start in under 2 minutes
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "true");
            setVisible(false);
          }}
          className="min-h-[56px] rounded-xl border border-border px-4 text-base font-semibold text-text-secondary hover:bg-surface-hover"
          aria-label="Dismiss getting started guide"
        >
          Hide
        </button>
      </div>

      <ol className="mt-4 space-y-2 text-body text-text-primary">
        <li>1. Try &quot;Is This a Scam?&quot; with a suspicious message.</li>
        <li>
          2. Open &quot;Help With My Phone&quot; for simple step-by-step guides.
        </li>
        <li>3. Use &quot;Practice Mode&quot; to rehearse scam responses safely.</li>
      </ol>
    </section>
  );
}
