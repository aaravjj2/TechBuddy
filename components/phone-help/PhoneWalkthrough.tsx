"use client";

import Link from "next/link";
import { useState } from "react";
import { StepCard } from "@/components/StepCard";
import type { PhoneHelpTopic } from "@/lib/phone-help";

export function PhoneWalkthrough({ topic }: { topic: PhoneHelpTopic }) {
  const [index, setIndex] = useState(0);
  const step = topic.steps[index]!;
  const total = topic.steps.length;

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
        canGoNext={index < total - 1}
        onPrevious={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => setIndex((i) => Math.min(total - 1, i + 1))}
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
