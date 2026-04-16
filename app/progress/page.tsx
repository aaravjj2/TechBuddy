import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { BadgeDisplay } from "@/components/BadgeDisplay";

export const metadata: Metadata = {
  title: "My Progress",
  description:
    "See your achievements and track what you've learned with TechBuddy.",
};

export default function ProgressPage() {
  return (
    <PageShell>
      <header className="mb-8">
        <div className="flex items-start gap-4">
          <span className="text-5xl" aria-hidden>
            ⭐
          </span>
          <div>
            <h1 className="font-display text-[36px] text-text-primary">
              My Progress
            </h1>
            <p className="text-body text-text-secondary">
              See what you&apos;ve accomplished and what&apos;s next.
            </p>
          </div>
        </div>
      </header>

      <BadgeDisplay />

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
