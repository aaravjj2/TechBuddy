import { expect, test } from "@playwright/test";

test.describe("Home page hero enhancement (v10)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hero shows TechBuddy heading and subtitle", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "TechBuddy" }),
    ).toBeVisible();
    await expect(page.getByText("Your technology helper").first()).toBeVisible();
  });

  test("descriptive tagline is visible", async ({ page }) => {
    await expect(
      page.getByText(/learn to spot scams.*understand AI.*confidence/i),
    ).toBeVisible();
  });

  test("three trust badges are visible", async ({ page }) => {
    await expect(page.getByText("Free forever")).toBeVisible();
    await expect(page.getByText("No login required")).toBeVisible();
    await expect(page.getByText("Built for seniors")).toBeVisible();
  });

  test("all 5 navigation cards are present", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Is This a Scam?" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Help With My Phone" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "What Is AI?" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Practice Mode" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Today's Quick Tip" }),
    ).toBeVisible();
  });

  test("mobile viewport — hero and badges work at 375px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "TechBuddy" }),
    ).toBeVisible();
    await expect(page.getByText("Free forever")).toBeVisible();
    await expect(page.getByText("No login required")).toBeVisible();
    await expect(page.getByText("Built for seniors")).toBeVisible();

    // Navigation cards should still be visible (use link role — checklist duplicates labels in text)
    await expect(
      page.getByRole("link", { name: "Is This a Scam?" }),
    ).toBeVisible();
  });

  test("regression — skip link and bottom nav work on home", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(
      page.getByRole("link", { name: /skip to main content/i }),
    ).toBeAttached();
    await expect(
      page.getByRole("navigation", { name: /quick navigation/i }),
    ).toBeVisible();
  });
});
