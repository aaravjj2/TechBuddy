/**
 * Z.ai OpenAI-compatible Chat Completions API.
 * @see https://docs.z.ai/api-reference/introduction
 * @see https://docs.z.ai/guides/capabilities/thinking — GLM-4.6 may fill `reasoning_content` unless thinking is disabled.
 */

const DEFAULT_BASE = "https://api.z.ai/api/paas/v4/";
const DEFAULT_MODEL = "glm-4.6";

function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim();
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

export function getZaiApiKey(): string {
  const key = process.env.Z_AI_API_KEY ?? process.env.ZAI_API_KEY;
  if (!key) {
    throw new Error("Missing Z_AI_API_KEY_or_ZAI_API_KEY");
  }
  return key;
}

export function getZaiBaseUrl(): string {
  return normalizeBaseUrl(process.env.Z_AI_BASE_URL ?? DEFAULT_BASE);
}

export function getZaiModel(): string {
  return (process.env.Z_AI_MODEL ?? DEFAULT_MODEL).trim() || DEFAULT_MODEL;
}

/** GLM may return JSON/text in `content` or only in `reasoning_content` when thinking is on. */
export function extractAssistantText(message: unknown): string {
  if (!message || typeof message !== "object") return "";
  const m = message as { content?: unknown; reasoning_content?: unknown };
  if (typeof m.content === "string" && m.content.trim()) return m.content;
  if (typeof m.reasoning_content === "string" && m.reasoning_content.trim()) {
    return m.reasoning_content;
  }
  return "";
}

type ChatCompletionResponse = {
  choices?: Array<{ message?: unknown }>;
  error?: { message?: string };
};

/** Z.ai-specific controls; `enable_thinking: false` is honored on some endpoints when `thinking` is ignored. */
function zaiExtras(): Record<string, unknown> {
  return {
    thinking: { type: "disabled" },
    enable_thinking: false,
  };
}

export async function zaiChatCompletion(body: {
  model: string;
  messages: { role: string; content: string }[];
  max_tokens?: number;
  temperature?: number;
  stream?: false;
}): Promise<ChatCompletionResponse> {
  const url = `${getZaiBaseUrl()}chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getZaiApiKey()}`,
      "Content-Type": "application/json",
      "Accept-Language": "en-US,en",
    },
    body: JSON.stringify({
      ...body,
      stream: false,
      ...zaiExtras(),
    }),
  });

  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errMsg =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error?: { message?: string } }).error?.message ===
        "string"
        ? (data as { error: { message: string } }).error.message
        : `Z.ai HTTP ${res.status}`;
    throw new Error(errMsg);
  }
  return data as ChatCompletionResponse;
}

/**
 * Streams assistant text deltas (uses `delta.content`, falls back to `delta.reasoning_content`).
 */
export async function zaiChatCompletionStream(body: {
  model: string;
  messages: { role: string; content: string }[];
  max_tokens?: number;
}): Promise<ReadableStream<Uint8Array>> {
  const url = `${getZaiBaseUrl()}chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getZaiApiKey()}`,
      "Content-Type": "application/json",
      "Accept-Language": "en-US,en",
    },
    body: JSON.stringify({
      ...body,
      stream: true,
      ...zaiExtras(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Z.ai HTTP ${res.status}`);
  }

  if (!res.body) {
    throw new Error("No response body from Z.ai");
  }

  const decoder = new TextDecoder();
  let lineBuffer = "";

  return res.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        lineBuffer += decoder.decode(chunk, { stream: true });
        const lines = lineBuffer.split("\n");
        lineBuffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload) as {
              choices?: Array<{
                delta?: { content?: string; reasoning_content?: string };
              }>;
            };
            const delta = json.choices?.[0]?.delta;
            const piece =
              delta?.content ??
              delta?.reasoning_content ??
              "";
            if (piece) {
              const out = `data: ${JSON.stringify({ text: piece })}\n\n`;
              controller.enqueue(new TextEncoder().encode(out));
            }
          } catch {
            /* skip malformed SSE line */
          }
        }
      },
      flush(controller) {
        if (lineBuffer.trim()) {
          const trimmed = lineBuffer.trim();
          if (trimmed.startsWith("data:")) {
            const payload = trimmed.slice(5).trim();
            if (payload !== "[DONE]") {
              try {
                const json = JSON.parse(payload) as {
                  choices?: Array<{
                    delta?: { content?: string; reasoning_content?: string };
                  }>;
                };
                const delta = json.choices?.[0]?.delta;
                const piece =
                  delta?.content ??
                  delta?.reasoning_content ??
                  "";
                if (piece) {
                  const out = `data: ${JSON.stringify({ text: piece })}\n\n`;
                  controller.enqueue(new TextEncoder().encode(out));
                }
              } catch {
                /* ignore */
              }
            }
          }
        }
      },
    }),
  );
}
