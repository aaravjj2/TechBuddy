"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ReadAloud } from "@/components/ReadAloud";
import { Spinner } from "@/components/Spinner";
import { ScamVerdict } from "@/components/ScamVerdict";
import type { ScamCheckResult } from "@/lib/types";

const PLACEHOLDER = `Example: "Your Amazon account has been suspended. Click here to verify: amz-login.net"`;

function isScamResult(data: unknown): data is ScamCheckResult {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  const v = d.verdict;
  return (
    (v === "SCAM" || v === "SAFE" || v === "SUSPICIOUS") &&
    typeof d.headline === "string" &&
    typeof d.explanation === "string"
  );
}

function verdictToSpeech(result: ScamCheckResult): string {
  const parts = [result.headline, result.explanation];
  if (result.warning_signs?.length) {
    parts.push("Warning signs: " + result.warning_signs.join(". "));
  }
  if (result.action_steps?.length) {
    parts.push("What to do: " + result.action_steps.join(". "));
  }
  if (result.already_clicked) {
    parts.push("If you already clicked: " + result.already_clicked);
  }
  return parts.join(" ");
}

const EXAMPLES = [
  {
    title: "Social Security scam",
    body: 'Someone calls and says your Social Security number is suspended. They ask you to "verify" it over the phone.',
  },
  {
    title: "Medicare scam",
    body: "A caller claims Medicare needs your new card number or you'll lose benefits. They pressure you to give personal information.",
  },
  {
    title: "Grandchild in trouble",
    body: 'You get a call: "Grandma, it\'s me—I\'m in trouble and need money wired right now." The voice may sound a little off.',
  },
  {
    title: "Fake Amazon or Apple alert",
    body: 'A text or email says your account is locked and you must click a link to "verify" your login. The link does not go to the real company site.',
  },
  {
    title: "Lottery or prize scam",
    body: "You're told you won money or a prize, but you must pay a fee or taxes first. Real lotteries do not ask winners to pay upfront.",
  },
  {
    title: "Tech support pop-up",
    body: 'A window on your computer says "virus detected—call this number." Legitimate companies do not ask you to call a random number from a pop-up.',
  },
];

export function ScamCheckerForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScamCheckResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const speechText = useMemo(
    () => (result ? verdictToSpeech(result) : ""),
    [result],
  );

  const reset = useCallback(() => {
    setMessage("");
    setResult(null);
    setError(null);
  }, []);

  const submit = useCallback(
    async (text?: string) => {
      const payload = (text ?? message).trim();
      if (!payload) return;
      setLoading(true);
      setError(null);
      setResult(null);
      if (text) setMessage(text);
      try {
        const res = await fetch("/api/scam-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: payload }),
        });
        const data: unknown = await res.json();
        if (!res.ok) {
          setError(
            typeof data === "object" && data && "error" in data
              ? String((data as { error?: string }).error)
              : "We could not check this message right now. Check your Wi‑Fi and tap Try again.",
          );
          return;
        }
        if (!isScamResult(data)) {
          setError(
            "We got a confusing answer from the checker. Tap Try again in a moment.",
          );
          return;
        }
        setResult(data);
        // Scroll to the result after a short delay to allow React to render
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      } catch {
        setError(
          "Something went wrong on our side. Check your connection and tap Try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [message],
  );

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="scam-input" className="sr-only">
          Suspicious message
        </label>
        <textarea
          id="scam-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={6}
          className="min-h-[150px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-body text-text-primary shadow-inner placeholder:text-text-secondary"
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => void submit()}
            disabled={loading || !message.trim()}
            className="flex h-[60px] min-w-[200px] flex-1 items-center justify-center rounded-xl bg-accent text-lg font-semibold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner label="Checking message" />
                <span className="ml-2">Checking…</span>
              </>
            ) : (
              "Check This Message"
            )}
          </button>
          {error ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                void submit();
              }}
              disabled={loading || !message.trim()}
              className="flex h-[60px] min-w-[160px] items-center justify-center rounded-xl border-2 border-border bg-surface px-5 text-lg font-semibold text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Try again
            </button>
          ) : null}
        </div>
        {error ? (
          <p className="mt-4 text-body text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {result ? (
        <div className="space-y-4" ref={resultRef}>
          {result.action_steps && result.action_steps.length > 0 ? (
            <div
              className="rounded-2xl border-2 border-accent bg-surface p-6 shadow-sm"
              role="region"
              aria-label="Do this first"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                Do this first
              </p>
              <p className="mt-2 font-display text-[22px] text-text-primary">
                {result.action_steps[0]}
              </p>
            </div>
          ) : null}
          <ScamVerdict
            result={result}
            omitFirstActionStep={!!result.action_steps?.length}
          />
          <ReadAloud text={speechText} label="Read this to me" />
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[56px] w-full items-center justify-center rounded-xl border border-border bg-surface px-5 py-3 font-sans text-body text-text-primary hover:bg-surface-hover sm:w-auto"
          >
            Check another message
          </button>
        </div>
      ) : null}

      <section aria-labelledby="examples-heading" className="border-t border-border pt-8">
        <h2 id="examples-heading" className="font-display text-[24px] text-text-primary">
          Common scam examples
        </h2>
        <p className="mt-2 text-body text-text-secondary">
          Tap an example to check it right away — no typing needed.
        </p>
        <div className="mt-4 space-y-3">
          {EXAMPLES.map((ex) => (
            <div
              key={ex.title}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
            >
              <p className="font-display text-[20px] text-text-primary">{ex.title}</p>
              <p className="mt-2 text-body text-text-primary">{ex.body}</p>
              <button
                type="button"
                onClick={() => void submit(ex.body)}
                disabled={loading}
                className="mt-4 inline-flex min-h-[56px] items-center justify-center rounded-xl bg-accent px-6 text-lg font-semibold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Check this example
              </button>
            </div>
          ))}
        </div>
      </section>

      <p className="text-body">
        <Link href="/" className="text-accent underline min-h-[56px] inline-flex items-center">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
