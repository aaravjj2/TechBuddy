"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";

type NavItem = { href: string; label: string };

const INSTRUCTOR_NAV: NavItem[] = [
  { href: "/instructor/dashboard", label: "Dashboard" },
  { href: "/instructor/learners", label: "Learners" },
  { href: "/instructor/impact", label: "Impact" },
  { href: "/instructor/center", label: "Center" },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin/impact", label: "Impact" },
  { href: "/admin/research", label: "Research" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/governance", label: "Governance" },
];

export function InstructorShell({
  scope,
  userName,
  userRole,
  signOutAction,
  children,
}: {
  scope: "instructor" | "admin";
  userName: string;
  userRole: string;
  signOutAction: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = scope === "admin" ? ADMIN_NAV : INSTRUCTOR_NAV;
  const title = scope === "admin" ? "TechBuddy Admin" : "TechBuddy Instructor";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="lg:flex lg:min-h-screen">
      {/* Sidebar (desktop) + Top bar (mobile) */}
      <aside
        aria-label="Primary navigation"
        className="border-b border-neutral-200 bg-white lg:w-64 lg:flex-shrink-0 lg:border-b-0 lg:border-r"
      >
        <div className="flex items-center justify-between px-4 py-4 lg:block lg:px-6 lg:py-6">
          <Link
            href={scope === "admin" ? "/admin/impact" : "/instructor/dashboard"}
            className="inline-flex items-center gap-2 rounded-senior text-senior-lg font-semibold text-trust-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
          >
            <span aria-hidden="true" className="text-trust-500">
              ●
            </span>
            <span>{title}</span>
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="instructor-nav-list"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex min-h-touch items-center justify-center rounded-senior px-3 text-senior-base text-trust-700 hover:bg-trust-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2 lg:hidden"
          >
            <span aria-hidden="true" className="text-senior-xl leading-none">
              {mobileOpen ? "✕" : "≡"}
            </span>
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>

        <nav
          id="instructor-nav-list"
          aria-label={`${scope} navigation`}
          className={cn(
            "border-t border-neutral-200 lg:block lg:border-t-0",
            mobileOpen ? "block" : "hidden lg:block"
          )}
        >
          <ul className="flex flex-col gap-1 p-3 lg:p-4">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-touch items-center rounded-senior px-4 text-senior-base font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2",
                      active
                        ? "bg-trust-100 text-trust-900"
                        : "text-neutral-700 hover:bg-neutral-100"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-neutral-200 p-4 lg:mt-auto">
            <p className="text-senior-sm text-neutral-600">Signed in as</p>
            <p className="mt-1 text-senior-base font-semibold text-neutral-900">
              {userName}
            </p>
            <p className="mt-1 text-senior-sm text-neutral-500">Role: {userRole}</p>

            <form action={signOutAction} className="mt-4">
              <button
                type="submit"
                className="flex min-h-touch w-full items-center justify-center rounded-senior border-2 border-trust-500 bg-white px-4 text-senior-base font-semibold text-trust-700 hover:bg-trust-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}
