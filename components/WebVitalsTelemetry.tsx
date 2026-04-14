"use client";

import { useReportWebVitals } from "next/web-vitals";

const MAX_WEB_VITALS_PER_SESSION = 20;
const WEB_VITALS_KEY = "techbuddy-web-vitals-count";

function shouldSend() {
  const current = Number(sessionStorage.getItem(WEB_VITALS_KEY) ?? "0");
  if (current >= MAX_WEB_VITALS_PER_SESSION) return false;
  sessionStorage.setItem(WEB_VITALS_KEY, String(current + 1));
  return true;
}

function sendWebVital(payload: Record<string, unknown>) {
  if (!shouldSend()) return;

  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/web-vitals", blob);
    return;
  }

  void fetch("/api/web-vitals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}

export function WebVitalsTelemetry() {
  useReportWebVitals((metric) => {
    if (process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS !== "true") return;

    sendWebVital({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  });

  return null;
}
