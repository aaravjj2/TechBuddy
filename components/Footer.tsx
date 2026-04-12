const RESOURCES = [
  {
    name: "FTC Fraud Report",
    phone: "1-877-382-4357",
    href: "tel:18773824357",
    description: "Report scams to the Federal Trade Commission",
  },
  {
    name: "AARP Fraud Watch Network",
    phone: "1-877-908-3360",
    href: "tel:18779083360",
    description: "Free helpline for scam victims",
  },
  {
    name: "988 Suicide & Crisis Lifeline",
    phone: "988",
    href: "tel:988",
    description: "Call or text if you or someone you know is in crisis",
  },
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-bg" role="contentinfo">
      <div className="mx-auto max-w-content px-6 py-10">
        <h2 className="font-display text-[22px] text-text-primary">
          Need real help?
        </h2>
        <p className="mt-2 text-body text-text-secondary">
          If you think you&apos;ve been scammed or feel unsafe, these free
          helplines are available now.
        </p>
        <ul className="mt-6 space-y-4">
          {RESOURCES.map((r) => (
            <li key={r.name} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-display text-[20px] text-text-primary">
                {r.name}
              </p>
              <p className="mt-1 text-body text-text-secondary">
                {r.description}
              </p>
              <a
                href={r.href}
                className="mt-2 inline-flex min-h-[56px] items-center rounded-xl bg-accent px-5 text-lg font-semibold text-white hover:bg-accent-hover"
              >
                Call {r.phone}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-text-secondary">
          TechBuddy is a free educational tool — not a replacement for official
          help. When in doubt, always call a trusted family member or your local
          police non-emergency line.
        </p>
      </div>
    </footer>
  );
}
