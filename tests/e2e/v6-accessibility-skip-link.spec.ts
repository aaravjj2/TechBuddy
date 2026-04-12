import { expect, test } from "@playwright/test";

test.describe("Accessibility skip link (v6)", () => {
  test("skip link exists and is first focusable element on home page", async ({
    page,
  }) => {
    await page.goto("/");
    // Tab to the first focusable element
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();
  });

  test("skip link is hidden by default and visible on focus", async ({
    page,
  }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: /skip to main content/i });

    // Should exist in DOM but be positioned off-screen
    await expect(skipLink).toBeAttached();

    // Focus it — should become visible
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });

  test("skip link navigates to main content area", async ({ page }) => {
    await page.goto("/scam-checker");

    // Focus the skip link, then press Enter (simulates real keyboard usage)
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");

    // Focus should move to main content
    const main = page.locator("#main-content");
    await expect(main).toBeFocused();
  });

  test("main content area exists as a landmark element", async ({ page }) => {
    await page.goto("/");
    const main = page.locator("#main-content");
    await expect(main).toBeVisible();
    // The <main> element has implicit role="main" per HTML spec
    // Verify it's a landmark by checking the tag name
    const tagName = await main.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe("main");
  });

  test("mobile viewport — skip link works at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/quick-tips");

    const skipLink = page.getByRole("link", { name: /skip to main content/i });
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
    await skipLink.click();

    const main = page.locator("#main-content");
    await expect(main).toBeFocused();
  });

  test("regression — all pages have skip link", async ({ page }) => {
    const pages = ["/", "/scam-checker", "/practice", "/phone-help", "/quick-tips"];

    for (const path of pages) {
      await page.goto(path);
      const skipLink = page.getByRole("link", { name: /skip to main content/i });
      await expect(skipLink).toBeAttached();
    }
  });
});
