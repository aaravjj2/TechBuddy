import { test, expect } from "@playwright/test";

test.describe("API v1 · health", () => {
  test("GET /api/v1/health returns envelope + headers", async ({ request }) => {
    const res = await request.get("/api/v1/health");
    expect([200, 503]).toContain(res.status());

    expect(res.headers()["x-api-version"]).toBe("v1");
    expect(res.headers()["x-request-id"]).toBeTruthy();

    const body = await res.json();
    expect(body.meta?.version).toBe("v1");
    expect(body.meta?.requestId).toBeTruthy();

    expect(["ok", "degraded"]).toContain(body.data?.status);
    expect(body.data?.db).toBeTruthy();
    expect(body.data?.ai).toBeTruthy();
    expect(typeof body.data?.uptimeSeconds).toBe("number");
  });
});

test.describe("API v1 · artifacts", () => {
  test("GET /api/v1/artifacts returns 360 total", async ({ request }) => {
    const res = await request.get("/api/v1/artifacts?limit=1");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.data?.total).toBeGreaterThanOrEqual(360);
    expect(body.meta?.version).toBe("v1");
  });

  test("filter by year=1 returns exactly 120", async ({ request }) => {
    const res = await request.get("/api/v1/artifacts?year=1&limit=1");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.data?.total).toBe(120);
  });

  test("filter by domain=Accessibility and Inclusion returns 36", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/v1/artifacts?domain=Accessibility%20and%20Inclusion&limit=1"
    );
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.data?.total).toBe(36);
  });

  test("search q=accessibility returns matching items", async ({ request }) => {
    const res = await request.get(
      "/api/v1/artifacts?q=accessibility&limit=100"
    );
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.data?.total).toBeGreaterThanOrEqual(1);

    const items = body.data?.items ?? [];
    expect(items.length).toBeGreaterThan(0);

    const needle = "accessibility";
    for (const item of items) {
      const haystack = [
        item.title,
        item.primaryGoal,
        JSON.stringify(item.outcomes ?? []),
        JSON.stringify(item.risks ?? []),
      ]
        .join(" ")
        .toLowerCase();
      expect(
        haystack.includes(needle),
        `Item ${item.pageNumber} missing "${needle}" in searchable fields`
      ).toBe(true);
    }
  });

  test("GET /api/v1/artifacts/1 returns page #1", async ({ request }) => {
    const res = await request.get("/api/v1/artifacts/1");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.data?.pageNumber).toBe(1);
    expect(body.data?.year).toBe(1);
    expect(body.data?.monthInYear).toBe(1);
    expect(typeof body.data?.domain).toBe("string");
    expect(body.data.domain.length).toBeGreaterThan(0);
  });

  test("GET /api/v1/artifacts/999 returns 404 NOT_FOUND", async ({
    request,
  }) => {
    const res = await request.get("/api/v1/artifacts/999");
    expect(res.status()).toBe(404);

    const body = await res.json();
    expect(body.error?.code).toBe("NOT_FOUND");
    expect(body.meta?.version).toBe("v1");
  });
});

test.describe("API v1 · telemetry", () => {
  test("GET /api/v1/telemetry without auth is forbidden", async ({
    request,
  }) => {
    const res = await request.get("/api/v1/telemetry");
    expect(res.status()).toBe(403);

    const body = await res.json();
    expect(body.error?.code).toBe("FORBIDDEN");
  });
});

test.describe("API v1 · scam-check", () => {
  test("empty text returns 400 VALIDATION_ERROR", async ({ request }) => {
    const res = await request.post("/api/v1/scam-check", {
      data: { text: "" },
    });
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body.error?.code).toBe("VALIDATION_ERROR");
  });

  test("text too long returns 400", async ({ request }) => {
    const res = await request.post("/api/v1/scam-check", {
      data: { text: "a".repeat(5001) },
    });
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body.error?.code).toBe("VALIDATION_ERROR");
  });

  test("12 rapid requests trigger at least one 429 RATE_LIMITED", async ({
    request,
  }) => {
    // Unique seed per run so test output is debuggable even if rate limit
    // is shared across prior runs.
    const seed = `playwright-rate-limit-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;

    const responses: Array<{ status: number; retryAfter: string | null }> = [];
    for (let i = 0; i < 12; i++) {
      const res = await request.post("/api/v1/scam-check", {
        data: { text: `${seed} limit test ${i}` },
      });
      responses.push({
        status: res.status(),
        retryAfter: res.headers()["retry-after"] ?? null,
      });
    }

    const rateLimited = responses.find((r) => r.status === 429);
    expect(
      rateLimited,
      `Expected at least one 429 among 12 rapid requests. Got: ${JSON.stringify(
        responses.map((r) => r.status)
      )}`
    ).toBeTruthy();
    expect(rateLimited!.retryAfter).toBeTruthy();

    // Double-check body shape of one 429 response (re-issue once if needed)
    const verifyRes = await request.post("/api/v1/scam-check", {
      data: { text: `${seed} verify` },
    });
    if (verifyRes.status() === 429) {
      const body = await verifyRes.json();
      expect(body.error?.code).toBe("RATE_LIMITED");
    }
  });
});
