"use client";

import { useEffect, useState } from "react";
import { ALL_BADGES, getProgress, getTotalProgress, type UserProgress } from "@/lib/progress";

export function BadgeDisplay() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) return null;

  const { percentage } = getTotalProgress(progress);
  const earnedBadges = ALL_BADGES.filter((b) =>
    progress.badges.includes(b.id)
  );
  const lockedBadges = ALL_BADGES.filter(
    (b) => !progress.badges.includes(b.id)
  );

  return (
    <section aria-label="Your achievements" className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden>
            ⭐
          </span>
          <div className="flex-1">
            <h2 className="font-display text-[24px] text-text-primary">
              Your Progress
            </h2>
            <p className="text-body text-text-secondary">
              {percentage === 100
                ? "Amazing! You've completed everything!"
                : `${percentage}% complete — keep going!`}
            </p>
          </div>
          <span className="font-display text-[28px] text-accent">
            {percentage}%
          </span>
        </div>
        <div
          className="mt-4 h-4 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percentage}% complete`}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="mt-3 text-body text-text-secondary">
          {progress.badges.length} of {ALL_BADGES.length} badges earned
          {progress.streakDays > 1 &&
            ` — ${progress.streakDays} day streak!`}
        </p>
      </div>

      {earnedBadges.length > 0 ? (
        <div>
          <h3 className="font-display text-[22px] text-text-primary mb-4">
            Earned Badges
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="rounded-2xl border-2 border-success bg-surface p-4 shadow-sm animate-celebrate"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden>
                    {badge.emoji}
                  </span>
                  <div>
                    <p className="font-display text-[20px] text-text-primary">
                      {badge.title}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <h3 className="font-display text-[22px] text-text-primary mb-4">
          Badges to Earn
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {lockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="rounded-2xl border border-dashed border-border bg-surface p-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl grayscale" aria-hidden>
                  {badge.emoji}
                </span>
                <div>
                  <p className="font-display text-[20px] text-text-primary">
                    {badge.title}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {badge.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
