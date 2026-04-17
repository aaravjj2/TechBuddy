import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { newRequestId } from "@/lib/telemetry";
import { checkRateLimit, ipKey } from "@/lib/rate-limit-v1";
import { runAi, extractJson } from "@/lib/ai-client";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const bodySchema = z.object({
  text: z.string().trim().min(1, "Please paste the message you want checked.").max(5000),
  inputType: z.enum(["text", "email", "sms", "call", "website", "other"]).default("other"),
});

type ScamVerdict = "SCAM" | "SAFE" | "UNCERTAIN";
type ScamAiResponse = {
  verdict: ScamVerdict;
  confidenceScore: number;
  explanation: string;
  redFlags: string[];
  actionSteps: string[];
};

const SYSTEM = `You are TechBuddy's scam detection expert. Your job is to help
senior citizens identify scams. Always respond in plain, calm, non-alarmist
language. Never use jargon. Respond ONLY with valid JSON matching this schema:
{
  "verdict": "SCAM" | "SAFE" | "UNCERTAIN",
  "confidenceScore": number 0-100,
  "explanation": string,
  "redFlags": string[],
  "actionSteps": string[]
}
The explanation must be 3-5 sentences and use simple words a 70-year-old would
understand. Never add anything outside the JSON object.`;

export async function POST(req: NextRequest) {
  const requestId = newRequestId();
  const startedAt = Date.now();
  const route = "/api/v1/scam-check";

  // Rate limit: 10 requests per hour per IP
  const rl = checkRateLimit(ipKey(req, "scam-check"), {
    windowMs: 60 * 60 * 1000,
    max: 10,
  });
  if (!rl.success) {
    return fail(
      "RATE_LIMITED",
      "You've used this tool a lot recently. Please try again in a few minutes.",
      {
        requestId,
        route,
        method: "POST",
        startedAt,
        status: 429,
        extraHeaders: {
          "Retry-After": String(rl.retryAfterSeconds),
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      }
    );
  }

  let parsed: z.infer<typeof bodySchema>;
  try {
    const raw = await req.json();
    parsed = bodySchema.parse(raw);
  } catch (err) {
    const msg =
      err instanceof z.ZodError
        ? err.issues[0]?.message ?? "Invalid input"
        : "Please paste the text you want checked.";
    return fail("VALIDATION_ERROR", msg, {
      requestId,
      route,
      method: "POST",
      startedAt,
      status: 400,
    });
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;

  const ai = await runAi({
    system: SYSTEM,
    messages: [{ role: "user", content: parsed.text }],
    maxTokens: 600,
    temperature: 0.2,
    route,
    requestId,
  });

  if (!ai.ok) {
    return ok(
      {
        verdict: "UNCERTAIN" as ScamVerdict,
        confidenceScore: 0,
        explanation: ai.message,
        redFlags: [],
        actionSteps: [
          "Don't click any links or share any numbers.",
          "Ask someone you trust to look at this with you.",
          "Try again in a minute.",
        ],
        fallback: true,
      },
      { requestId, route, method: "POST", startedAt, userId }
    );
  }

  const json = extractJson<ScamAiResponse>(ai.text);
  if (!json || !["SCAM", "SAFE", "UNCERTAIN"].includes(json.verdict)) {
    return ok(
      {
        verdict: "UNCERTAIN" as ScamVerdict,
        confidenceScore: 40,
        explanation:
          "TechBuddy couldn't give a clear answer this time. When in doubt, don't click, don't pay, and ask someone you trust.",
        redFlags: [],
        actionSteps: [
          "Don't click any links or share any numbers.",
          "Call the company using the phone number on your bill or card, not one from the message.",
        ],
        fallback: true,
      },
      { requestId, route, method: "POST", startedAt, userId }
    );
  }

  // Persist best-effort (don't block the response on failure)
  prisma.scamCheck
    .create({
      data: {
        userId,
        inputText: parsed.text,
        inputType: parsed.inputType,
        verdict: json.verdict,
        confidenceScore: clampInt(json.confidenceScore, 0, 100),
        reasoning: json.explanation,
        redFlags: JSON.stringify(json.redFlags ?? []),
        actionSteps: JSON.stringify(json.actionSteps ?? []),
      },
    })
    .catch(() => {
      /* ignore — persistence is best-effort */
    });

  return ok(
    {
      verdict: json.verdict,
      confidenceScore: clampInt(json.confidenceScore, 0, 100),
      explanation: json.explanation,
      redFlags: json.redFlags ?? [],
      actionSteps: json.actionSteps ?? [],
      model: ai.model,
    },
    { requestId, route, method: "POST", startedAt, userId }
  );
}

function clampInt(n: unknown, min: number, max: number): number {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}
