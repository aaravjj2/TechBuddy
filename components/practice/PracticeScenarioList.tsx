"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCompletedScenarios } from "@/lib/practice-storage";
import { PRACTICE_SCENARIOS } from "@/lib/scenarios";

export function PracticeScenarioList() {
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    setDone(new Set(getCompletedScenarios()));
  }, []);

  return (
    <ul className="flex flex-col gap-4">
      {PRACTICE_SCENARIOS.map((s) => {
        const completed = done.has(s.slug);
        return (
          <li key={s.slug}>
            <Link
              href={`/practice/${s.slug}`}
              className="flex min-h-[120px] w-full flex-col justify-center gap-2 rounded-2xl border border-border bg-surface p-6 text-left shadow-sm transition-colors hover:bg-surface-hover"
            >
              <span className="flex items-center gap-2 font-display text-[24px] text-text-primary">
                {completed ? (
                  <span className="text-success" aria-label="Completed">
                    ✓
                  </span>
                ) : (
                  <span className="text-text-secondary" aria-hidden>
                    ○
                  </span>
                )}
                {s.title}
              </span>
              <span className="text-body text-text-secondary">{s.shortDescription}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
