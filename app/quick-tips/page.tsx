import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { TipCard } from "@/components/TipCard";
import { getTipForDate, TIPS } from "@/lib/tips";

export default function QuickTipsPage() {
  const todayTip = getTipForDate(new Date());
  const todayIdx = TIPS.findIndex(
    (t) => t.title === todayTip.title,
  );
  const otherTips = TIPS.filter((_, i) => i !== todayIdx);

  return (
    <PageShell>
      <h1 className="mb-2 font-display text-[36px] text-text-primary">
        Quick Tips
      </h1>
      <p className="mb-8 text-body text-text-secondary">
        Practical advice you can use today. Your daily tip is highlighted at the
        top — scroll down for more.
      </p>

      <section aria-label="Today's highlighted tip" className="mb-8">
        <TipCard
          title={todayTip.title}
          body={todayTip.body}
          action={todayTip.action}
          highlighted
        />
      </section>

      <section aria-label="All tips" className="space-y-4">
        <h2 className="font-display text-[28px] text-text-primary">
          All tips
        </h2>
        {otherTips.map((tip) => (
          <TipCard
            key={tip.title}
            title={tip.title}
            body={tip.body}
            action={tip.action}
          />
        ))}
      </section>

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
