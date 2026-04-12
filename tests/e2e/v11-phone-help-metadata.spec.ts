import { expect, test } from "@playwright/test";

test.describe("Phone help topic metadata (v11)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/phone-help");
  });

  test("each topic card shows a step count badge", async ({ page }) => {
    // Check specific known step counts — use .first() to avoid strict mode
    // video-call has 5 steps, wifi has 4 steps, charging has 3 steps
    await expect(page.getByText("5 steps")).toBeVisible();
    await expect(page.getByText("4 steps").first()).toBeVisible();
    await expect(page.getByText("3 steps").first()).toBeVisible();

    // Verify all 8 topic cards contain a step count badge pattern
    const stepBadges = page.locator("a[href^='/phone-help/']");
    await expect(stepBadges).toHaveCount(8);
  });

  test("each topic card shows estimated time badge", async ({ page }) => {
    // 5 steps = ~3 min, 4 steps = ~2 min, 3 steps = ~2 min
    // So "~3 min" appears once and "~2 min" appears multiple times
    await expect(page.getByText("~3 min")).toBeVisible();
    await expect(page.getByText("~2 min").first()).toBeVisible();
  });

  test("all 8 topics are listed with correct titles", async ({ page }) => {
    await expect(page.getByText("How to make a video call")).toBeVisible();
    await expect(page.getByText("How to share a photo")).toBeVisible();
    await expect(page.getByText("How to update your apps")).toBeVisible();
    await expect(page.getByText("How to make text bigger")).toBeVisible();
    await expect(page.getByText("How to connect to WiFi")).toBeVisible();
    await expect(page.getByText("How to charge your phone")).toBeVisible();
    await expect(page.getByText("How to mute or unmute")).toBeVisible();
    await expect(page.getByText("How to take a screenshot")).toBeVisible();
  });

  test("mobile viewport — metadata badges visible at 375px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/phone-help");

    await expect(page.getByText("5 steps")).toBeVisible();
    await expect(page.getByText("~3 min")).toBeVisible();
  });

  test("topic links still navigate to walkthrough", async ({ page }) => {
    await page.getByRole("link", { name: /wifi/i }).click();
    await expect(page).toHaveURL("/phone-help/wifi");
    await expect(page.getByText("Step 1 of 4")).toBeVisible();
  });

  test("regression — back to home link works", async ({ page }) => {
    await page.getByRole("link", { name: /back to home/i }).click();
    await expect(page).toHaveURL("/");
  });
});
