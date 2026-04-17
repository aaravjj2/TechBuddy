import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { newRequestId } from "@/lib/telemetry";
import { auth } from "@/lib/auth";
import { PHONE_HELP_TOPICS } from "@/lib/phone-help";
import { checkRateLimit, ipKey } from "@/lib/rate-limit-v1";

export const runtime = "nodejs";

const bodySchema = z.object({
  topicSlug: z.string().trim().min(1).max(80),
});

export async function POST(req: NextRequest) {
  const requestId = newRequestId();
  const startedAt = Date.now();
  const route = "/api/v1/phone-help/complete";

  const rl = checkRateLimit(ipKey(req, "phone-complete"), {
    windowMs: 60 * 1000,
    max: 30,
  });
  if (!rl.success) {
    return fail("RATE_LIMITED", "Please wait a moment and try again.", {
      requestId,
      route,
      method: "POST",
      startedAt,
      status: 429,
      extraHeaders: {
        "Retry-After": String(rl.retryAfterSeconds),
      },
    });
  }

  let parsed: z.infer<typeof bodySchema>;
  try {
    const raw = await req.json();
    parsed = bodySchema.parse(raw);
  } catch {
    return fail("VALIDATION_ERROR", "Send a topic slug from the phone help guides.", {
      requestId,
      route,
      method: "POST",
      startedAt,
      status: 400,
    });
  }

  const topic = PHONE_HELP_TOPICS.find((t) => t.slug === parsed.topicSlug);
  if (!topic) {
    return fail("NOT_FOUND", "That phone help topic was not found.", {
      requestId,
      route,
      method: "POST",
      startedAt,
      status: 404,
    });
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;

  await prisma.phoneHelpSession
    .create({
      data: {
        userId,
        topic: topic.title,
        steps: JSON.stringify(
          topic.steps.map((s, i) => ({
            step: i + 1,
            instruction: s.instruction,
          }))
        ),
        completed: true,
        completedAt: new Date(),
      },
    })
    .catch(() => {
      /* best-effort */
    });

  return ok(
    { topic: topic.title, slug: topic.slug, recorded: true },
    { requestId, route, method: "POST", startedAt, userId }
  );
}
