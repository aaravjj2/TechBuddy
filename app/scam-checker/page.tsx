import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { ScamCheckerForm } from "@/components/scam/ScamCheckerForm";

export const metadata: Metadata = {
  title: "Is This a Scam?",
  description:
    "Paste a suspicious message and get an instant analysis. Learn to spot phishing, fraud, and scam attempts.",
};

export default function ScamCheckerPage() {
  return (
    <PageShell>
      <h1 className="mb-2 font-display text-[36px] text-text-primary">
        Is This a Scam?
      </h1>
      <p className="mb-8 text-body text-text-secondary">
        Paste the suspicious message here, or describe what happened.
      </p>
      <ScamCheckerForm />
    </PageShell>
  );
}
