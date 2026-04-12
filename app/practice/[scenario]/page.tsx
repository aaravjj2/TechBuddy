import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PracticeSession } from "@/components/practice/PracticeSession";
import { getScenarioBySlug } from "@/lib/scenarios";

type Props = { params: Promise<{ scenario: string }> };

export default async function PracticeScenarioPage({ params }: Props) {
  const { scenario: slug } = await params;
  const scenario = getScenarioBySlug(slug);
  if (!scenario) notFound();

  return (
    <PageShell>
      <p className="mb-4 text-body">
        <Link
          href="/practice"
          className="text-accent underline min-h-[56px] inline-flex items-center"
        >
          ← All scenarios
        </Link>
      </p>
      <h1 className="mb-6 font-display text-[36px] text-text-primary">
        {scenario.title}
      </h1>
      <PracticeSession scenario={scenario} />
    </PageShell>
  );
}
