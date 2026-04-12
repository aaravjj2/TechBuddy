"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-[56px] items-center justify-center rounded-xl bg-accent px-6 text-lg font-semibold text-white hover:bg-accent-hover"
    >
      Print this page
    </button>
  );
}
