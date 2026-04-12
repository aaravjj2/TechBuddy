import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PhoneWalkthrough } from "@/components/phone-help/PhoneWalkthrough";
import { getTopicBySlug } from "@/lib/phone-help";

type Props = { params: Promise<{ topic: string }> };

export default async function PhoneHelpTopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  return (
    <PageShell>
      <p className="mb-4 text-body">
        <Link
          href="/phone-help"
          className="text-accent underline min-h-[56px] inline-flex items-center"
        >
          ← All topics
        </Link>
      </p>
      <PhoneWalkthrough topic={topic} />
    </PageShell>
  );
}
