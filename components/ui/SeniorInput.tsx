"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export type SeniorInputProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    /** Visually hide label but keep for screen readers */
    labelSrOnly?: boolean;
    hint?: string;
  };

export const SeniorInput = forwardRef<HTMLTextAreaElement, SeniorInputProps>(
  function SeniorInput(
    { label, labelSrOnly, hint, id, className, ...rest },
    ref
  ) {
    const inputId = id ?? rest.name ?? "senior-input";
    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className={cn(
            "block font-semibold text-text-primary text-senior-base",
            labelSrOnly && "sr-only"
          )}
        >
          {label}
        </label>
        {hint ? (
          <p id={`${inputId}-hint`} className="text-body text-text-secondary">
            {hint}
          </p>
        ) : null}
        <textarea
          ref={ref}
          id={inputId}
          aria-describedby={hint ? `${inputId}-hint` : undefined}
          className={cn(
            "min-h-[44px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-senior-base leading-relaxed text-text-primary shadow-inner placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            className
          )}
          {...rest}
        />
      </div>
    );
  }
);
