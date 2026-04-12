import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/rate-limit";
import {
  extractAssistantText,
  getZaiModel,
  zaiChatCompletion,
} from "@/lib/zai";
import { practiceSystemPrompt } from "@/lib/prompts";
import type { ChatMessage, PracticePhase } from "@/lib/types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function toApiMessages(
  messages: ChatMessage[],
): { role: string; content: string }[] {
  return messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
}

function inferPhase(
  reply: string,
  ctx: { stopPractice: boolean; userTurns: number },
): PracticePhase {
  if (
    reply.includes("Great job practicing") ||
    ctx.stopPractice ||
    ctx.userTurns >= 5
  ) {
    return "debrief";
  }
  return "roleplay";
}

export async function POST(req: Request) {
  const limited = await rateLimitResponse(req);
  if (limited) return limited;

  try {
    const body: unknown = await req.json();
    const scenario =
      isRecord(body) && typeof body.scenario === "string" ? body.scenario : "";
    const phaseRaw = isRecord(body) ? body.phase : undefined;
    const phaseIn =
      phaseRaw === "roleplay" || phaseRaw === "debrief" ? phaseRaw : "roleplay";

    if (!scenario.trim()) {
      return NextResponse.json({ error: "Missing scenario" }, { status: 400 });
    }

    const rawMessages = isRecord(body) && Array.isArray(body.messages)
      ? body.messages
      : [];

    const messages: ChatMessage[] = [];
    for (const m of rawMessages) {
      if (!isRecord(m)) continue;
      if (m.role !== "user" && m.role !== "assistant") continue;
      if (typeof m.content !== "string") continue;
      messages.push({ role: m.role, content: m.content });
    }

    const system = practiceSystemPrompt(scenario);

    const apiMessages =
      messages.length === 0
        ? [
            {
              role: "user",
              content:
                "The senior has joined this safe practice session. You are playing the scammer. Speak first with your opening message (2–4 sentences). Stay in character. Do not debrief yet.",
            },
          ]
        : toApiMessages(messages);

    const userTurns = messages.filter((m) => m.role === "user").length;
    const lastUser = messages.filter((m) => m.role === "user").at(-1)?.content;
    const stopPractice = lastUser?.includes("STOP PRACTICE");

    let augmentedSystem = system;
    if (phaseIn === "debrief") {
      augmentedSystem = `${system}\n\nThe trainer requests DEBRIEF mode now.`;
    } else if (userTurns >= 5 && !stopPractice) {
      augmentedSystem = `${system}\n\nYou have reached 5 exchanges. Switch to DEBRIEF mode now using the required debrief format.`;
    } else if (stopPractice) {
      augmentedSystem = `${system}\n\nThe senior typed STOP PRACTICE. Switch to DEBRIEF mode now using the required debrief format.`;
    }

    const raw = await zaiChatCompletion({
      model: getZaiModel(),
      max_tokens: 1200,
      messages: [
        { role: "system", content: augmentedSystem },
        ...apiMessages,
      ],
    });

    const reply = extractAssistantText(raw.choices?.[0]?.message);
    if (!reply.trim()) {
      return NextResponse.json(
        { error: "Unexpected model response" },
        { status: 502 },
      );
    }

    const phaseOut: PracticePhase = inferPhase(reply, {
      stopPractice: Boolean(stopPractice),
      userTurns,
    });

    return NextResponse.json({
      reply,
      phase: phaseOut,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    if (msg === "Missing Z_AI_API_KEY_or_ZAI_API_KEY") {
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
