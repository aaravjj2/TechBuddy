"use client";

import { ReadAloud } from "@/components/ReadAloud";

export type StepCardProps = {
  currentStep: number;
  totalSteps: number;
  instruction: string;
  imageSrc: string;
  imageAlt: string;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
};

export function StepCard({
  currentStep,
  totalSteps,
  instruction,
  imageSrc,
  imageAlt,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: StepCardProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
      <div
        className="mb-6 h-3 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mb-6 font-display text-[24px] text-text-primary">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="relative mb-6 w-full overflow-hidden rounded-xl border border-border bg-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="mx-auto max-h-[min(50vh,360px)] w-auto max-w-full object-contain"
        />
      </div>
      <p className="mb-8 text-body text-text-primary">{instruction}</p>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ReadAloud text={instruction} label="Read this step to me" />
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="inline-flex min-h-[56px] min-w-[140px] items-center justify-center rounded-xl border border-border bg-surface px-5 py-3 font-sans text-body text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="inline-flex min-h-[56px] min-w-[140px] items-center justify-center rounded-xl bg-accent px-5 py-3 font-sans text-body text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
}
