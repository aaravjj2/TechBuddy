import { NavButton } from "@/components/NavButton";
import { PageShell } from "@/components/PageShell";

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
      </header>

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
