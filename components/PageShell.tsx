import type { ReactNode } from "react";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

function HeaderFallback() {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
      <div className="h-14 w-24 animate-pulse rounded-xl bg-border" />
      <div className="h-8 w-32 animate-pulse rounded bg-border" />
    </header>
  );
}

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`mx-auto min-h-screen w-full max-w-content px-4 py-8 outline-none md:px-6 ${className}`}
    >
      <Suspense fallback={<HeaderFallback />}>
        <SiteHeader />
      </Suspense>
      {children}
    </main>
  );
}
