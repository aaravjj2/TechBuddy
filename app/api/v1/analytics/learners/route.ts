import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";
import { newRequestId } from "@/lib/telemetry";

export const runtime = "nodejs";

const ACTIVE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const requestId = newRequestId();
  const startedAt = Date.now();
  const route = "/api/v1/analytics/learners";

  const session = await auth();
  if (
    session?.user?.role !== "INSTRUCTOR" &&
    session?.user?.role !== "ADMIN"
  ) {
    return fail("FORBIDDEN", "Instructors only.", {
      requestId,
      route,
      method: "GET",
      startedAt,
      status: 403,
    });
  }

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("limit") ?? "25") || 25)
  );
  const q = (url.searchParams.get("q") ?? "").trim();
  const status = (url.searchParams.get("status") ?? "all") as
    | "all"
    | "active"
    | "inactive";

  const where = {
    role: "SENIOR" as const,
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : {}),
  };

  try {
    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        scamChecks: {
          select: { createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        practiceRuns: {
          select: { createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        phoneSessions: {
          select: { createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        metrics: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: {
            scamChecks: true,
            practiceRuns: true,
            phoneSessions: true,
          },
        },
      },
    });

    const now = Date.now();
    const rows = users.map((u) => {
      const lastActive = [
        u.scamChecks[0]?.createdAt,
        u.practiceRuns[0]?.createdAt,
        u.phoneSessions[0]?.createdAt,
      ]
        .filter(Boolean)
        .sort((a, b) => (b as Date).getTime() - (a as Date).getTime())[0] as
        | Date
        | undefined;
      const isActive =
        !!lastActive && now - lastActive.getTime() <= ACTIVE_WINDOW_MS;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        joined: u.createdAt.toISOString(),
        lastActive: lastActive ? lastActive.toISOString() : null,
        sessions:
          u._count.scamChecks + u._count.practiceRuns + u._count.phoneSessions,
        completionRate: u.metrics[0]?.completionRate ?? 0,
        taskSuccessRate: u.metrics[0]?.taskSuccessRate ?? 0,
        isActive,
        status: isActive ? "active" : "inactive",
      };
    });

    const filtered =
      status === "all"
        ? rows
        : rows.filter((r) => (status === "active" ? r.isActive : !r.isActive));

    return ok(
      {
        page,
        limit,
        total,
        pageCount: Math.max(1, Math.ceil(total / limit)),
        appliedStatus: status,
        query: q,
        learners: filtered,
      },
      {
        requestId,
        route,
        method: "GET",
        startedAt,
        userId: session.user.id,
      }
    );
  } catch (err) {
    return fail(
      "INTERNAL",
      err instanceof Error ? err.message : "Unknown error.",
      {
        requestId,
        route,
        method: "GET",
        startedAt,
        status: 500,
        userId: session.user.id,
      }
    );
  }
}
