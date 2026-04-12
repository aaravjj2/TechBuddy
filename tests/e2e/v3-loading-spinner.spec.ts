import { expect, test } from "@playwright/test";

test.describe("Loading Spinner component (v3)", () => {
  test("scam checker shows spinner while loading", async ({ page }) => {
    await page.goto("/scam-checker");

    // Mock slow API response
    await page.route("**/api/scam-check", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          verdict: "SAFE",
          headline: "Looks safe",
          explanation: "Nothing suspicious here.",
        }),
      });
    });

    // Fill textarea and submit
    await page.locator("#scam-input").fill("Test message to check");
    await page.getByRole("button", { name: /check this message/i }).click();

    // Spinner should be visible with status role
    const spinner = page.locator('[role="status"]');
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveAttribute("aria-label", "Checking message");

    // "Checking…" text should be visible
    await expect(page.getByText("Checking…")).toBeVisible();

    // Wait for result
    await expect(page.getByText("Looks safe")).toBeVisible({ timeout: 10000 });
  });

  test("AI chat shows spinner while sending", async ({ page }) => {
    await page.goto("/what-is-ai");

    await page.route("**/api/ai-chat", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: 'data: {"text": "AI is like a library assistant."}\n\ndata: [DONE]\n\n',
      });
    });

    await page.locator("#ai-input").fill("What is AI?");
    await page.getByRole("button", { name: /^send$/i }).click();

    // Spinner should be visible
    const spinner = page.locator('[role="status"]');
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveAttribute("aria-label", "Sending message");
  });

  test("practice session shows spinner while starting", async ({ page }) => {
    await page.goto("/practice/fake-tech-support");

    await page.route("**/api/practice", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          reply: "Hello, this is Microsoft support...",
          phase: "roleplay",
        }),
      });
    });

    await page.getByRole("button", { name: /start practice/i }).click();

    const spinner = page.locator('[role="status"]');
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveAttribute("aria-label", "Starting practice");
  });

  test("spinner has sr-only text for screen readers", async ({ page }) => {
    await page.goto("/scam-checker");

    await page.route("**/api/scam-check", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          verdict: "SAFE",
          headline: "Safe",
          explanation: "OK.",
        }),
      });
    });

    await page.locator("#scam-input").fill("Test");
    await page.getByRole("button", { name: /check this message/i }).click();

    // The sr-only text inside the spinner should exist in the DOM
    const srText = page.locator('[role="status"] .sr-only');
    await expect(srText).toHaveText("Checking message");
  });

  test("mobile viewport — spinner is visible at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/scam-checker");

    await page.route("**/api/scam-check", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          verdict: "SAFE",
          headline: "Safe",
          explanation: "OK.",
        }),
      });
    });

    await page.locator("#scam-input").fill("Test on mobile");
    await page.getByRole("button", { name: /check this message/i }).click();

    const spinner = page.locator('[role="status"]');
    await expect(spinner).toBeVisible();
  });

  test("regression — scam checker still shows result after spinner", async ({
    page,
  }) => {
    await page.goto("/scam-checker");

    await page.route("**/api/scam-check", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          verdict: "SCAM",
          headline: "This is a scam!",
          explanation: "Don't click.",
          action_steps: ["Delete it"],
        }),
      });
    });

    await page.locator("#scam-input").fill("Click here to win money");
    await page.getByRole("button", { name: /check this message/i }).click();

    await expect(page.getByText("This is a scam!")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Delete it")).toBeVisible();
  });
});
