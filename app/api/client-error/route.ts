import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_ENABLE_CLIENT_TELEMETRY !== "true") {
    return NextResponse.json({ ok: true, telemetry: "disabled" });
  }

  try {
    const body = await request.json();
    const safeBody = {
      type: body?.type ?? "unknown",
      message: String(body?.message ?? body?.reason ?? "no-message"),
      path: String(body?.path ?? "unknown"),
      timestamp: String(body?.timestamp ?? new Date().toISOString()),
      source: body?.source ? String(body.source) : undefined,
      line: body?.line,
      column: body?.column,
    };

    console.error("[client-error-telemetry]", safeBody);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
