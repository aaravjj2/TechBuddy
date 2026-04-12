"use client";

import { useCallback, useState } from "react";

export type ReadAloudProps = {
  text: string;
  label?: string;
  className?: string;
};

export function ReadAloud({
  text,
  label = "Read this to me",
  className = "",
}: ReadAloudProps) {
  const [busy, setBusy] = useState(false);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    setBusy(true);
    utter.onend = () => setBusy(false);
    utter.onerror = () => setBusy(false);
    window.speechSynthesis.speak(utter);
  }, [text]);

  return (
    <button
      type="button"
      onClick={speak}
      disabled={busy || !text.trim()}
      aria-label={label}
      className={`inline-flex min-h-[56px] items-center justify-center rounded-xl border border-border bg-surface px-5 py-3 font-sans text-body text-text-primary transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {busy ? "Reading…" : label}
    </button>
  );
}
