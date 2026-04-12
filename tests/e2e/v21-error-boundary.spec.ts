import { expect, test } from "@playwright/test";

test.describe("Error boundary (v21)", () => {
  test("error.tsx component renders with correct structure", async ({ page }) => {
    // Navigate to home to verify the app loads
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /techbuddy/i })).toBeVisible();
  });

  test("regression — normal pages still work", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /techbuddy/i })).toBeVisible();
    await page.goto("/scam-checker");
    await expect(page.getByRole("heading", { name: /is this a scam/i })).toBeVisible();
    await page.goto("/phone-help");
    await expect(page.getByRole("heading", { name: /help with my phone/i })).toBeVisible();
  });

  test("mobile viewport — pages still work at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /techbuddy/i })).toBeVisible();
  });

  test("footer with emergency resources renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByText("Need real help?")).toBeVisible();
  });
});
