import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

let ratelimit: Ratelimit | null | undefined;

function getRatelimit(): Ratelimit | null {
  if (ratelimit !== undefined) return ratelimit;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    ratelimit = null;
    return null;
  }
  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "techbuddy",
  });
  return ratelimit;
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}

/** Returns a 429 response if limited; otherwise null (caller continues). */
export async function rateLimitResponse(
  req: Request,
): Promise<Response | null> {
  const limiter = getRatelimit();
  if (!limiter) return null;
  const { success } = await limiter.limit(clientIp(req));
  if (!success) {
    return NextResponse.json(
      {
        error:
          "Too many requests right now. Please wait a minute and try again.",
      },
      { status: 429 },
    );
  }
  return null;
}
