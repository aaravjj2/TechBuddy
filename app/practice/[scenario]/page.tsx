import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
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
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Practice", href: "/practice" },
          { label: scenario.title },
        ]}
      />
      <h1 className="mb-6 font-display text-[36px] text-text-primary">
        {scenario.title}
      </h1>
      <PracticeSession scenario={scenario} />
    </PageShell>
  );
}
