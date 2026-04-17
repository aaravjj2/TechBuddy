"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-trust-700 text-white hover:bg-trust-900 focus-visible:ring-trust-500",
  secondary:
    "bg-white text-trust-700 border-2 border-trust-500 hover:bg-trust-50 focus-visible:ring-trust-500",
  ghost:
    "bg-transparent text-trust-700 hover:bg-trust-50 focus-visible:ring-trust-500",
  danger:
    "bg-scam-500 text-white hover:bg-scam-700 focus-visible:ring-scam-500",
};

const SIZE: Record<Size, string> = {
  sm: "min-h-[44px] px-4 text-senior-sm",
  md: "min-h-[48px] px-6 text-senior-base",
  lg: "min-h-[56px] px-8 text-senior-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth,
      loading,
      disabled,
      children,
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center rounded-senior font-semibold",
          "transition-colors outline-none focus-visible:ring-4 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
          VARIANT[variant],
          SIZE[size],
          fullWidth && "w-full",
          className
        )}
        {...rest}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
            <span>Working…</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
