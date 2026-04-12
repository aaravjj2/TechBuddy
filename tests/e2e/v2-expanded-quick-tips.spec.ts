import { expect, test } from "@playwright/test";

test.describe("Quick Tips — expanded browser (v2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/quick-tips");
  });

  test("today's highlighted tip is shown with accent border and badge", async ({
    page,
  }) => {
    const badge = page.getByText(/today's tip/i);
    await expect(badge).toBeVisible();

    // The highlighted card should have the accent border
    const badgeCard = badge.locator("..").locator("..").locator("..");
    await expect(badgeCard).toBeVisible();
  });

  test("all 19 other tips are shown in expandable cards", async ({
    page,
  }) => {
    // "All tips" heading should be visible
    await expect(page.getByRole("heading", { name: /all tips/i })).toBeVisible();

    // Each non-highlighted tip should have a "Read more" button
    const readMoreButtons = page.getByRole("button", { name: /read more/i });
    await expect(readMoreButtons).toHaveCount(19);
  });

  test("clicking 'Read more' expands a tip card showing body text", async ({
    page,
  }) => {
    const readMoreButtons = page.getByRole("button", { name: /read more/i });
    const count = await readMoreButtons.count();
    expect(count).toBeGreaterThan(0);

    // Click the first "Read more"
    await readMoreButtons.first().click();

    // After clicking, the number of "Read more" buttons should decrease by one
    // because the expanded state replaces the button with content
    await expect(page.getByRole("button", { name: /read more/i })).toHaveCount(
      count - 1,
    );
  });

  test("Read Aloud button is present on today's highlighted tip", async ({
    page,
  }) => {
    const readAloud = page.getByRole("button", { name: /read this tip to me/i });
    await expect(readAloud).toBeVisible();
  });

  test("mobile viewport — tips page is usable at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/quick-tips");

    // Today's tip should still be visible
    await expect(page.getByText(/today's tip/i)).toBeVisible();

    // "All tips" heading should be visible
    await expect(page.getByRole("heading", { name: /all tips/i })).toBeVisible();

    // At least some "Read more" buttons should be visible
    const buttons = page.getByRole("button", { name: /read more/i });
    await expect(buttons.first()).toBeVisible();
  });

  test("regression — back to home link works", async ({ page }) => {
    const homeLink = page.getByRole("link", { name: /back to home/i });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL("/");
  });
});
