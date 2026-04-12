import Link from "next/link";
import type { ReactNode } from "react";

export type NavButtonProps = {
  href: string;
  emoji: ReactNode;
  label: string;
  description?: string;
  className?: string;
};

export function NavButton({
  href,
  emoji,
  label,
  description,
  className = "",
}: NavButtonProps) {
  return (
    <Link
      href={href}
      className={`flex min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-8 text-center text-text-primary shadow-sm transition-colors hover:bg-surface-hover focus-visible:outline-none ${className}`}
    >
      <span className="text-4xl" aria-hidden>
        {emoji}
      </span>
      <span className="font-display text-[24px] leading-snug">{label}</span>
      {description ? (
        <span className="text-lg text-text-secondary">{description}</span>
      ) : null}
    </Link>
  );
}
