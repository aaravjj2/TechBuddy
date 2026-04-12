import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/rate-limit";
import {
  extractAssistantText,
  getZaiModel,
  zaiChatCompletion,
} from "@/lib/zai";
import { parseJsonFromModelText } from "@/lib/json";
import { SCAM_CHECK_SYSTEM } from "@/lib/prompts";
import type { ScamCheckResult } from "@/lib/types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function coerceResult(raw: unknown): ScamCheckResult | null {
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

export async function POST(req: Request) {
  const limited = await rateLimitResponse(req);
  if (limited) return limited;

  try {
    const body: unknown = await req.json();
    const message =
      isRecord(body) && typeof body.message === "string" ? body.message : "";
    if (!message.trim()) {
      return NextResponse.json(
        { error: "Missing message" },
        { status: 400 },
      );
    }

    const raw = await zaiChatCompletion({
      model: getZaiModel(),
      max_tokens: 1200,
      messages: [
        { role: "system", content: SCAM_CHECK_SYSTEM },
        { role: "user", content: message },
      ],
    });

    const text = extractAssistantText(raw.choices?.[0]?.message);
    if (!text.trim()) {
      return NextResponse.json(
        { error: "Unexpected model response" },
        { status: 502 },
      );
    }

    let parsed: unknown;
    try {
      parsed = parseJsonFromModelText(text);
    } catch {
      return NextResponse.json(
        { error: "Could not parse scam check result" },
        { status: 502 },
      );
    }

    const result = coerceResult(parsed);
    if (!result) {
      return NextResponse.json(
        { error: "Invalid scam check shape" },
        { status: 502 },
      );
    }

    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    if (msg === "Missing Z_AI_API_KEY_or_ZAI_API_KEY") {
      return NextResponse.json({ error: "Server not configured" }, { status: 503 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
