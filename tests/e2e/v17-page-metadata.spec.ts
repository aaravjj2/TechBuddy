import { expect, test } from "@playwright/test";

test.describe("Page-specific metadata (v17)", () => {
  test("home page has distinct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/TechBuddy/);
  });

  test("scam checker page has distinct title", async ({ page }) => {
    await page.goto("/scam-checker");
    await expect(page).toHaveTitle(/Is This a Scam\?.*TechBuddy/);
  });

  test("phone help page has distinct title", async ({ page }) => {
    await page.goto("/phone-help");
    await expect(page).toHaveTitle(/Help With My Phone.*TechBuddy/);
  });

  test("what is AI page has distinct title", async ({ page }) => {
    await page.goto("/what-is-ai");
    await expect(page).toHaveTitle(/What Is AI\?.*TechBuddy/);
  });

  test("practice page has distinct title", async ({ page }) => {
    await page.goto("/practice");
    await expect(page).toHaveTitle(/Practice Mode.*TechBuddy/);
  });

  test("quick tips page has distinct title", async ({ page }) => {
    await page.goto("/quick-tips");
    await expect(page).toHaveTitle(/Quick Tips.*TechBuddy/);
  });

  test("root layout has og:type meta tag", async ({ page }) => {
    await page.goto("/");
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", "website");
  });

  test("mobile viewport — titles still correct at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/scam-checker");
    await expect(page).toHaveTitle(/Is This a Scam\?.*TechBuddy/);
  });
});
