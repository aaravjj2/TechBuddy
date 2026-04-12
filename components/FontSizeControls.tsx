"use client";

import { useEffect, useState } from "react";

const FS_KEY = "techbuddy-font-size";
const MIN = 16;
const MAX = 28;
const DEFAULT = 20;

export function FontSizeControls() {
  const [size, setSize] = useState(DEFAULT);

  useEffect(() => {
    const saved = Number(localStorage.getItem(FS_KEY));
    if (saved >= MIN && saved <= MAX) {
      setSize(saved);
      document.documentElement.style.fontSize = `${saved}px`;
    }
  }, []);

  const change = (delta: number) => {
    const next = Math.max(MIN, Math.min(MAX, size + delta));
    setSize(next);
    localStorage.setItem(FS_KEY, String(next));
    document.documentElement.style.fontSize = `${next}px`;
  };

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Font size">
      <button
        type="button"
        onClick={() => change(-2)}
        disabled={size <= MIN}
        className="inline-flex min-h-[56px] min-w-[56px] items-center justify-center rounded-xl border border-border bg-surface text-xl font-bold text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Decrease font size"
      >
        A-
      </button>
      <span className="text-sm font-semibold text-text-secondary">{size}px</span>
      <button
        type="button"
        onClick={() => change(2)}
        disabled={size >= MAX}
        className="inline-flex min-h-[56px] min-w-[56px] items-center justify-center rounded-xl border border-border bg-surface text-xl font-bold text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Increase font size"
      >
        A+
      </button>
    </div>
  );
}
