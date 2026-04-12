import { expect, test } from "@playwright/test";

test.describe("Mobile bottom navigation (v8)", () => {
  test("bottom nav is visible on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: /quick navigation/i });
    await expect(nav).toBeVisible();
  });

  test("bottom nav is hidden on desktop screens", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: /quick navigation/i });
    await expect(nav).not.toBeVisible();
  });

  test("bottom nav has 5 navigation links", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: /quick navigation/i });
    const links = nav.getByRole("link");
    await expect(links).toHaveCount(5);

    // Verify labels
    await expect(nav.getByText("Home")).toBeVisible();
    await expect(nav.getByText("Scam?")).toBeVisible();
    await expect(nav.getByText("Phone")).toBeVisible();
    await expect(nav.getByText("AI Chat")).toBeVisible();
    await expect(nav.getByText("Practice")).toBeVisible();
  });

  test("current page is highlighted in bottom nav", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/scam-checker");

    const nav = page.getByRole("navigation", { name: /quick navigation/i });
    const scamLink = nav.getByRole("link", { name: /scam/i });
    await expect(scamLink).toHaveAttribute("aria-current", "page");

    // Home should not be current
    const homeLink = nav.getByRole("link", { name: /home/i });
    await expect(homeLink).not.toHaveAttribute("aria-current", "page");
  });

  test("tapping bottom nav link navigates to correct page", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: /quick navigation/i });
    await nav.getByRole("link", { name: /practice/i }).click();
    await expect(page).toHaveURL("/practice");
    await expect(page.getByText("Your progress")).toBeVisible();
  });

  test("page content has bottom padding to avoid nav overlap", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/quick-tips");

    const main = page.locator("#main-content");
    const classes = await main.getAttribute("class");
    expect(classes).toContain("pb-24");
  });
});
