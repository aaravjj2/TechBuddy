// prisma/seed.ts
// Seeds TechBuddy's SQLite dev database:
//   - A community center + coordinator (INSTRUCTOR)
//   - Three SENIOR learners with varied completion histories
//   - 20 ScamCheck records, 15 PhoneHelpSessions, 10 PracticeSessions
//   - 360 ArtifactPage records spanning Year 1–3 × 10 domains × 36 months
//   - 12 monthly MilestoneRecord rows for the current mission-alignment gate
// Re-running is idempotent: upserts on pageNumber / email.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DOMAINS = [
  "Frontend Experience and Design",
  "Accessibility and Inclusion",
  "AI Safety and Content",
  "Backend and Data",
  "Privacy and Security",
  "Operations and Reliability",
  "Partnerships and Community Centers",
  "Research and Learning",
  "Impact and Measurement",
  "Governance and Program",
];

const DOMAIN_GOALS: Record<string, string[]> = {
  "Frontend Experience and Design": [
    "Tune core senior journeys for calm, legible, one-thing-per-screen flows",
    "Expand visual language for reading comfort at 125% and 150% zoom",
    "Ship a component library that enforces 48px touch targets by default",
    "Replace unclear icon-only controls with icon + label pairs everywhere",
  ],
  "Accessibility and Inclusion": [
    "Close all critical axe-core violations on top-10 visited routes",
    "Run a live usability session with seniors using screen readers",
    "Publish an accessibility statement with contact-for-help workflow",
    "Pilot reduced-motion and high-contrast toggles on production traffic",
  ],
  "AI Safety and Content": [
    "Calibrate scam checker confidence scoring against a labeled test set",
    "Add human-read review queue for low-confidence verdicts",
    "Expand practice scenario library with 24 new fully-seeded roleplays",
    "Audit every AI response surface for plain-language compliance",
  ],
  "Backend and Data": [
    "Lock in versioned /api/v1 contracts with typed error envelopes",
    "Cut p95 route latency below 350ms for scam-check and practice",
    "Add per-route rate limits with graceful 429 messaging for seniors",
    "Promote telemetry ring buffer to a durable, queryable store",
  ],
  "Privacy and Security": [
    "Publish a plain-language data-handling notice with 7 scenarios",
    "Rotate every long-lived credential and document an annual cadence",
    "Implement row-level authorization checks across instructor routes",
    "Red-team the scam checker for social-engineering prompt injection",
  ],
  "Operations and Reliability": [
    "Ship staging + preview deploys with automated smoke tests on every PR",
    "Add synthetic health probes to /api/v1/health every 60 seconds",
    "Establish incident post-mortem template focused on dignity, not blame",
    "Write a runbook for AI provider outage and graceful degradation",
  ],
  "Partnerships and Community Centers": [
    "Onboard three additional community centers with paired coordinators",
    "Package a reusable onboarding kit with print-ready classroom guide",
    "Run monthly partner enablement sessions with feedback capture",
    "Track per-center activation funnel to first-completed-journey",
  ],
  "Research and Learning": [
    "Interview eight seniors about the what-is-ai learning experience",
    "Publish a library of real-world scam artifacts with consent",
    "Synthesize monthly research digests cross-linking UX and telemetry",
    "Pilot a co-design session with a local senior advocacy council",
  ],
  "Impact and Measurement": [
    "Grow month-over-month active learners while holding completion rate",
    "Report confidence gain per journey against a pre/post baseline",
    "Publish quarterly impact brief with partner-verified outcomes",
    "Define North Star metric: learners who identify a live scam within 30 days",
  ],
  "Governance and Program": [
    "Close the month with a mission-alignment score above this year's gate",
    "Review risk register with every coordinator, archive stale items",
    "Ship a public changelog summarizing user-visible changes monthly",
    "Confirm next-quarter OKRs against the rolling 90-day plan",
  ],
};

const RISKS_BY_DOMAIN: Record<string, string[]> = {
  "Frontend Experience and Design": [
    "Hidden regressions for screen-reader users after visual overhaul",
    "Component library drift between ad-hoc pages and the canonical set",
  ],
  "Accessibility and Inclusion": [
    "False sense of safety from automated scans missing context failures",
    "Low participation in live usability sessions without stipends",
  ],
  "AI Safety and Content": [
    "Model provider outage breaking the scam checker in a critical moment",
    "Over-confident verdicts misleading a senior to act on a real scam",
  ],
  "Backend and Data": [
    "Noisy telemetry drowning out real performance regressions",
    "Schema migration windows coinciding with partner training sessions",
  ],
  "Privacy and Security": [
    "Credential rotation missing a dormant deployment target",
    "Prompt-injection surface in user-pasted text reaching internal tools",
  ],
  "Operations and Reliability": [
    "Flaky synthetic probes causing pager fatigue and ignored real alerts",
    "Long-tail mobile browsers breaking after a new framework upgrade",
  ],
  "Partnerships and Community Centers": [
    "Coordinator turnover stalling activation at newly onboarded centers",
    "Onboarding kit becoming out-of-date faster than we can republish it",
  ],
  "Research and Learning": [
    "Selection bias from recruiting seniors only through existing partners",
    "Insight decay: findings published too late to influence the next cycle",
  ],
  "Impact and Measurement": [
    "Goodhart risk: optimizing a proxy metric away from real safety outcomes",
    "Survivorship bias: we only hear from seniors still engaged",
  ],
  "Governance and Program": [
    "Decisions made without coordinator input eroding center partnership",
    "Mission-alignment scoring drifting from the original senior-first charter",
  ],
};

function gateForYear(y: number): number {
  return y === 1 ? 85 : y === 2 ? 90 : 92;
}

function asJson(v: unknown): string {
  return JSON.stringify(v);
}

async function seedArtifacts() {
  for (let n = 1; n <= 360; n++) {
    const year = Math.ceil(n / 120);
    const localMonth = n % 120 === 0 ? 120 : n % 120;
    const monthInYear = Math.ceil(localMonth / 10);
    const globalMonth = Math.ceil(n / 10);
    const quarter = Math.ceil(globalMonth / 3);
    const domainIdx = ((n - 1) % 10) + 1;
    const domain = DOMAINS[domainIdx - 1];
    const goalPool = DOMAIN_GOALS[domain];
    const primaryGoal = goalPool[(globalMonth - 1) % goalPool.length];

    const outcomes = [
      `Publish concrete evidence that ${primaryGoal.toLowerCase()}`,
      `Leave ${domain.toLowerCase()} in a better state than last month`,
      `Document what worked and what we changed our minds about`,
      `Share a short demo or write-up with partner coordinators`,
    ];

    const gateTarget = gateForYear(year);
    const baseProgress = Math.min(99, 60 + ((globalMonth * 3) % 38));
    const metrics = {
      missionAlignmentPct: baseProgress,
      gateTarget,
      activeLearners: 120 + globalMonth * 18,
      completionRate: 0.52 + ((globalMonth % 11) * 0.03),
      newPartners: year === 1 ? 1 : 2,
    };

    const risks = RISKS_BY_DOMAIN[domain].map((r) => ({
      risk: r,
      mitigation: `Pair this with a small, low-risk experiment before month ${globalMonth + 1}.`,
      owner: domain,
    }));

    const title = `Page ${n} · Year ${year} Month ${monthInYear} — ${domain}`;
    const dod =
      `Success means: (1) ${primaryGoal.toLowerCase()}; (2) mission alignment at or above ${gateTarget}%; ` +
      `(3) a dated summary lives in the artifacts gallery; (4) the next month's plan explicitly references this work.`;

    await prisma.artifactPage.upsert({
      where: { pageNumber: n },
      update: {
        year,
        monthInYear,
        globalMonth,
        quarter,
        domain,
        title,
        primaryGoal,
        outcomes: asJson(outcomes),
        metrics: asJson(metrics),
        risks: asJson(risks),
        dod,
      },
      create: {
        pageNumber: n,
        year,
        monthInYear,
        globalMonth,
        quarter,
        domain,
        title,
        primaryGoal,
        outcomes: asJson(outcomes),
        metrics: asJson(metrics),
        risks: asJson(risks),
        dod,
      },
    });
  }
  // eslint-disable-next-line no-console
  console.log("Seeded 360 ArtifactPage records.");
}

async function seedUsersAndCenter() {
  const instructorPassword = await bcrypt.hash("TestPass123", 10);
  const seniorPassword = await bcrypt.hash("SeniorPass123", 10);

  // Center first (without coordinatorId, then link)
  const center = await prisma.communityCenter.upsert({
    where: { id: "center-demo" },
    update: {},
    create: {
      id: "center-demo",
      name: "Maplewood Senior Center",
      city: "Portland",
      state: "OR",
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@test.com" },
    update: {
      role: "INSTRUCTOR",
      passwordHash: instructorPassword,
      name: "Pat Coordinator",
    },
    create: {
      email: "instructor@test.com",
      name: "Pat Coordinator",
      role: "INSTRUCTOR",
      passwordHash: instructorPassword,
    },
  });

  await prisma.communityCenter.update({
    where: { id: center.id },
    data: { coordinatorId: instructor.id },
  });

  const seniorsData = [
    { email: "senior1@test.com", name: "Eleanor M.", completion: 0.82 },
    { email: "senior2@test.com", name: "George D.", completion: 0.45 },
    { email: "senior3@test.com", name: "Mei L.", completion: 0.95 },
  ];

  for (const s of seniorsData) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {
        role: "SENIOR",
        passwordHash: seniorPassword,
        name: s.name,
        centerId: center.id,
      },
      create: {
        email: s.email,
        name: s.name,
        role: "SENIOR",
        passwordHash: seniorPassword,
        centerId: center.id,
      },
    });

    // Learner metrics for last 6 months
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      await prisma.learnerMetric.upsert({
        where: { userId_month: { userId: user.id, month } },
        update: {
          taskSuccessRate: s.completion,
          sessionCount: 4 + i,
          completionRate: s.completion - i * 0.03,
        },
        create: {
          userId: user.id,
          month,
          taskSuccessRate: s.completion,
          sessionCount: 4 + i,
          completionRate: Math.max(0, s.completion - i * 0.03),
        },
      });
    }
  }

  const allSeniors = await prisma.user.findMany({
    where: { role: "SENIOR" },
  });

  // Wipe and reseed sample activity (dev-only, idempotent via count)
  const existingScam = await prisma.scamCheck.count();
  if (existingScam < 20) {
    const samples = [
      { text: "We tried to deliver your package. Pay $2.99 to reschedule: http://fedx-reship.co", verdict: "SCAM" },
      { text: "Your doctor appointment with Dr. Kim is tomorrow at 2pm.", verdict: "SAFE" },
      { text: "IRS final notice — call 800-555-0199 immediately to avoid arrest.", verdict: "SCAM" },
      { text: "Hi dear, it's your grandson. I'm in trouble and need $500 wired.", verdict: "SCAM" },
      { text: "Reminder: Library book due on Friday.", verdict: "SAFE" },
      { text: "Your bank account has been suspended. Click here to verify.", verdict: "SCAM" },
      { text: "New message from Medicare: your benefits may change.", verdict: "UNCERTAIN" },
      { text: "Thanks for subscribing to the community newsletter.", verdict: "SAFE" },
    ];
    for (let i = 0; i < 20; i++) {
      const s = samples[i % samples.length];
      const u = allSeniors[i % allSeniors.length];
      await prisma.scamCheck.create({
        data: {
          userId: u?.id,
          inputText: s.text,
          inputType: "other",
          verdict: s.verdict,
          confidenceScore: s.verdict === "UNCERTAIN" ? 55 : 85,
          reasoning: "Seeded sample verdict for dashboard demos.",
          redFlags: asJson(s.verdict === "SCAM" ? ["Urgency", "Unknown sender", "Asks for money"] : []),
          actionSteps: asJson(
            s.verdict === "SCAM"
              ? ["Do not click any links", "Verify by phone with a known number"]
              : ["No action needed"]
          ),
        },
      });
    }
  }

  const existingPhone = await prisma.phoneHelpSession.count();
  if (existingPhone < 15) {
    const topics = [
      "make-a-phone-call",
      "send-a-text-message",
      "take-a-photo",
      "connect-to-wifi",
      "block-a-caller",
    ];
    for (let i = 0; i < 15; i++) {
      const u = allSeniors[i % allSeniors.length];
      await prisma.phoneHelpSession.create({
        data: {
          userId: u?.id,
          topic: topics[i % topics.length],
          steps: asJson([
            "Open the app",
            "Tap the big button",
            "Confirm the action",
          ]),
          completed: i % 3 !== 0,
          completedAt: i % 3 !== 0 ? new Date() : null,
        },
      });
    }
  }

  const existingPractice = await prisma.practiceSession.count();
  if (existingPractice < 10) {
    const scenarios = [
      "caller-tax-scam",
      "package-delay",
      "password-expired",
      "medicare-info",
      "popup-virus",
    ];
    for (let i = 0; i < 10; i++) {
      const u = allSeniors[i % allSeniors.length];
      await prisma.practiceSession.create({
        data: {
          userId: u?.id,
          scenario: scenarios[i % scenarios.length],
          messages: asJson([
            { role: "assistant", content: "Hello, this is the IRS calling." },
            { role: "user", content: "I don't believe you. Goodbye." },
          ]),
          score: 3 + (i % 3),
          feedback: "Great job — you hung up and didn't share any information.",
        },
      });
    }
  }

  // Monthly milestone records for the last 12 months
  for (let i = 0; i < 12; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    for (const domain of DOMAINS) {
      const completionPct = 70 + ((i + DOMAINS.indexOf(domain)) % 30);
      const gateTarget = 85;
      await prisma.milestoneRecord
        .create({
          data: {
            month,
            domain,
            completionPct,
            gateTarget,
            passed: completionPct >= gateTarget,
            notes: null,
          },
        })
        .catch(() => {
          /* tolerate duplicates if re-run */
        });
    }
  }

  // eslint-disable-next-line no-console
  console.log("Seeded center, users, sample activity, and milestones.");
}

async function main() {
  await seedUsersAndCenter();
  await seedArtifacts();
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
