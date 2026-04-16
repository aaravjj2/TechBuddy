import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "I've Been Scammed — Get Help Now",
  description:
    "If you think you've been scammed, follow these steps right away. You are not alone, and it is not your fault.",
};

const STEPS = [
  {
    number: 1,
    title: "Stop and breathe",
    body: "It is not your fault. Scammers are professional liars who target good people. You are not stupid — you were deceived by a criminal.",
  },
  {
    number: 2,
    title: "Do not send any more money",
    body: "If someone is asking for more money, gift cards, or wire transfers — stop all contact immediately. Block the number or email.",
  },
  {
    number: 3,
    title: "Call your bank or credit card company",
    body: "Tell them \"I think I've been scammed.\" They can freeze your account, reverse charges, and help protect your money. The sooner you call, the better.",
  },
  {
    number: 4,
    title: "Change your passwords",
    body: "If you gave any passwords or logged into any accounts, change those passwords right away. Use a different password for each account if you can.",
  },
  {
    number: 5,
    title: "Report it",
    body: "Reporting helps stop scammers and may help you recover losses. You will NOT get in trouble for reporting.",
  },
];

const REPORT_RESOURCES = [
  {
    name: "Federal Trade Commission (FTC)",
    description: "The main place to report scams in the United States.",
    action: "Report online",
    url: "https://reportfraud.ftc.gov/",
    phone: "1-877-382-4357",
  },
  {
    name: "Local Police (Non-Emergency)",
    description: "File a report with your local police department. Ask for a report number — you may need it for your bank.",
    action: "Call your local non-emergency number",
    url: "",
    phone: "",
  },
  {
    name: "AARP Fraud Watch Network",
    description: "Free helpline staffed by trained fraud specialists who can guide you step by step.",
    action: "Call the helpline",
    url: "https://www.aarp.org/money/scams-fraud/fraud-watch-network/",
    phone: "1-877-908-3360",
  },
  {
    name: "Social Security Administration",
    description: "If someone used or asked for your Social Security number.",
    action: "Call SSA",
    url: "https://www.ssa.gov/",
    phone: "1-800-772-1213",
  },
  {
    name: "Medicare",
    description: "If someone asked for your Medicare number or pretended to be from Medicare.",
    action: "Call Medicare",
    url: "https://www.medicare.gov/",
    phone: "1-800-633-4227",
  },
];

export default function EmergencyPage() {
  return (
    <PageShell>
      <header className="mb-8">
        <div className="flex items-start gap-4">
          <span className="text-5xl" aria-hidden>
            🆘
          </span>
          <div>
            <h1 className="font-display text-[36px] text-text-primary">
              I Think I&apos;ve Been Scammed
            </h1>
            <p className="text-body text-text-secondary">
              Follow these steps right now. You are not alone, and it is not
              your fault.
            </p>
          </div>
        </div>
      </header>

      <div className="rounded-2xl border-2 border-danger bg-surface p-6 shadow-sm">
        <p className="font-display text-[22px] text-danger font-semibold">
          If you are in immediate danger, call 911.
        </p>
        <p className="mt-2 text-body text-text-primary">
          If someone is threatening you or says police are coming to arrest you
          unless you pay — that is a scam. Hang up and call your local police
          non-emergency number to confirm.
        </p>
      </div>

      <section aria-label="Steps to take" className="mt-8 space-y-6">
        <h2 className="font-display text-[28px] text-text-primary">
          What to do right now
        </h2>
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="rounded-2xl border border-border bg-surface p-6 shadow-sm print:avoid-break"
          >
            <div className="flex items-start gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-xl font-bold text-white"
                aria-hidden
              >
                {step.number}
              </span>
              <div>
                <h3 className="font-display text-[22px] text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-body text-text-primary">{step.body}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section
        aria-label="Where to report"
        className="mt-10 space-y-6"
      >
        <h2 className="font-display text-[28px] text-text-primary">
          Where to get help
        </h2>
        <p className="text-body text-text-secondary">
          These are real, trusted organizations that can help you. All of them
          are free.
        </p>
        {REPORT_RESOURCES.map((resource) => (
          <div
            key={resource.name}
            className="rounded-2xl border border-border bg-surface p-6 shadow-sm print:avoid-break"
          >
            <h3 className="font-display text-[22px] text-text-primary">
              {resource.name}
            </h3>
            <p className="mt-2 text-body text-text-primary">
              {resource.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {resource.url ? (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[56px] items-center rounded-xl bg-accent px-6 text-lg font-semibold text-white hover:bg-accent-hover"
                >
                  {resource.action}
                </a>
              ) : null}
              {resource.phone ? (
                <a
                  href={`tel:${resource.phone}`}
                  className="inline-flex min-h-[56px] items-center rounded-xl border-2 border-accent px-6 text-lg font-semibold text-accent hover:bg-surface-hover"
                >
                  Call {resource.phone}
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </section>

      <div className="mt-10 rounded-2xl border-2 border-success bg-surface p-6 shadow-sm">
        <p className="font-display text-[22px] text-success">
          Remember: You did nothing wrong.
        </p>
        <p className="mt-2 text-body text-text-primary">
          Scammers are criminals who use psychology and fear to trick people.
          Even the smartest, most careful people can be fooled. The important
          thing is that you are taking action now.
        </p>
      </div>

      <p className="mt-8 text-body">
        <Link
          href="/"
          className="text-accent underline min-h-[56px] inline-flex items-center"
        >
          ← Back to TechBuddy home
        </Link>
      </p>
    </PageShell>
  );
}
