"use client";

export function PrintGuideButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-[56px] items-center gap-2 rounded-xl border border-border bg-surface px-5 text-lg font-semibold text-text-primary transition-colors hover:bg-surface-hover print:hidden"
      data-print-hidden
    >
      <span aria-hidden>🖨️</span>
      Print this guide
    </button>
  );
}
