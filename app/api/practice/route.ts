import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/rate-limit";
import { runAi } from "@/lib/ai-client";
import { practiceSystemPrompt } from "@/lib/prompts";
import type { ChatMessage, PracticePhase } from "@/lib/types";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { newRequestId } from "@/lib/telemetry";

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
              role: "user" as const,
              content:
                "The senior has joined this safe practice session. You are playing the scammer. Speak first with your opening message (2–4 sentences). Stay in character. Do not debrief yet.",
            },
          ]
        : toApiMessages(messages).map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));

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

    const requestId = newRequestId();
    const ai = await runAi({
      system: augmentedSystem,
      messages: apiMessages,
      maxTokens: 1200,
      temperature: 0.45,
      route: "/api/practice",
      requestId,
    });

    let reply: string;
    if (!ai.ok) {
      reply = ai.message;
    } else {
      reply = ai.text.trim();
    }

    if (!reply) {
      return NextResponse.json(
        { error: "Unexpected model response" },
        { status: 502 },
      );
    }

    const phaseOut: PracticePhase = inferPhase(reply, {
      stopPractice: Boolean(stopPractice),
      userTurns,
    });

    if (phaseOut === "debrief") {
      const session = await auth();
      const userId = session?.user?.id ?? null;
      prisma.practiceSession
        .create({
          data: {
            userId,
            scenario: scenario.trim(),
            messages: JSON.stringify(messages),
            score: 0,
            feedback: reply.slice(0, 4000),
          },
        })
        .catch(() => {
          /* best-effort */
        });
    }

    return NextResponse.json({
      reply,
      phase: phaseOut,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
