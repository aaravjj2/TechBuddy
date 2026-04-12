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
          <span className="text-5xl" aria-hidden>
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
        <div className="flex flex-col gap-3 sm:flex-row">
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
            setCompleted(true);
          } else {
            setIndex((i) => Math.min(total - 1, i + 1));
          }
        }}
      />
      <p className="text-body">
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
