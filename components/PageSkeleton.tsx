import { PageShell } from "@/components/PageShell";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-border ${className}`}
      aria-hidden
    />
  );
}

export function PageSkeleton({
  heading = true,
  lines = 3,
}: {
  heading?: boolean;
  lines?: number;
}) {
  return (
    <PageShell>
      {heading ? (
        <SkeletonBlock className="mb-4 h-10 w-64" />
      ) : null}
      <SkeletonBlock className="mb-8 h-6 w-96" />
      <div className="space-y-4">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24 w-full" />
        ))}
      </div>
    </PageShell>
  );
}
