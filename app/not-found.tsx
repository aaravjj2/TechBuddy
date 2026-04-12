import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <span className="text-6xl" aria-hidden>
          🔍
        </span>
        <h1 className="font-display text-[36px] text-text-primary">
          Page not found
        </h1>
        <p className="max-w-md text-body text-text-secondary">
          The page you were looking for doesn&apos;t exist. This sometimes
          happens if a link was typed incorrectly or the page was moved.
        </p>
        <Link
          href="/"
          className="inline-flex min-h-[60px] min-w-[240px] items-center justify-center rounded-xl bg-accent text-lg font-semibold text-white hover:bg-accent-hover"
        >
          Go Home
        </Link>
      </div>
    </PageShell>
  );
}
