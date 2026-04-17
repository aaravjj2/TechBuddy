/**
 * Legacy scam checker shape used by /scam-checker UI and /api/scam-check.
 * Uses runAi (Anthropic → Z.AI fallback) and the senior-first JSON prompt.
 */

import { runAi } from "@/lib/ai-client";
import { parseJsonFromModelText } from "@/lib/json";
import { SCAM_CHECK_SYSTEM } from "@/lib/prompts";
import type { ScamCheckResult } from "@/lib/types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function coerceScamCheckResult(raw: unknown): ScamCheckResult | null {
  if (!isRecord(raw)) return null;
  const verdict = raw.verdict;
  if (verdict !== "SCAM" && verdict !== "SAFE" && verdict !== "SUSPICIOUS") {
    return null;
  }
  if (typeof raw.headline !== "string" || typeof raw.explanation !== "string") {
    return null;
  }
  const out: ScamCheckResult = {
    verdict,
    headline: raw.headline,
    explanation: raw.explanation,
  };
  if (Array.isArray(raw.warning_signs)) {
    out.warning_signs = raw.warning_signs.map(String);
  }
  if (Array.isArray(raw.action_steps)) {
    out.action_steps = raw.action_steps.map(String);
  }
  if (typeof raw.already_clicked === "string") {
    out.already_clicked = raw.already_clicked;
  }
  return out;
}

function verdictToConfidence(verdict: ScamCheckResult["verdict"]): number {
  if (verdict === "SCAM") return 88;
  if (verdict === "SAFE") return 86;
  return 55;
}

export type ScamCheckRunResult =
  | { ok: true; result: ScamCheckResult; model: string }
  | { ok: false; error: string; status: number };

export async function runLegacyScamCheck(
  message: string,
  opts: { route?: string; requestId?: string }
): Promise<ScamCheckRunResult> {
  const trimmed = message.trim();
  if (!trimmed) {
    return { ok: false, error: "Missing message", status: 400 };
  }

  const ai = await runAi({
    system: SCAM_CHECK_SYSTEM,
    messages: [{ role: "user", content: trimmed }],
    maxTokens: 1200,
    temperature: 0.25,
    route: opts.route ?? "/api/scam-check",
    requestId: opts.requestId,
  });

  if (!ai.ok) {
    return {
      ok: true,
      model: ai.model,
      result: {
        verdict: "SUSPICIOUS",
        headline: "We could not finish the check right now",
        explanation: ai.message,
        action_steps: [
          "Do not click any links or send money.",
          "Ask someone you trust to read the message with you.",
          "Try again in a few minutes.",
        ],
      },
    };
  }

  let parsed: unknown;
  try {
    parsed = parseJsonFromModelText(ai.text);
  } catch {
    return {
      ok: false,
      error: "Could not parse scam check result",
      status: 502,
    };
  }

  const result = coerceScamCheckResult(parsed);
  if (!result) {
    return { ok: false, error: "Invalid scam check shape", status: 502 };
  }

  return { ok: true, result, model: ai.model };
}

export function scamResultToPrismaPayload(result: ScamCheckResult, inputText: string) {
  return {
    inputText,
    inputType: "other" as const,
    verdict: result.verdict,
    confidenceScore: verdictToConfidence(result.verdict),
    reasoning: `${result.headline}\n\n${result.explanation}`,
    redFlags: JSON.stringify(result.warning_signs ?? []),
    actionSteps: JSON.stringify(result.action_steps ?? []),
  };
}
