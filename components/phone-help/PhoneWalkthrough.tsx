"use client";

import Link from "next/link";
import { useState } from "react";
import { StepCard } from "@/components/StepCard";
import type { PhoneHelpTopic } from "@/lib/phone-help";

export function PhoneWalkthrough({ topic }: { topic: PhoneHelpTopic }) {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const total = topic.steps.length;

  if (completed) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border-2 border-success bg-surface p-8 text-center shadow-sm">
          <span className="text-5xl animate-celebrate" aria-hidden>
            ✅
          </span>
          <h1 className="mt-4 font-display text-[36px] text-text-primary">
            You did it!
          </h1>
          <p className="mt-3 text-body text-text-secondary">
            You completed every step of this guide.
          </p>
          <div className="mt-4 inline-flex items-center rounded-full border border-success bg-success/10 px-4 py-2 text-sm font-semibold text-success">
            {topic.title} — Complete
          </div>
        </div>
        {/* Print view: all steps */}
        <div className="print-only" aria-hidden>
          <h1 className="font-display text-[36px] text-text-primary">{topic.title}</h1>
          {topic.steps.map((step, i) => (
            <div key={i} className="step-card mb-6 border-b border-border pb-6">
              <h2 className="font-display text-[20px] text-text-primary">
                {i + 1}. {step.instruction}
              </h2>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row" data-print-hidden>
          <Link
            href="/phone-help"
            className="inline-flex min-h-[56px] items-center justify-center rounded-xl border border-border bg-surface px-6 text-body text-text-primary hover:bg-surface-hover"
          >
            Try another topic
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-[56px] items-center justify-center rounded-xl bg-accent px-6 text-body font-semibold text-white hover:bg-accent-hover"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const step = topic.steps[index]!;
  const isLast = index === total - 1;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-[36px] text-text-primary">{topic.title}</h1>
      {/* Interactive step view — hidden when printing */}
      <div data-print-hidden>
        <StepCard
          currentStep={index + 1}
          totalSteps={total}
          instruction={step.instruction}
          imageSrc={step.imageSrc}
          imageAlt={step.imageAlt}
          canGoPrevious={index > 0}
          canGoNext={!isLast}
          isLastStep={isLast}
          onGoToStep={(i) => setIndex(i)}
          onPrevious={() => setIndex((i) => Math.max(0, i - 1))}
          onNext={() => {
            if (isLast) {
              void fetch("/api/v1/phone-help/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topicSlug: topic.slug }),
                keepalive: true,
              }).catch(() => {
                /* recording is best-effort */
              });
              setCompleted(true);
            } else {
              setIndex((i) => Math.min(total - 1, i + 1));
            }
          }}
        />
      </div>
      {/* Print view: all steps in sequence */}
      <div className="print-only" aria-hidden>
        {topic.steps.map((s, i) => (
          <div key={i} className="step-card mb-6 border-b border-border pb-6">
            <h2 className="font-display text-[20px] text-text-primary">
              {i + 1}. {s.instruction}
            </h2>
          </div>
        ))}
      </div>
      <p className="text-body" data-print-hidden>
        <Link
          href="/phone-help"
          className="text-accent underline min-h-[56px] inline-flex items-center"
        >
          ← All topics
        </Link>
      </p>
    </div>
  );
}
