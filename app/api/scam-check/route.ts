import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { newRequestId } from "@/lib/telemetry";
import {
  runLegacyScamCheck,
  scamResultToPrismaPayload,
} from "@/lib/scam-check-legacy";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export async function POST(req: Request) {
  const limited = await rateLimitResponse(req);
  if (limited) return limited;

  const requestId = newRequestId();

  try {
    const body: unknown = await req.json();
    const message =
      isRecord(body) && typeof body.message === "string" ? body.message : "";
    if (!message.trim()) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id ?? null;

    const out = await runLegacyScamCheck(message, {
      route: "/api/scam-check",
      requestId,
    });

    if (!out.ok) {
      return NextResponse.json({ error: out.error }, { status: out.status });
    }

    prisma.scamCheck
      .create({
        data: {
          userId,
          ...scamResultToPrismaPayload(out.result, message.trim()),
        },
      })
      .catch(() => {
        /* persistence is best-effort */
      });

    return NextResponse.json(out.result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
