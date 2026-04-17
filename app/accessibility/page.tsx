import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description:
    "TechBuddy is built for seniors. We promise calm layouts, large text, high contrast, full keyboard support, and a real human to contact if something is hard to use.",
};

export default function AccessibilityPage() {
  return (
    <PageShell>
      <header className="mb-8">
        <h1 className="font-display text-[36px] text-text-primary">
          Accessibility at TechBuddy
        </h1>
        <p className="mt-3 text-body text-text-secondary">
          Updated every month. If anything here is hard to use, that is our
          fault to fix — not yours.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-[26px] text-text-primary">
          Our promise
        </h2>
        <ul className="list-disc space-y-3 pl-6 text-body">
          <li>
            Every page has large, easy-to-read text. You can make it even bigger
            with the buttons at the bottom of any page.
          </li>
          <li>
            The whole app works with the keyboard alone — no mouse needed. Press
            <kbd className="mx-1 rounded border border-border bg-surface px-2 py-0.5">
              Tab
            </kbd>
            to move forward,{" "}
            <kbd className="mx-1 rounded border border-border bg-surface px-2 py-0.5">
              Shift + Tab
            </kbd>
            to move back, and{" "}
            <kbd className="mx-1 rounded border border-border bg-surface px-2 py-0.5">
              Enter
            </kbd>
            to choose.
          </li>
          <li>
            Screen readers are supported. Every button, image, and message has a
            clear label.
          </li>
          <li>
            We check every page with automated accessibility tools (axe-core)
            before it ships, and we fix any critical or serious problems before
            release.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-[26px] text-text-primary">
          How to make text bigger
        </h2>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-[22px] text-text-primary">
            On an iPhone or iPad
          </h3>
          <ol className="mt-2 list-decimal space-y-1 pl-6 text-body">
            <li>Open the Settings app.</li>
            <li>Tap Display &amp; Brightness.</li>
            <li>Tap Text Size and drag the slider to the right.</li>
          </ol>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-[22px] text-text-primary">
            On an Android phone
          </h3>
          <ol className="mt-2 list-decimal space-y-1 pl-6 text-body">
            <li>Open the Settings app.</li>
            <li>Tap Display, then Font size.</li>
            <li>Drag the slider to the right until it is comfortable.</li>
          </ol>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-[22px] text-text-primary">
            On a Windows computer
          </h3>
          <ol className="mt-2 list-decimal space-y-1 pl-6 text-body">
            <li>Press the Windows key and type &quot;Make text larger&quot;.</li>
            <li>Open the accessibility setting that appears.</li>
            <li>Drag the slider until the preview feels right, then click Apply.</li>
          </ol>
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-[26px] text-text-primary">
          Contact a person
        </h2>
        <p className="text-body">
          If something here is hard to use, or you would like help from a real
          person, ask your community center coordinator or email{" "}
          <a
            href="mailto:hello@techbuddy.example"
            className="font-semibold text-accent underline underline-offset-4"
          >
            hello@techbuddy.example
          </a>
          . We answer every message.
        </p>
      </section>
    </PageShell>
  );
}
