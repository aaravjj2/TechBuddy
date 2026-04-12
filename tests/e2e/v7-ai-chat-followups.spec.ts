import { expect, test } from "@playwright/test";

test.describe("AI Chat follow-up suggestions (v7)", () => {
  test("follow-up suggestions appear after AI responds", async ({ page }) => {
    await page.goto("/what-is-ai");

    await page.route("**/api/ai-chat", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: 'data: {"text": "AI is like a helpful library assistant."}\n\ndata: [DONE]\n\n',
      });
    });

    // Click a starter question
    await page.getByRole("button", { name: /what even is ai/i }).click();

    // Wait for AI response
    await expect(page.getByText("library assistant")).toBeVisible({
      timeout: 10000,
    });

    // Follow-up suggestions should appear
    await expect(page.getByText("You might also wonder")).toBeVisible();
    const suggestionButtons = page.locator(
      'text=You might also wonder: >> xpath=following-sibling::div >> button',
    );
    const count = await suggestionButtons.count();
    expect(count).toBe(3);
  });

  test("tapping a follow-up sends it as next message", async ({ page }) => {
    await page.goto("/what-is-ai");

    let callCount = 0;
    await page.route("**/api/ai-chat", async (route) => {
      callCount++;
      await route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: `data: {"text": "Answer ${callCount}."}\n\ndata: [DONE]\n\n`,
      });
    });

    // Send first message
    await page.getByRole("button", { name: /is ai safe/i }).click();
    await expect(page.getByText("Answer 1.")).toBeVisible({ timeout: 10000 });

    // Click first follow-up
    const firstSuggestion = page.locator(
      'text=You might also wonder >> .. >> button',
    ).first();
    const suggestionText = await firstSuggestion.textContent();
    await firstSuggestion.click();

    // The suggestion should appear as a user message
    await expect(page.getByText(suggestionText!)).toBeVisible();
  });

  test("suggestions disappear during streaming", async ({ page }) => {
    await page.goto("/what-is-ai");

    await page.route("**/api/ai-chat", async (route) => {
      await new Promise((r) => setTimeout(r, 2000));
      await route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: 'data: {"text": "AI is helpful."}\n\ndata: [DONE]\n\n',
      });
    });

    // First exchange
    await page.getByRole("button", { name: /can ai lie/i }).click();
    await expect(page.getByText("AI is helpful.")).toBeVisible({
      timeout: 10000,
    });

    // Suggestions should be visible now
    await expect(page.getByText("You might also wonder")).toBeVisible();

    // Now mock a slow response for the second exchange
    await page.route("**/api/ai-chat", async (route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: 'data: {"text": "Second answer."}\n\ndata: [DONE]\n\n',
      });
    });

    // Click a suggestion
    const suggestion = page.locator(
      'text=You might also wonder >> .. >> button',
    ).first();
    await suggestion.click();

    // Suggestions should disappear during streaming
    await expect(page.getByText("You might also wonder")).not.toBeVisible({
      timeout: 2000,
    });
  });

  test("mobile viewport — suggestions are usable at 375px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/what-is-ai");

    await page.route("**/api/ai-chat", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: 'data: {"text": "AI is a tool."}\n\ndata: [DONE]\n\n',
      });
    });

    await page.getByRole("button", { name: /what even is ai/i }).click();
    await expect(page.getByText("AI is a tool.")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByText("You might also wonder")).toBeVisible();

    // Suggestion buttons should have adequate tap targets
    const buttons = page.locator(
      'text=You might also wonder >> .. >> button',
    );
    for (const btn of await buttons.all()) {
      const box = await btn.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(50);
    }
  });

  test("start over clears suggestions", async ({ page }) => {
    await page.goto("/what-is-ai");

    await page.route("**/api/ai-chat", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: 'data: {"text": "Hello!"}\n\ndata: [DONE]\n\n',
      });
    });

    await page.getByRole("button", { name: /what even is ai/i }).click();
    await expect(page.getByText("Hello!")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("You might also wonder")).toBeVisible();

    // Click Start over
    await page.getByRole("button", { name: /start over/i }).click();

    // Suggestions should be gone
    await expect(page.getByText("You might also wonder")).not.toBeVisible();

    // Starter questions should be back
    await expect(page.getByText("Pick a question to start")).toBeVisible();
  });

  test("regression — starter questions still work on initial load", async ({
    page,
  }) => {
    await page.goto("/what-is-ai");

    // Should see 5 starter buttons
    const starters = page.locator("button", {
      hasText: /^(What even|Is AI safe|Can AI lie|How is AI|Will AI)/,
    });
    await expect(starters).toHaveCount(5);
  });
});
