import { PageShell } from "@/components/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell>
      <h1 className="mb-6 font-display text-[36px] text-text-primary">
        Privacy
      </h1>
      <div className="space-y-6 text-body text-text-primary">
        <p>
          TechBuddy is built for senior centers and learners. We want you to
          understand in plain language what happens when you use this site.
        </p>
        <section>
          <h2 className="font-display text-[24px] text-text-primary">
            No accounts
          </h2>
          <p className="mt-2 text-text-secondary">
            You do not need to sign up or log in. We do not store a password for
            you on this site.
          </p>
        </section>
        <section>
          <h2 className="font-display text-[24px] text-text-primary">
            When you use the scam checker or AI chat
          </h2>
          <p className="mt-2 text-text-secondary">
            The words you type are sent to our server and then to Z.ai (an AI
            service) so the app can answer you. Practice mode also sends your
            messages to the AI for the training simulation. Phone Help and Quick
            Tips do not use AI—they use text we wrote ahead of time.
          </p>
        </section>
        <section>
          <h2 className="font-display text-[24px] text-text-primary">
            What we do not do
          </h2>
          <p className="mt-2 text-text-secondary">
            We do not sell your messages. This project is for education and
            safety. If you deploy your own copy, your host (for example Vercel)
            may keep basic technical logs—check their policy.
          </p>
        </section>
        <section>
          <h2 className="font-display text-[24px] text-text-primary">
            Questions
          </h2>
          <p className="mt-2 text-text-secondary">
            Ask a staff member at your senior center, or the team running this
            hackathon project, if you want more detail.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
