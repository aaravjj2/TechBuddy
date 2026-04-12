import { expect, test } from "@playwright/test";

test.describe("High contrast mode (v26)", () => {
  test("toggle button is visible in footer", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(page.getByRole("button", { name: /high contrast/i })).toBeVisible();
  });

  test("toggling switches to high contrast", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();

    const btn = page.getByRole("button", { name: /high contrast/i });
    await btn.click();

    // HTML should have high-contrast class
    const htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass).toContain("high-contrast");

    // Button text should change
    await expect(page.getByRole("button", { name: /standard contrast/i })).toBeVisible();
  });

  test("high contrast persists after reload", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: /high contrast/i }).click();

    await page.reload();
    const htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass).toContain("high-contrast");
  });

  test("mobile viewport — toggle visible at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(page.getByRole("button", { name: /high contrast/i })).toBeVisible();
  });

  test("regression — footer resources still visible", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(page.getByText("Need real help?")).toBeVisible();
    await expect(page.getByText("FTC Fraud Report")).toBeVisible();
  });
});
