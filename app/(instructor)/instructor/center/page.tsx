import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

const DOMAIN = "Partnerships and Community Centers";
const GATE_TARGET = 85;

async function scheduleEnablement(formData: FormData) {
  "use server";
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")
  ) {
    return;
  }

  const dateRaw = String(formData.get("date") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  if (!dateRaw) return;

  const d = new Date(dateRaw);
  if (Number.isNaN(d.getTime())) return;
  const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  await prisma.milestoneRecord.create({
    data: {
      month,
      domain: DOMAIN,
      completionPct: 100,
      gateTarget: GATE_TARGET,
      passed: true,
      notes: notes || `Partner enablement session scheduled for ${dateRaw}`,
    },
  });

  revalidatePath("/instructor/center");
}

export default async function InstructorCenterPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const center = userId
    ? await prisma.communityCenter.findFirst({
        where: { coordinatorId: userId },
        include: {
          coordinator: { select: { name: true, email: true } },
          _count: { select: { learners: true } },
        },
      })
    : null;

  let activeLearners = 0;
  let lastSessionDate: Date | null = null;

  if (center) {
    const [activeAgg, lastScam, lastPractice, lastPhone] = await Promise.all([
      prisma.user.count({
        where: {
          centerId: center.id,
          role: "SENIOR",
          OR: [
            {
              scamChecks: {
                some: {
                  createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  },
                },
              },
            },
            {
              practiceRuns: {
                some: {
                  createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  },
                },
              },
            },
            {
              phoneSessions: {
                some: {
                  createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  },
                },
              },
            },
          ],
        },
      }),
      prisma.scamCheck.findFirst({
        where: { user: { centerId: center.id } },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      prisma.practiceSession.findFirst({
        where: { user: { centerId: center.id } },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      prisma.phoneHelpSession.findFirst({
        where: { user: { centerId: center.id } },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);
    activeLearners = activeAgg;
    const candidates = [lastScam?.createdAt, lastPractice?.createdAt, lastPhone?.createdAt].filter(
      Boolean
    ) as Date[];
    lastSessionDate =
      candidates.length > 0
        ? candidates.sort((a, b) => b.getTime() - a.getTime())[0]
        : null;
  }

  const recentEnablements = await prisma.milestoneRecord.findMany({
    where: { domain: DOMAIN },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-senior-2xl font-semibold text-neutral-900">
          Center
        </h1>
        <p className="mt-1 text-senior-base text-neutral-700">
          Manage your community center, download partner kits, and schedule
          enablement.
        </p>
      </header>

      {center ? (
        <Card tone="trust">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{center.name}</CardTitle>
              <CardDescription>
                {center.city}, {center.state}
              </CardDescription>
              <p className="mt-2 text-senior-sm text-neutral-600">
                Coordinator:{" "}
                <span className="font-medium text-neutral-900">
                  {center.coordinator?.name ?? center.coordinator?.email ?? "You"}
                </span>
              </p>
            </div>
            <Badge tone="trust">Community Center</Badge>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-senior border border-neutral-200 p-4">
              <dt className="text-senior-sm text-neutral-600">Enrolled learners</dt>
              <dd className="mt-1 text-senior-xl font-semibold text-neutral-900">
                {center._count.learners}
              </dd>
            </div>
            <div className="rounded-senior border border-neutral-200 p-4">
              <dt className="text-senior-sm text-neutral-600">
                Active (last 30 days)
              </dt>
              <dd className="mt-1 text-senior-xl font-semibold text-neutral-900">
                {activeLearners}
              </dd>
            </div>
            <div className="rounded-senior border border-neutral-200 p-4">
              <dt className="text-senior-sm text-neutral-600">Last session</dt>
              <dd className="mt-1 text-senior-xl font-semibold text-neutral-900">
                {lastSessionDate
                  ? format(lastSessionDate, "yyyy-MM-dd")
                  : "—"}
              </dd>
            </div>
          </dl>
        </Card>
      ) : (
        <Card tone="warn">
          <CardTitle>No center assigned yet</CardTitle>
          <CardDescription>
            This account isn&apos;t linked as a coordinator for any community
            center. Ask an admin to assign one, and the stats below will populate
            automatically.
          </CardDescription>
        </Card>
      )}

      <section
        aria-labelledby="kits-heading"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <h2 id="kits-heading" className="sr-only">
          Partner kits
        </h2>
        <Card>
          <CardTitle>Onboarding guide</CardTitle>
          <CardDescription>
            A short printable PDF to help new coordinators set up a class.
          </CardDescription>
          <a
            href="/kits/onboarding.pdf"
            download
            className="mt-4 inline-flex min-h-touch items-center justify-center rounded-senior border-2 border-trust-500 bg-white px-4 text-senior-base font-semibold text-trust-700 hover:bg-trust-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
          >
            Download onboarding guide
          </a>
        </Card>
        <Card>
          <CardTitle>Classroom guide</CardTitle>
          <CardDescription>
            A lesson-by-lesson facilitator&apos;s handbook for your class.
          </CardDescription>
          <a
            href="/kits/classroom.pdf"
            download
            className="mt-4 inline-flex min-h-touch items-center justify-center rounded-senior border-2 border-trust-500 bg-white px-4 text-senior-base font-semibold text-trust-700 hover:bg-trust-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
          >
            Download classroom guide
          </a>
        </Card>
      </section>

      <Card>
        <CardTitle>Schedule a partner enablement session</CardTitle>
        <CardDescription>
          Record a planned session with a partner. Saving this will log a
          milestone under &ldquo;{DOMAIN}&rdquo; for the session month.
        </CardDescription>

        <form
          action={scheduleEnablement}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div>
            <label
              htmlFor="enablement-date"
              className="block text-senior-sm font-medium text-neutral-800"
            >
              Session date
            </label>
            <input
              id="enablement-date"
              type="date"
              name="date"
              required
              className="mt-1 block w-full min-h-touch rounded-senior border-2 border-neutral-300 bg-white px-4 text-senior-base text-neutral-900 focus:border-trust-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="enablement-notes"
              className="block text-senior-sm font-medium text-neutral-800"
            >
              Notes
            </label>
            <textarea
              id="enablement-notes"
              name="notes"
              rows={4}
              placeholder="Agenda, attendees, or focus topics"
              className="mt-1 block w-full rounded-senior border-2 border-neutral-300 bg-white px-4 py-3 text-senior-base text-neutral-900 focus:border-trust-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex min-h-touch items-center justify-center rounded-senior bg-trust-700 px-5 text-senior-base font-semibold text-white hover:bg-trust-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
            >
              Save session
            </button>
          </div>
        </form>

        {recentEnablements.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-senior-base font-semibold text-neutral-900">
              Recent enablement records
            </h3>
            <ul className="mt-2 divide-y divide-neutral-200">
              {recentEnablements.map((r) => (
                <li key={r.id} className="py-3">
                  <p className="text-senior-base text-neutral-900">
                    {r.month} — {r.notes ?? "No notes"}
                  </p>
                  <p className="text-senior-sm text-neutral-500">
                    Logged {format(r.createdAt, "yyyy-MM-dd HH:mm")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
