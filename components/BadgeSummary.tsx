"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ALL_BADGES, getProgress } from "@/lib/progress";

export function BadgeSummary() {
  const [badgeCount, setBadgeCount] = useState(0);
  const totalBadges = ALL_BADGES.length;

  useEffect(() => {
    const progress = getProgress();
    setBadgeCount(progress.badges.length);
  }, []);

  if (badgeCount === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Your achievements
          </p>
          <p className="mt-1 font-display text-[22px] text-text-primary">
            {badgeCount} of {totalBadges} badges earned
          </p>
        </div>
        <Link
          href="/progress"
          className="inline-flex min-h-[56px] items-center rounded-xl bg-accent px-6 text-lg font-semibold text-white hover:bg-accent-hover"
        >
          View badges
        </Link>
      </div>
    </div>
  );
}
