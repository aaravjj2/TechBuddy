"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/scam-checker", label: "Scam?", emoji: "🚨" },
  { href: "/phone-help", label: "Phone", emoji: "📱" },
  { href: "/what-is-ai", label: "AI Chat", emoji: "🤖" },
  { href: "/practice", label: "Practice", emoji: "🎯" },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface sm:hidden"
      aria-label="Quick navigation"
    >
      <ul className="flex h-[72px] items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex min-h-[56px] min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1 text-center text-xs transition-colors ${
                  isActive
                    ? "font-semibold text-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <span className="text-lg" aria-hidden>
                  {item.emoji}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
