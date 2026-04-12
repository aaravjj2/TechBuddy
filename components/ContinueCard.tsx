"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "techbuddy-last-visit";

type Section = {
  label: string;
  href: string;
  emoji: string;
};

const SECTIONS: Record<string, Section> = {
  "/scam-checker": { label: "Is This a Scam?", href: "/scam-checker", emoji: "🚨" },
  "/phone-help": { label: "Help With My Phone", href: "/phone-help", emoji: "📱" },
  "/what-is-ai": { label: "What Is AI?", href: "/what-is-ai", emoji: "🤖" },
  "/practice": { label: "Practice Mode", href: "/practice", emoji: "🎯" },
  "/quick-tips": { label: "Quick Tips", href: "/quick-tips", emoji: "💡" },
};

export function saveLastVisit(pathname: string) {
  if (typeof window === "undefined") return;
  const section = SECTIONS[pathname];
  if (section) {
    localStorage.setItem(STORAGE_KEY, pathname);
  }
}

export function ContinueCard() {
  const [section, setSection] = useState<Section | null>(null);

  useEffect(() => {
    const lastPath = localStorage.getItem(STORAGE_KEY);
    if (lastPath && SECTIONS[lastPath]) {
      setSection(SECTIONS[lastPath]);
    }
  }, []);

  if (!section) return null;

  return (
    <div className="rounded-2xl border-2 border-accent bg-surface p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">
        Welcome back
      </p>
      <h2 className="mt-1 font-display text-[24px] text-text-primary">
        Continue where you left off
      </h2>
      <Link
        href={section.href}
        className="mt-4 inline-flex min-h-[56px] items-center gap-3 rounded-xl bg-accent px-6 text-lg font-semibold text-white hover:bg-accent-hover"
      >
        <span className="text-2xl" aria-hidden>
          {section.emoji}
        </span>
        {section.label}
      </Link>
    </div>
  );
}
