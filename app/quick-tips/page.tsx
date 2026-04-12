"use client";

import Link from "next/link";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { TipCard } from "@/components/TipCard";
import { getTipForDate, TIPS, TIP_CATEGORIES, type TipCategory } from "@/lib/tips";

export default function QuickTipsPage() {
  const todayTip = getTipForDate(new Date());
  const todayIdx = TIPS.findIndex(
    (t) => t.title === todayTip.title,
  );
  const otherTips = TIPS.filter((_, i) => i !== todayIdx);

  const [filter, setFilter] = useState<TipCategory | "All">("All");

  const filteredTips =
    filter === "All"
      ? otherTips
      : otherTips.filter((t) => t.category === filter);

  return (
    <PageShell>
      <h1 className="mb-2 font-display text-[36px] text-text-primary">
        Quick Tips
      </h1>
      <p className="mb-8 text-body text-text-secondary">
        Practical advice you can use today. Your daily tip is highlighted at the
        top — scroll down for more.
      </p>

      <section aria-label="Today's highlighted tip" className="mb-8">
        <TipCard
          title={todayTip.title}
          body={todayTip.body}
          action={todayTip.action}
          category={todayTip.category}
          highlighted
        />
      </section>

      <section aria-label="All tips" className="space-y-4">
        <h2 className="font-display text-[28px] text-text-primary">
          All tips
        </h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tips by category">
          <button
            type="button"
            onClick={() => setFilter("All")}
            className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              filter === "All"
                ? "border-accent bg-accent text-white"
                : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
            }`}
          >
            All
          </button>
          {TIP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                filter === cat
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {filteredTips.map((tip) => (
          <TipCard
            key={tip.title}
            title={tip.title}
            body={tip.body}
            action={tip.action}
            category={tip.category}
          />
        ))}
        {filteredTips.length === 0 ? (
          <p className="py-8 text-center text-body text-text-secondary">
            No tips in this category yet.
          </p>
        ) : null}
      </section>

      <p className="mt-8 text-body">
        <Link
          href="/"
          className="text-accent underline min-h-[56px] inline-flex items-center"
        >
          ← Back to home
        </Link>
      </p>
    </PageShell>
  );
}
