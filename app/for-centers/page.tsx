import { PageShell } from "@/components/PageShell";
import { PrintButton } from "@/components/PrintButton";

export default function ForCentersPage() {
  return (
    <PageShell className="print:bg-white print:text-black">
      <div className="print-avoid-break">
        <h1 className="mb-4 font-display text-[36px] text-text-primary print:text-black">
          TechBuddy — for staff &amp; volunteers
        </h1>
        <p className="mb-6 text-body text-text-secondary print:text-gray-800">
          One-page summary you can print for a desk or tablet station.
        </p>
        <div className="mb-8 print:hidden">
          <PrintButton />
        </div>

        <section className="mb-8 space-y-4 text-body text-text-primary print:text-black">
          <h2 className="font-display text-[28px] text-text-primary print:text-black">
            What it is
          </h2>
          <p>
            TechBuddy is a free web app for senior centers: large text, simple
            screens, and no login. It helps with scams, phone basics, AI
            questions, safe practice conversations, and daily tips.
          </p>

          <h2 className="pt-4 font-display text-[28px] text-text-primary print:text-black">
            How to use it at your center
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Open the site on a tablet or computer browser (Chrome or Safari
              work well).
            </li>
            <li>
              Bookmark the deployed link: replace{" "}
              <strong className="font-semibold">YOUR_DEPLOYED_URL</strong> on
              your printed sheet after you deploy (for example with Vercel).
            </li>
            <li>No account is required—seniors tap Home to return to the menu.</li>
          </ul>

          <h2 className="pt-4 font-display text-[28px] text-text-primary print:text-black">
            The five areas
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Is This a Scam?</strong> — Paste a message; get a clear
              safe / scam / unsure result.
            </li>
            <li>
              <strong>Help With My Phone</strong> — Step-by-step guides (WiFi,
              screenshots, video calls, etc.).
            </li>
            <li>
              <strong>What Is AI?</strong> — Simple chat about artificial
              intelligence.
            </li>
            <li>
              <strong>Practice Mode</strong> — Safe pretend scam calls with
              feedback at the end.
            </li>
            <li>
              <strong>Quick Tips</strong> — One short tip per day.
            </li>
          </ul>

          <h2 className="pt-4 font-display text-[28px] text-text-primary print:text-black">
            Support
          </h2>
          <p>
            Built for GenLink-style missions: technology literacy and scam
            awareness for older adults. For technical issues, contact whoever
            deployed this copy or the student team behind the project.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
