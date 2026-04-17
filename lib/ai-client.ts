// lib/ai-client.ts
// Unified AI wrapper for TechBuddy. Prefers Anthropic (claude-sonnet-4-5) when
// ANTHROPIC_API_KEY is set; otherwise falls back to the existing Z.AI client.
// All AI calls flow through here so we get consistent timeouts, fallbacks, and
// telemetry-friendly responses.

import Anthropic from "@anthropic-ai/sdk";
import { logAiCall } from "@/lib/telemetry";

export type AiMessage = { role: "user" | "assistant"; content: string };

export type AiResult =
  | { ok: true; text: string; model: string; latencyMs: number }
  | { ok: false; fallback: true; message: string; model: string; latencyMs: number; reason: string };

const FALLBACK_MESSAGE =
  "TechBuddy is taking a moment. Please try again in a minute. If the problem continues, ask someone you trust for help.";

const DEFAULT_MODEL =
  process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

let anthropicClient: Anthropic | null = null;
function getAnthropic(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

/** Call an LLM with a 15s timeout and a friendly fallback on any failure. */
export async function runAi(opts: {
  system: string;
  messages: AiMessage[];
  maxTokens?: number;
  temperature?: number;
  route?: string;
  requestId?: string;
}): Promise<AiResult> {
  const { system, messages, maxTokens = 800, temperature = 0.4 } = opts;
  const started = Date.now();
  const timeoutMs = 15_000;

  const anthropic = getAnthropic();

  // Path A: Anthropic Messages API
  if (anthropic) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const res = await anthropic.messages.create(
        {
          model: DEFAULT_MODEL,
          max_tokens: maxTokens,
          temperature,
          system,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        },
        { signal: controller.signal }
      );
      clearTimeout(timer);
      const text = res.content
        .filter((c): c is Anthropic.TextBlock => c.type === "text")
        .map((c) => c.text)
        .join("\n")
        .trim();
      const latencyMs = Date.now() - started;
      logAiCall({
        provider: "anthropic",
        model: DEFAULT_MODEL,
        route: opts.route,
        requestId: opts.requestId,
        latencyMs,
        ok: true,
      });
      return { ok: true, text, model: DEFAULT_MODEL, latencyMs };
    } catch (err) {
      const latencyMs = Date.now() - started;
      const reason =
        err instanceof Error ? `${err.name}: ${err.message}` : "unknown";
      logAiCall({
        provider: "anthropic",
        model: DEFAULT_MODEL,
        route: opts.route,
        requestId: opts.requestId,
        latencyMs,
        ok: false,
        reason,
      });
      // fall through to zai path
    }
  }

  // Path B: Z.AI (existing provider) — using shared helper if available
  try {
    const { zaiChatCompletion, getZaiModel, extractAssistantText } =
      await import("@/lib/zai");
    const zaiMessages = [
      { role: "system" as const, content: system },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];
    const res = await zaiChatCompletion({
      model: getZaiModel(),
      messages: zaiMessages,
      max_tokens: maxTokens,
      temperature,
      stream: false,
    });
    const text = extractAssistantText(res.choices?.[0]?.message).trim();
    const latencyMs = Date.now() - started;
    logAiCall({
      provider: "zai",
      model: process.env.Z_AI_MODEL || "glm-4.6",
      route: opts.route,
      requestId: opts.requestId,
      latencyMs,
      ok: true,
    });
    return { ok: true, text, model: process.env.Z_AI_MODEL || "glm-4.6", latencyMs };
  } catch (err) {
    const latencyMs = Date.now() - started;
    const reason =
      err instanceof Error ? `${err.name}: ${err.message}` : "unknown";
    logAiCall({
      provider: "zai",
      model: process.env.Z_AI_MODEL || "glm-4.6",
      route: opts.route,
      requestId: opts.requestId,
      latencyMs,
      ok: false,
      reason,
    });
    return {
      ok: false,
      fallback: true,
      message: FALLBACK_MESSAGE,
      model: "fallback",
      latencyMs,
      reason,
    };
  }
}

/** Safely parse a JSON object out of an LLM response. */
export function extractJson<T = unknown>(raw: string): T | null {
  if (!raw) return null;
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenceMatch ? fenceMatch[1] : raw).trim();
  // find first { and last }
  const first = candidate.indexOf("{");
  const last = candidate.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return null;
  const slice = candidate.slice(first, last + 1);
  try {
    return JSON.parse(slice) as T;
  } catch {
    return null;
  }
}
