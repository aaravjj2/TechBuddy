import { rateLimitResponse } from "@/lib/rate-limit";
import {
  getZaiModel,
  zaiChatCompletionStream,
} from "@/lib/zai";
import { AI_EXPLAINER_SYSTEM } from "@/lib/prompts";
import type { ChatMessage } from "@/lib/types";

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

export async function POST(req: Request) {
  const limited = await rateLimitResponse(req);
  if (limited) return limited;

  try {
    const body: unknown = await req.json();
    const rawMessages = isRecord(body) ? body.messages : undefined;
    if (!Array.isArray(rawMessages)) {
      return new Response(JSON.stringify({ error: "Missing messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const messages: ChatMessage[] = [];
    for (const m of rawMessages) {
      if (!isRecord(m)) continue;
      if (m.role !== "user" && m.role !== "assistant") continue;
      if (typeof m.content !== "string") continue;
      messages.push({ role: m.role, content: m.content });
    }

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "No valid messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const upstream = await zaiChatCompletionStream({
      model: getZaiModel(),
      max_tokens: 900,
      messages: [
        { role: "system", content: AI_EXPLAINER_SYSTEM },
        ...toApiMessages(messages),
      ],
    });

    const wrapped = new ReadableStream({
      async start(controller) {
        const reader = upstream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) controller.enqueue(value);
          }
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Stream interrupted";
          const payload = JSON.stringify({ error: message });
          controller.enqueue(
            new TextEncoder().encode(`data: ${payload}\n\n`),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(wrapped, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    if (msg === "Missing Z_AI_API_KEY_or_ZAI_API_KEY") {
      return new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
