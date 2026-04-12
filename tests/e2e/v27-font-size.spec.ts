import { expect, test } from "@playwright/test";

test.describe("Font size controls (v27)", () => {
  test("A+ and A- buttons are visible in footer", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(page.getByRole("button", { name: /decrease font size/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /increase font size/i })).toBeVisible();
  });

  test("A+ increases font size", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();

    await page.getByRole("button", { name: /increase font size/i }).click();

    const fontSize = await page.locator("html").evaluate((el) => el.style.fontSize);
    expect(fontSize).toBe("22px");
  });

  test("A- decreases font size", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();

    await page.getByRole("button", { name: /decrease font size/i }).click();

    const fontSize = await page.locator("html").evaluate((el) => el.style.fontSize);
    expect(fontSize).toBe("18px");
  });

  test("font size persists after reload", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: /increase font size/i }).click();
    await page.getByRole("button", { name: /increase font size/i }).click();

    await page.reload();
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();

    const fontSize = await page.locator("html").evaluate((el) => el.style.fontSize);
    expect(fontSize).toBe("24px");
  });

  test("mobile viewport — controls visible at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(page.getByRole("button", { name: /increase font size/i })).toBeVisible();
  });

  test("regression — footer resources still visible", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(page.getByText("Need real help?")).toBeVisible();
  });
});
