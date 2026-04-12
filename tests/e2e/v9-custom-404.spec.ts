import { expect, test } from "@playwright/test";

test.describe("Custom 404 page (v9)", () => {
  test("custom 404 page appears for non-existent routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    await expect(page.getByText("Page not found")).toBeVisible();
    await expect(
      page.getByText(/doesn't exist/i),
    ).toBeVisible();
  });

  test("Go Home button navigates to home page", async ({ page }) => {
    await page.goto("/nonexistent");

    const homeButton = page.getByRole("link", { name: /go home/i });
    await expect(homeButton).toBeVisible();

    await homeButton.click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "TechBuddy" })).toBeVisible();
  });

  test("Go Home button has adequate tap target size", async ({ page }) => {
    await page.goto("/missing-page");

    const homeButton = page.getByRole("link", { name: /go home/i });
    const box = await homeButton.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(56);
    expect(box!.width).toBeGreaterThanOrEqual(200);
  });

  test("mobile viewport — 404 page is usable at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/no-such-page");

    await expect(page.getByText("Page not found")).toBeVisible();
    await expect(page.getByRole("link", { name: /go home/i })).toBeVisible();
  });

  test("regression — skip link works on 404 page", async ({ page }) => {
    await page.goto("/bad-url");

    const skipLink = page.getByRole("link", { name: /skip to main content/i });
    await expect(skipLink).toBeAttached();
  });

  test("regression — mobile bottom nav shows on 404 page", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/not-a-real-page");

    const nav = page.getByRole("navigation", { name: /quick navigation/i });
    await expect(nav).toBeVisible();
  });
});
