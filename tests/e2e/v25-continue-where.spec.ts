import { expect, test } from "@playwright/test";

test.describe("Continue where you left off (v25)", () => {
  test("no continue card on first visit", async ({ page }) => {
    // Clear localStorage
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Should NOT show continue card
    await expect(page.getByText("Continue where you left off")).not.toBeVisible();
  });

  test("continue card appears after visiting a section", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());

    // Visit scam checker
    await page.getByRole("link", { name: /is this a scam/i }).click();
    await expect(page).toHaveURL("/scam-checker");

    // Go back to home
    await page.getByRole("link", { name: /back to home/i }).click();
    await expect(page).toHaveURL("/");

    // Should now show continue card
    await expect(page.getByText("Continue where you left off")).toBeVisible();
    // The continue card contains a link to the last visited section
    const continueLink = page.locator('div.border-accent a[href="/scam-checker"]');
    await expect(continueLink).toBeVisible();
  });

  test("continue card links to last visited section", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());

    // Visit phone help
    await page.getByRole("link", { name: /help with my phone/i }).click();
    await expect(page).toHaveURL("/phone-help");

    // Go back to home
    await page.goto("/");

    // Continue card should link to phone help
    await expect(page.getByText("Continue where you left off")).toBeVisible();
    const continueLink = page.getByRole("link", { name: /help with my phone/i }).first();
    await continueLink.click();
    await expect(page).toHaveURL("/phone-help");
  });

  test("mobile viewport — continue card visible at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    // Simulate a previous visit
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("techbuddy-last-visit", "/quick-tips"));
    await page.reload();

    await expect(page.getByText("Continue where you left off")).toBeVisible();
  });

  test("regression — home page still shows all nav buttons", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /is this a scam/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /help with my phone/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /what is ai/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /practice mode/i })).toBeVisible();
  });
});
