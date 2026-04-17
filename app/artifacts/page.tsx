import type { Metadata } from "next";
import { ArtifactsGallery } from "@/components/artifacts/ArtifactsGallery";

export const metadata: Metadata = {
  title: "Artifacts Gallery — 360 monthly briefs",
  description:
    "Browse every one-page execution brief from TechBuddy's 36-month plan, searchable by domain, year, and month.",
};

export default function ArtifactsPage({
  searchParams,
}: {
  searchParams: Promise<{
    year?: string;
    month?: string;
    domain?: string;
    q?: string;
    view?: string;
  }>;
}) {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <header className="mb-8">
        <p className="text-senior-sm font-semibold uppercase tracking-wider text-trust-700">
          Planning library
        </p>
        <h1 className="mt-2 text-senior-2xl font-bold text-neutral-900">
          Artifacts Gallery
        </h1>
        <p className="mt-3 max-w-3xl text-senior-base text-neutral-700">
          Every month of the 36-month TechBuddy plan gets a one-page brief. This
          gallery is the searchable index across all 360 pages and 10 domains —
          so you can see exactly what we promised, delivered, and learned.
        </p>
      </header>
      <ArtifactsGallery initialParams={searchParams} />
    </main>
  );
}
