import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PracticeScenarioList } from "@/components/practice/PracticeScenarioList";

export default function PracticePage() {
  return (
    <PageShell>
      <h1 className="mb-2 font-display text-[36px] text-text-primary">
        Practice Mode
      </h1>
      <p className="mb-8 text-body text-text-secondary">
        Pick a scenario and practice what you might say to a scammer—safely,
        with feedback at the end.
      </p>
      <PracticeScenarioList />
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
