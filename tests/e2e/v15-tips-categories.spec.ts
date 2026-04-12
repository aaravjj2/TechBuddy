import { expect, test } from "@playwright/test";

test.describe("Quick tips category filtering (v15)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/quick-tips");
  });

  test("category filter buttons are visible", async ({ page }) => {
    const filterGroup = page.getByRole("group", { name: /filter tips/i });
    await expect(filterGroup).toBeVisible();

    await expect(page.getByRole("button", { name: "All" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Scam Safety" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Phone Skills" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Online Safety" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Privacy" })).toBeVisible();
  });

  test("All filter is selected by default", async ({ page }) => {
    const allBtn = page.getByRole("button", { name: "All" });
    // The "All" button should have the accent class (white text on accent bg)
    await expect(allBtn).toHaveClass(/bg-accent/);
  });

  test("clicking Scam Safety filter shows only scam tips", async ({ page }) => {
    await page.getByRole("button", { name: "Scam Safety" }).click();

    // Should show scam tips
    await expect(page.getByText("Gift cards are a red flag")).toBeVisible();
    await expect(page.getByText("Your bank will never text you for your password")).toBeVisible();

    // Should NOT show phone skills tips
    await expect(page.getByText("Make text bigger on any website")).not.toBeVisible();
  });

  test("clicking Phone Skills filter shows only phone tips", async ({ page }) => {
    await page.getByRole("button", { name: "Phone Skills" }).click();

    await expect(page.getByText("Make text bigger on any website")).toBeVisible();
    await expect(page.getByText("Silence unknown callers")).toBeVisible();

    // Scam tips should not be visible in the list
    await expect(page.getByText("Gift cards are a red flag")).not.toBeVisible();
  });

  test("switching back to All shows all tips", async ({ page }) => {
    await page.getByRole("button", { name: "Privacy" }).click();
    await page.getByRole("button", { name: "All" }).click();

    // All tips should be visible
    await expect(page.getByText("Gift cards are a red flag")).toBeVisible();
    await expect(page.getByText("Make text bigger on any website")).toBeVisible();
  });

  test("category badges are visible on tip cards", async ({ page }) => {
    // At least one "Scam Safety" badge should be visible in the tip cards
    const badges = page.locator("article span.rounded-full");
    await expect(badges.first()).toBeVisible();
  });

  test("mobile viewport — filter buttons visible at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/quick-tips");

    await expect(page.getByRole("button", { name: "All" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Scam Safety" })).toBeVisible();

    // Filtering works on mobile
    await page.getByRole("button", { name: "Scam Safety" }).click();
    await expect(page.getByText("Gift cards are a red flag")).toBeVisible();
  });

  test("regression — today's tip still highlighted at top", async ({ page }) => {
    await expect(page.getByText("Today's Tip")).toBeVisible();
  });
});
