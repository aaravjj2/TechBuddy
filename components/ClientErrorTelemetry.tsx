"use client";

import { useEffect } from "react";

const MAX_EVENTS_PER_SESSION = 10;
const TELEMETRY_KEY = "techbuddy-telemetry-count";

function canSendEvent() {
  const current = Number(sessionStorage.getItem(TELEMETRY_KEY) ?? "0");
  if (current >= MAX_EVENTS_PER_SESSION) return false;
  sessionStorage.setItem(TELEMETRY_KEY, String(current + 1));
  return true;
}

function sendClientError(payload: Record<string, unknown>) {
  if (!canSendEvent()) return;

  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/client-error", blob);
    return;
  }

  void fetch("/api/client-error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}

export function ClientErrorTelemetry() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_CLIENT_TELEMETRY !== "true") return;

    const onError = (event: ErrorEvent) => {
      sendClientError({
        type: "error",
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        path: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      sendClientError({
        type: "unhandledrejection",
        reason:
          typeof event.reason === "string"
            ? event.reason
            : JSON.stringify(event.reason ?? "unknown"),
        path: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
