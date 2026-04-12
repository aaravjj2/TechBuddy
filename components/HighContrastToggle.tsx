"use client";

import { useEffect, useState } from "react";

const HC_KEY = "techbuddy-high-contrast";

export function HighContrastToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(HC_KEY) === "true";
    setOn(saved);
    document.documentElement.classList.toggle("high-contrast", saved);
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    localStorage.setItem(HC_KEY, String(next));
    document.documentElement.classList.toggle("high-contrast", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex min-h-[56px] items-center justify-center rounded-xl border border-border bg-surface px-5 text-lg font-semibold text-text-primary hover:bg-surface-hover"
      aria-pressed={on}
    >
      {on ? "Standard contrast" : "High contrast"}
    </button>
  );
}
