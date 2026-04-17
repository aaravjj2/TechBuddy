import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { newRequestId } from "@/lib/telemetry";

export const runtime = "nodejs";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  year: z.coerce.number().int().min(1).max(3).optional(),
  month: z.coerce.number().int().min(1).max(36).optional(),
  domain: z.string().optional(),
  q: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const requestId = newRequestId();
  const startedAt = Date.now();
  const route = "/api/v1/artifacts";
  const { searchParams } = new URL(req.url);

  const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid query", {
      requestId,
      route,
      method: "GET",
      startedAt,
      status: 400,
    });
  }

  const { page, limit, year, month, domain, q } = parsed.data;
  const where: Record<string, unknown> = {};
  if (year) where.year = year;
  if (month) where.globalMonth = month;
  if (domain) where.domain = domain;
  if (q) {
    // SQLite LIKE is case-insensitive by default for ASCII; mode isn't supported.
    const needle = `%${q}%`;
    where.OR = [
      { title: { contains: needle } },
      { primaryGoal: { contains: needle } },
      { outcomes: { contains: needle } },
      { risks: { contains: needle } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.artifactPage.count({ where }),
    prisma.artifactPage.findMany({
      where,
      orderBy: { pageNumber: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const items = rows.map((r) => ({
    id: r.id,
    pageNumber: r.pageNumber,
    year: r.year,
    monthInYear: r.monthInYear,
    globalMonth: r.globalMonth,
    quarter: r.quarter,
    domain: r.domain,
    title: r.title,
    primaryGoal: r.primaryGoal,
    outcomes: safeParse(r.outcomes, []),
    metrics: safeParse(r.metrics, {}),
    risks: safeParse(r.risks, []),
    dod: r.dod,
  }));

  return ok(
    {
      items,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
    { requestId, route, method: "GET", startedAt }
  );
}

function safeParse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
