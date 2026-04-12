import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PHONE_HELP_TOPICS } from "@/lib/phone-help";

export default function PhoneHelpPage() {
  return (
    <PageShell>
      <h1 className="mb-2 font-display text-[36px] text-text-primary">
        Help With My Phone
      </h1>
      <p className="mb-8 text-body text-text-secondary">
        Step-by-step guides for common tasks. Take your time—tap one topic to
        begin.
      </p>
      <ul className="flex flex-col gap-4">
        {PHONE_HELP_TOPICS.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/phone-help/${t.slug}`}
              className="flex min-h-[56px] w-full items-center rounded-2xl border border-border bg-surface px-6 py-4 font-display text-[24px] text-text-primary shadow-sm transition-colors hover:bg-surface-hover"
            >
              {t.title}
            </Link>
          </li>
        ))}
      </ul>
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
