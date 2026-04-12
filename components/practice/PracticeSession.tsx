"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ChatBubble } from "@/components/ChatBubble";
import { Spinner } from "@/components/Spinner";
import { markScenarioCompleted } from "@/lib/practice-storage";
import type { PracticeScenario } from "@/lib/scenarios";
import type { ChatMessage } from "@/lib/types";

type ApiResponse = {
  reply: string;
  phase: "roleplay" | "debrief";
};

export function PracticeSession({ scenario }: { scenario: PracticeScenario }) {
  const [ui, setUi] = useState<"setup" | "roleplay" | "debrief">("setup");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debriefText, setDebriefText] = useState("");

  const callApi = useCallback(
    async (payload: {
      messages: ChatMessage[];
      phase: "roleplay" | "debrief";
    }): Promise<ApiResponse | null> => {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: scenario.scenarioDescription,
          messages: payload.messages,
          phase: payload.phase,
        }),
      });
      const data: unknown = await res.json();
      if (!res.ok) {
        setError(
          typeof data === "object" && data && "error" in data
            ? String((data as { error?: string }).error)
            : "We could not reach the practice helper. Check your Wi‑Fi and tap Try again.",
        );
        return null;
      }
      if (
        !data ||
        typeof data !== "object" ||
        typeof (data as ApiResponse).reply !== "string" ||
        ((data as ApiResponse).phase !== "roleplay" &&
          (data as ApiResponse).phase !== "debrief")
      ) {
        setError(
          "Something odd came back from the server. Wait a moment and tap Try again.",
        );
        return null;
      }
      return data as ApiResponse;
    },
    [scenario.scenarioDescription],
  );

  const start = useCallback(async () => {
    setError(null);
    setLoading(true);
    const data = await callApi({ messages: [], phase: "roleplay" });
    setLoading(false);
    if (!data) return;
    setMessages([{ role: "assistant", content: data.reply }]);
    if (data.phase === "debrief") {
      setDebriefText(data.reply);
      setUi("debrief");
      markScenarioCompleted(scenario.slug);
    } else {
      setUi("roleplay");
    }
  }, [callApi, scenario.slug]);

  const sendUser = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      setLoading(true);

      const previousMessages = messages;
      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(nextMessages);
      setInput("");

      const data = await callApi({ messages: nextMessages, phase: "roleplay" });
      setLoading(false);
      if (!data) {
        setMessages(previousMessages);
        return;
      }

      if (data.phase === "debrief") {
        setDebriefText(data.reply);
        setUi("debrief");
        markScenarioCompleted(scenario.slug);
        return;
      }

      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.reply },
      ]);
    },
    [callApi, loading, messages, scenario.slug],
  );

  const endPractice = useCallback(async () => {
    setError(null);
    setLoading(true);
    const previousMessages = messages;
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: "STOP PRACTICE" },
    ];
    setMessages(nextMessages);
    const data = await callApi({ messages: nextMessages, phase: "roleplay" });
    setLoading(false);
    if (!data) {
      setMessages(previousMessages);
      return;
    }
    setDebriefText(data.reply);
    setUi("debrief");
    markScenarioCompleted(scenario.slug);
  }, [callApi, messages, scenario.slug]);

  if (ui === "setup") {
    return (
      <div className="space-y-6">
        <p className="text-body text-text-primary">{scenario.shortDescription}</p>
        <p className="text-body text-text-secondary">
          In this practice, you&apos;ll roleplay a short conversation. The other
          side is not a real person—it is a safe simulation. Say what you would
          really say, or type{" "}
          <span className="font-semibold text-text-primary">STOP PRACTICE</span>{" "}
          to stop early.
        </p>
        <button
          type="button"
          onClick={() => void start()}
          disabled={loading}
          className="inline-flex min-h-[56px] w-full items-center justify-center rounded-xl bg-accent px-6 text-lg font-semibold text-white hover:bg-accent-hover disabled:opacity-50 sm:w-auto"
        >
          {loading ? (
            <>
              <Spinner label="Starting practice" />
              <span className="ml-2">Starting…</span>
            </>
          ) : (
            "Start practice"
          )}
        </button>
        {error ? (
          <div className="space-y-3 rounded-xl border border-danger/40 bg-surface p-4">
            <p className="text-body text-danger" role="alert">
              {error}
            </p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                void start();
              }}
              disabled={loading}
              className="inline-flex min-h-[56px] items-center justify-center rounded-xl border-2 border-border bg-surface px-5 text-body font-semibold text-text-primary hover:bg-surface-hover disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        ) : null}
        <p className="text-body">
          <Link
            href="/practice"
            className="text-accent underline min-h-[56px] inline-flex items-center"
          >
            ← All scenarios
          </Link>
        </p>
      </div>
    );
  }

  if (ui === "debrief") {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-display text-[28px] text-text-primary">Debrief</h2>
          <div className="mt-4 whitespace-pre-wrap text-body text-text-primary">
            {debriefText}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/practice"
            className="inline-flex min-h-[56px] items-center justify-center rounded-xl border border-border bg-surface px-6 text-body text-text-primary hover:bg-surface-hover"
          >
            Try another scenario
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-[56px] items-center justify-center rounded-xl bg-accent px-6 text-body font-semibold text-white hover:bg-accent-hover"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body text-text-secondary">
          Roleplay in progress — stay as calm as you can, just like a real call.
        </p>
        <button
          type="button"
          onClick={() => void endPractice()}
          disabled={loading}
          className="inline-flex min-h-[56px] items-center justify-center rounded-xl border border-warning bg-bg px-5 text-body font-semibold text-text-primary hover:bg-surface-hover disabled:opacity-50"
        >
          End Practice
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
        {messages.map((m, i) => (
          <ChatBubble key={`${i}-${m.role}`} role={m.role}>
            {m.content}
          </ChatBubble>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="practice-input" className="sr-only">
            Your response
          </label>
          <textarea
            id="practice-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type what you would say on the phone..."
            rows={3}
            disabled={loading}
            className="min-h-[56px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-body text-text-primary placeholder:text-text-secondary disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={() => void sendUser(input)}
          disabled={loading || !input.trim()}
          className="inline-flex min-h-[56px] min-w-[120px] items-center justify-center rounded-xl bg-accent px-6 text-lg font-semibold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Spinner label="Sending response" />
              <span className="ml-2">Sending…</span>
            </>
          ) : (
            "Send"
          )}
        </button>
      </div>

      {error ? (
        <div className="space-y-3 rounded-xl border border-danger/40 bg-surface p-4">
          <p className="text-body text-danger" role="alert">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="inline-flex min-h-[56px] items-center justify-center rounded-xl border-2 border-border bg-surface px-5 text-body font-semibold text-text-primary hover:bg-surface-hover"
          >
            Try again
          </button>
        </div>
      ) : null}

      <p className="text-body">
        <Link
          href="/practice"
          className="text-accent underline min-h-[56px] inline-flex items-center"
        >
          ← All scenarios
        </Link>
      </p>
    </div>
  );
}
