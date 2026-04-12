import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
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
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Phone Help", href: "/phone-help" },
          { label: topic.title },
        ]}
      />
      <PhoneWalkthrough topic={topic} />
    </PageShell>
  );
}
