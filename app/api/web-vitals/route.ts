import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS !== "true") {
    return NextResponse.json({ ok: true, webVitals: "disabled" });
  }

  try {
    const body = await request.json();
    const safeBody = {
      name: String(body?.name ?? "unknown"),
      value: Number(body?.value ?? 0),
      rating: String(body?.rating ?? "unknown"),
      id: String(body?.id ?? "unknown"),
      path: String(body?.path ?? "unknown"),
      timestamp: String(body?.timestamp ?? new Date().toISOString()),
    };

    console.info("[web-vitals]", safeBody);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
