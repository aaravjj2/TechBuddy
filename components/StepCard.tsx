"use client";

import { useCallback, useState } from "react";
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
  isLastStep?: boolean;
  onGoToStep?: (step: number) => void;
};

function ImageFallback({ alt }: { alt: string }) {
  return (
    <div
      className="flex min-h-[200px] flex-col items-center justify-center gap-3 bg-bg px-4 py-8 text-center"
      role="img"
      aria-label={alt}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect
          x="18"
          y="4"
          width="28"
          height="56"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
          className="text-text-secondary"
        />
        <circle cx="32" cy="52" r="3" className="fill-text-secondary" />
        <rect x="22" y="12" width="20" height="32" rx="1" className="fill-border" />
      </svg>
      <p className="text-body text-text-secondary">
        Follow the steps below
      </p>
    </div>
  );
}

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
  isLastStep = false,
  onGoToStep,
}: StepCardProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);
  const [imageError, setImageError] = useState(false);

  const handleRetry = useCallback(() => {
    setImageError(false);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
      <div
        className="mb-4 h-3 w-full overflow-hidden rounded-full bg-border"
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
      <div className="mb-6 flex items-center justify-center gap-2" role="group" aria-label="Step navigation">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCurrent = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          return (
            <button
              key={stepNum}
              type="button"
              onClick={() => onGoToStep?.(i)}
              disabled={!onGoToStep}
              aria-label={`Go to step ${stepNum}${isCurrent ? " (current)" : ""}${isCompleted ? " (completed)" : ""}`}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                isCurrent
                  ? "bg-accent text-white"
                  : isCompleted
                    ? "bg-accent/20 text-accent"
                    : "bg-border text-text-secondary"
              }`}
            >
              {stepNum}
            </button>
          );
        })}
      </div>
      <p className="mb-6 font-display text-[24px] text-text-primary">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="relative mb-6 w-full overflow-hidden rounded-xl border border-border bg-bg">
        {imageError ? (
          <ImageFallback alt={imageAlt} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={imageAlt}
            className="mx-auto max-h-[min(50vh,360px)] w-auto max-w-full object-contain"
            onError={() => setImageError(true)}
            onLoad={handleRetry}
          />
        )}
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
            disabled={!canGoNext && !isLastStep}
            className="inline-flex min-h-[56px] min-w-[140px] items-center justify-center rounded-xl bg-accent px-5 py-3 font-sans text-body font-semibold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLastStep ? "Done" : "Next Step →"}
          </button>
        </div>
      </div>
    </div>
  );
}
