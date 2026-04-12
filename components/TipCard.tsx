"use client";

import { useState } from "react";
import { ReadAloud } from "@/components/ReadAloud";

export type TipCardProps = {
  title: string;
  body: string;
  action?: string;
  highlighted?: boolean;
};

export function TipCard({ title, body, action, highlighted = false }: TipCardProps) {
  const [expanded, setExpanded] = useState(highlighted);

  return (
    <article
      className={`rounded-2xl border bg-surface p-6 shadow-sm transition-colors sm:p-8 ${
        highlighted ? "border-2 border-accent" : "border border-border"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          {highlighted ? "💡" : "📌"}
        </span>
        <div className="min-w-0 flex-1">
          {highlighted ? (
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-accent">
              Today&apos;s Tip
            </p>
          ) : null}
          <h3 className="font-display text-[22px] leading-snug text-text-primary">
            {title}
          </h3>
        </div>
      </div>

      {highlighted || expanded ? (
        <div className="mt-4">
          <p className="text-body text-text-primary">{body}</p>
          {action ? (
            <p className="mt-3 text-body font-semibold text-text-primary">
              {action}
            </p>
          ) : null}
          {highlighted ? (
            <div className="mt-4">
              <ReadAloud text={[title, body, action].filter(Boolean).join(". ")} label="Read this tip to me" />
            </div>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 text-body font-semibold text-accent hover:underline"
        >
          Read more
        </button>
      )}
    </article>
  );
}
