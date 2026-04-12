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

  const completedCount = done.size;
  const totalCount = PRACTICE_SCENARIOS.length;
  const allDone = completedCount === totalCount;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      <div
        className={`rounded-2xl border p-6 shadow-sm sm:p-8 ${
          allDone
            ? "border-success bg-surface"
            : "border-border bg-surface"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden>
            {allDone ? "🎉" : "🎯"}
          </span>
          <div>
            <h2 className="font-display text-[24px] text-text-primary">
              {allDone
                ? "Great job! All scenarios complete!"
                : "Your progress"}
            </h2>
            <p className="text-body text-text-secondary">
              {allDone
                ? "You've completed all practice scenarios. Come back anytime to refresh your skills."
                : `You've completed ${completedCount} of ${totalCount} practice scenarios.`}
            </p>
          </div>
        </div>

        <div
          className="mt-4 h-4 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={totalCount}
          aria-label={`${completedCount} of ${totalCount} scenarios completed`}
        >
          <div
            className={`h-full rounded-full transition-[width] duration-500 ${
              allDone ? "bg-success" : "bg-accent"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

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
    </div>
  );
}
