import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { TipCard } from "@/components/TipCard";
import { getTipForDate } from "@/lib/tips";

export default function QuickTipsPage() {
  const tip = getTipForDate(new Date());

  return (
    <PageShell>
      <TipCard title={tip.title} body={tip.body} action={tip.action} />
      <p className="mt-8 text-body text-text-secondary">
        Tips rotate by the day of the year (your device&apos;s local calendar).
      </p>
      <p className="mt-4 text-body">
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
