import { expect, test } from "@playwright/test";

test.describe("Back to Top button (v30)", () => {
  test("button is not visible at top of page", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /back to top/i }),
    ).toHaveCount(0);
  });

  test("button appears after scrolling down", async ({ page }) => {
    await page.goto("/quick-tips");
    // Scroll down to trigger the button
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(200);
    await expect(
      page.getByRole("button", { name: /back to top/i }),
    ).toBeVisible();
  });

  test("clicking button scrolls to top", async ({ page }) => {
    await page.goto("/quick-tips");
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(200);
    await expect(
      page.getByRole("button", { name: /back to top/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: /back to top/i }).click();

    // Wait for smooth scroll to complete
    await page.waitForTimeout(500);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });

  test("mobile viewport — button positioned above bottom nav", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/quick-tips");
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(200);

    const button = page.getByRole("button", { name: /back to top/i });
    await expect(button).toBeVisible();

    // Button should not overlap with the bottom nav (which is at bottom-0, h-16)
    const box = await button.boundingBox();
    expect(box).toBeTruthy();
    // Button bottom should be above viewport bottom minus nav height (64px)
    const viewportHeight = 812;
    expect(box!.y + box!.height).toBeLessThan(viewportHeight - 64);
  });

  test("button has adequate touch target size", async ({ page }) => {
    await page.goto("/quick-tips");
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(200);

    const button = page.getByRole("button", { name: /back to top/i });
    const box = await button.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThanOrEqual(56);
    expect(box!.height).toBeGreaterThanOrEqual(56);
  });

  test("regression — skip link still works", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: /skip to main content/i }),
    ).toBeAttached();
  });
});
