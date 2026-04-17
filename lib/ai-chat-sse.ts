/**
 * SSE stream for "What is AI" chat — same wire format as the Z.ai path
 * (`data: {"text":"..."}\n\n`) so AIChatPanel stays unchanged.
 */

import Anthropic from "@anthropic-ai/sdk";
import { AI_EXPLAINER_SYSTEM } from "@/lib/prompts";
import type { ChatMessage } from "@/lib/types";
import { getZaiModel, zaiChatCompletionStream } from "@/lib/zai";

function toZaiMessages(messages: ChatMessage[]): { role: string; content: string }[] {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

function encodeSseText(piece: string): Uint8Array {
  const out = `data: ${JSON.stringify({ text: piece })}\n\n`;
  return new TextEncoder().encode(out);
}

function encodeSseError(message: string): Uint8Array {
  return new TextEncoder().encode(
    `data: ${JSON.stringify({ error: message })}\n\n`
  );
}

/** Prefer Anthropic streaming when configured; otherwise Z.ai stream. */
export async function createAiExplainerSseStream(
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

  if (apiKey) {
    const client = new Anthropic({ apiKey });
    const stream = client.messages.stream({
      model,
      max_tokens: 900,
      temperature: 0.4,
      system: AI_EXPLAINER_SYSTEM,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    return new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta" &&
              event.delta.text
            ) {
              controller.enqueue(encodeSseText(event.delta.text));
            }
          }
        } catch (err) {
          const msg =
            err instanceof Error ? err.message : "Stream interrupted";
          controller.enqueue(encodeSseError(msg));
        } finally {
          controller.close();
        }
      },
    });
  }

  return zaiChatCompletionStream({
    model: getZaiModel(),
    max_tokens: 900,
    messages: [
      { role: "system", content: AI_EXPLAINER_SYSTEM },
      ...toZaiMessages(messages),
    ],
  });
}
