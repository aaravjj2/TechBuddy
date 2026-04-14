import type { Metadata } from "next";
import { ContinueCard } from "@/components/ContinueCard";
import { FirstVisitChecklist } from "@/components/FirstVisitChecklist";
import { NavButton } from "@/components/NavButton";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  description:
    "Learn to spot scams, understand AI, and use your phone with confidence. Free forever, no login required.",
};

export default function Home() {
  return (
    <PageShell>
      <header className="mb-10">
        <div className="flex items-start gap-4">
          <span className="text-5xl" aria-hidden>
            🛡️
          </span>
          <div>
            <h1 className="font-display text-[36px] text-text-primary">
              TechBuddy
            </h1>
            <p className="text-body text-text-secondary">
              Your technology helper
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-lg text-body text-text-primary">
          Learn to spot scams, understand AI, and use your phone with
          confidence.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary">
            Free forever
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary">
            No login required
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary">
            Built for seniors
          </span>
        </div>
      </header>

      <div className="mb-6">
        <FirstVisitChecklist />
      </div>

      <div className="mb-6">
        <ContinueCard />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <NavButton
          href="/scam-checker"
          emoji="🚨"
          label="Is This a Scam?"
        />
        <NavButton
          href="/phone-help"
          emoji="📱"
          label="Help With My Phone"
        />
        <NavButton
          href="/what-is-ai"
          emoji="🤖"
          label="What Is AI?"
        />
        <NavButton
          href="/practice"
          emoji="🎯"
          label="Practice Mode"
        />
        <div className="md:col-span-2">
          <NavButton
            href="/quick-tips"
            emoji="💡"
            label="Today's Quick Tip"
          />
        </div>
      </div>
    </PageShell>
  );
}
