import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScamCheckerForm } from "@/components/scam/ScamCheckerForm";

export const metadata: Metadata = {
  title: "Is This a Scam?",
  description:
    "Paste a suspicious message and get an instant analysis. Learn to spot phishing, fraud, and scam attempts.",
};

export default function ScamCheckerPage() {
  return (
    <PageShell>
      <PageHeader
        id="page-title"
        title="Is This a Scam?"
        description="Paste the suspicious message here, or describe what happened."
      />
      <ScamCheckerForm />
    </PageShell>
  );
}
