"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ChatBubble } from "@/components/ChatBubble";
import { Spinner } from "@/components/Spinner";
import { ReadAloud } from "@/components/ReadAloud";
import type { ChatMessage } from "@/lib/types";

const STARTERS = [
  "What even is AI?",
  "Is AI safe to use?",
  "Can AI lie to me?",
  "How is AI different from Google?",
  "Will AI take over the world?",
];

const FOLLOW_UPS = [
  "Can AI read my emails?",
  "How do I know if I'm talking to AI?",
  "Is Siri the same as ChatGPT?",
  "Should I trust health advice from AI?",
  "Can AI steal my identity?",
  "Why does AI sometimes say wrong things?",
  "How do companies use my data for AI?",
  "Is it safe to put personal info into AI?",
  "Can AI help me with my phone?",
  "What does 'machine learning' mean in simple terms?",
  "Should I be worried about deepfakes?",
  "Can AI write emails for me?",
  "How do I turn off AI features I don't want?",
  "Is AI watching me through my camera?",
  "What's the difference between AI and a regular app?",
  "Can AI make phone calls for me?",
  "How do I know if a photo is real or AI-made?",
  "Is it okay to use AI for medical questions?",
];

const MAX_USER_TURNS = 20;

function parseSseChunks(buffer: string): { events: string[]; rest: string } {
  const events: string[] = [];
  let rest = buffer;
  let idx: number;
  while ((idx = rest.indexOf("\n\n")) !== -1) {
    const block = rest.slice(0, idx);
    rest = rest.slice(idx + 2);
    for (const line of block.split("\n")) {
      if (line.startsWith("data: ")) {
        events.push(line.slice(6));
      }
    }
  }
  return { events, rest };
}

export function AIChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const lastAttemptRef = useRef("");

  const userTurnCount = useMemo(
    () => messages.filter((m) => m.role === "user").length,
    [messages],
  );

  const lastAssistantText = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i]!.role === "assistant") return messages[i]!.content;
    }
    return "";
  }, [messages]);

  const startOver = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setError(null);
    setLimitReached(false);
    setStreaming(false);
    setSuggestions([]);
  }, []);

  const pickSuggestions = useCallback(() => {
    const shuffled = [...FOLLOW_UPS].sort(() => Math.random() - 0.5);
    setSuggestions(shuffled.slice(0, 3));
  }, []);

  const sendInternal = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;
      if (userTurnCount >= MAX_USER_TURNS) {
        setLimitReached(true);
        return;
      }

      lastAttemptRef.current = trimmed;
      setError(null);
      setStreaming(true);
      setSuggestions([]);

      const previousMessages = messages;
      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(nextMessages);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          setError(
            typeof errBody === "object" && errBody && "error" in errBody
              ? String((errBody as { error?: string }).error)
              : "We could not reach the helper. Check your Wi‑Fi, then tap Try again or Send.",
          );
          setMessages(previousMessages);
          setInput(trimmed);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setError(
            "No answer came through. Check your connection and tap Try again.",
          );
          setMessages(previousMessages);
          setInput(trimmed);
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let assistantText = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const { events, rest } = parseSseChunks(buffer);
          buffer = rest;
          for (const ev of events) {
            try {
              const parsed = JSON.parse(ev) as {
                text?: string;
                error?: string;
              };
              if (parsed.error) {
                setError(parsed.error);
                setMessages(previousMessages);
                setInput(trimmed);
                return;
              }
              if (parsed.text) {
                assistantText += parsed.text;
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy.length - 1;
                  if (last >= 0 && copy[last]!.role === "assistant") {
                    copy[last] = {
                      role: "assistant",
                      content: assistantText,
                    };
                  }
                  return copy;
                });
              }
            } catch {
              /* ignore malformed chunk */
            }
          }
        }

        if (buffer.trim()) {
          const { events } = parseSseChunks(buffer + "\n\n");
          for (const ev of events) {
            try {
              const parsed = JSON.parse(ev) as { text?: string };
              if (parsed.text) assistantText += parsed.text;
            } catch {
              /* ignore */
            }
          }
          if (assistantText) {
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy.length - 1;
              if (last >= 0 && copy[last]!.role === "assistant") {
                copy[last] = { role: "assistant", content: assistantText };
              }
              return copy;
            });
          }
        }

        setInput("");
      } catch (e) {
        if ((e as Error).name === "AbortError") {
          setMessages(previousMessages);
          setInput(trimmed);
          return;
        }
        setError(
          "Something went wrong. Your question is still in the box—tap Send or Try again.",
        );
        setMessages(previousMessages);
        setInput(trimmed);
      } finally {
        setStreaming(false);
        abortRef.current = null;
        if (!controller.signal.aborted) {
          pickSuggestions();
        }
      }
    },
    [messages, streaming, userTurnCount],
  );

  const send = useCallback(() => {
    void sendInternal(input);
  }, [input, sendInternal]);

  return (
    <div className="flex min-h-[50vh] flex-col gap-6">
      <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
        {messages.length === 0 && !streaming ? (
          <div className="space-y-3">
            <p className="text-body text-text-secondary">
              Pick a question to start, or type your own below.
            </p>
            <div className="flex flex-col gap-3">
              {STARTERS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void sendInternal(q)}
                  disabled={streaming || limitReached}
                  className="min-h-[56px] rounded-xl border border-border bg-surface px-4 py-3 text-left text-body text-text-primary hover:bg-surface-hover disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          {messages.map((m, i) => (
            <ChatBubble key={`${i}-${m.role}`} role={m.role}>
              {m.content}
            </ChatBubble>
          ))}
        </div>

        {limitReached ? (
          <p className="text-body text-warning" role="status">
            You&apos;ve reached the conversation limit for this session. Tap
            Start over to begin a fresh chat.
          </p>
        ) : null}

        {suggestions.length > 0 && !streaming && !limitReached ? (
          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-body text-text-secondary">
              You might also wonder:
            </p>
            <div className="flex flex-col gap-2">
              {suggestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void sendInternal(q)}
                  className="min-h-[56px] rounded-xl border border-border bg-surface px-4 py-3 text-left text-body text-text-primary hover:bg-surface-hover"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="space-y-3 rounded-xl border border-danger/40 bg-surface p-4">
            <p className="text-body text-danger" role="alert">
              {error}
            </p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                void sendInternal(lastAttemptRef.current);
              }}
              disabled={streaming || !lastAttemptRef.current.trim() || limitReached}
              className="inline-flex min-h-[56px] items-center justify-center rounded-xl border-2 border-border bg-surface px-5 text-body font-semibold text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="ai-input" className="sr-only">
            Ask a question about AI
          </label>
          <textarea
            id="ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about AI..."
            rows={3}
            disabled={streaming || limitReached}
            className="min-h-[56px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-body text-text-primary placeholder:text-text-secondary disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={send}
          disabled={streaming || !input.trim() || limitReached}
          className="inline-flex min-h-[56px] min-w-[120px] items-center justify-center rounded-xl bg-accent px-6 text-lg font-semibold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {streaming ? (
            <>
              <Spinner label="Sending message" />
              <span className="ml-2">Sending…</span>
            </>
          ) : (
            "Send"
          )}
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={startOver}
          className="inline-flex min-h-[56px] items-center justify-center rounded-xl border border-border bg-surface px-5 py-3 text-body text-text-primary hover:bg-surface-hover"
        >
          Start over
        </button>
        <ReadAloud
          text={lastAssistantText}
          label="Read last message to me"
        />
      </div>
    </div>
  );
}
