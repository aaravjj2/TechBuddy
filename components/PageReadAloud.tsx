"use client";

import { useCallback, useRef, useState } from "react";

export type PageReadAloudProps = {
  /** CSS selector for the container whose text to read */
  selector?: string;
  label?: string;
  className?: string;
};

export function PageReadAloud({
  selector = "#main-content",
  label = "Read this page to me",
  className = "",
}: PageReadAloudProps) {
  const [busy, setBusy] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const container = document.querySelector(selector);
    if (!container) return;

    // Extract text content, clean up whitespace
    const text = container.textContent?.replace(/\s+/g, " ").trim() ?? "";
    if (!text) return;

    const utter = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utter;
    utter.rate = 0.9; // Slightly slower for seniors
    setBusy(true);
    utter.onend = () => setBusy(false);
    utter.onerror = () => setBusy(false);
    window.speechSynthesis.speak(utter);
  }, [selector]);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setBusy(false);
  }, []);

  return (
    <button
      type="button"
      onClick={busy ? stop : speak}
      aria-label={busy ? "Stop reading" : label}
      className={`inline-flex min-h-[56px] items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 font-sans text-body text-text-primary transition-colors hover:bg-surface-hover ${className}`}
    >
      <span className="text-xl" aria-hidden>
        {busy ? "⏹️" : "🔊"}
      </span>
      {busy ? "Stop reading" : label}
    </button>
  );
}
