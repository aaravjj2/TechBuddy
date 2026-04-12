import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { AIChatPanel } from "@/components/what-is-ai/AIChatPanel";

export default function WhatIsAIPage() {
  return (
    <PageShell>
      <h1 className="mb-2 font-display text-[36px] text-text-primary">
        What Is AI?
      </h1>
      <p className="mb-8 text-body text-text-secondary">
        Ask anything—there are no silly questions here.
      </p>
      <AIChatPanel />
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
