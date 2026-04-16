import { expect, test } from "@playwright/test";

test.describe("Practice Mode progress (v5)", () => {
  test("progress card shows initial state with 0 completed", async ({
    page,
  }) => {
    await page.goto("/practice");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await expect(page.getByText(/you've completed 0 of \d+/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /your progress/i })).toBeVisible();
  });

  test("progress bar has correct aria attributes", async ({ page }) => {
    await page.goto("/practice");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const bar = page.getByRole("progressbar");
    await expect(bar).toBeVisible();
    await expect(bar).toHaveAttribute("aria-valuemin", "0");
  });

  test("all scenario cards are displayed", async ({ page }) => {
    await page.goto("/practice");

    const scenarioLinks = page.locator("ul li a[href^='/practice/']");
    const count = await scenarioLinks.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("mobile viewport — progress card is usable at 375px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/practice");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await expect(page.getByText(/you've completed \d+ of \d+/i)).toBeVisible();
    await expect(page.getByRole("progressbar")).toBeVisible();
  });

  test("scenario links navigate to correct pages", async ({ page }) => {
    await page.goto("/practice");

    await page.getByRole("link", { name: /fake tech support/i }).click();
    await expect(page).toHaveURL(/\/practice\/fake-tech-support/);
    await expect(page.getByText(/start practice/i)).toBeVisible();
  });

  test("regression — completed scenarios show checkmark", async ({ page }) => {
    await page.goto("/practice");
    await page.evaluate(() => {
      localStorage.setItem(
        "techbuddy-practice-completed",
        JSON.stringify(["fake-tech-support"]),
      );
    });
    await page.reload();

    await expect(page.getByText(/you've completed 1 of \d+/i)).toBeVisible();
    const checkmark = page.locator('span[aria-label="Completed"]');
    await expect(checkmark).toBeVisible();
  });
});
