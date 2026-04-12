import type { ChatRole } from "@/lib/types";

export type ChatBubbleProps = {
  role: ChatRole;
  children: string;
};

export function ChatBubble({ role, children }: ChatBubbleProps) {
  const isAssistant = role === "assistant";

  return (
    <div
      className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl border px-4 py-3 text-body ${
          isAssistant
            ? "border-accent/40 bg-[#E8F2FC] text-text-primary"
            : "border-border bg-surface text-text-primary"
        }`}
        role="article"
        aria-label={isAssistant ? "TechBuddy says" : "You said"}
      >
        <p className="whitespace-pre-wrap">{children}</p>
      </div>
    </div>
  );
}
