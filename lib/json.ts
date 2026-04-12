/** Best-effort JSON extraction from model text (handles optional ```json fences). */
export function parseJsonFromModelText(text: string): unknown {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fence ? fence[1]!.trim() : trimmed;
  return JSON.parse(candidate);
}
