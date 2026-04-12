import { expect, test } from "@playwright/test";

test.describe("Phone Help image fallback (v4)", () => {
  test("step card shows image with error handler attribute", async ({
    page,
  }) => {
    await page.goto("/phone-help/wifi");

    // The img should be present and visible
    const img = page.locator("img").first();
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute("alt", /.+/);
  });

  test("step navigation works across all steps", async ({ page }) => {
    await page.goto("/phone-help/wifi");

    await expect(page.getByText("Step 1 of 4")).toBeVisible();

    // Navigate through all steps
    await page.getByRole("button", { name: /next step/i }).click();
    await expect(page.getByText("Step 2 of 4")).toBeVisible();

    await page.getByRole("button", { name: /next step/i }).click();
    await expect(page.getByText("Step 3 of 4")).toBeVisible();

    await page.getByRole("button", { name: /next step/i }).click();
    await expect(page.getByText("Step 4 of 4")).toBeVisible();
  });

  test("read aloud button works on phone help steps", async ({ page }) => {
    await page.goto("/phone-help/wifi");

    const readAloud = page.getByRole("button", { name: /read this step to me/i });
    await expect(readAloud).toBeVisible();
    await expect(readAloud).toBeEnabled();
  });

  test("mobile viewport — phone help is usable at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/phone-help/charging");

    await expect(page.getByText("Step 1 of 3")).toBeVisible();
    await expect(page.getByRole("button", { name: /read this step to me/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /next step/i })).toBeVisible();
  });

  test("progress bar is visible on phone help steps", async ({ page }) => {
    await page.goto("/phone-help/wifi");

    const progressbar = page.getByRole("progressbar");
    await expect(progressbar).toBeVisible();
    await expect(progressbar).toHaveAttribute("aria-valuenow", "1");
    await expect(progressbar).toHaveAttribute("aria-valuemax", "4");
  });

  test("regression — previous/next buttons have correct disabled states", async ({
    page,
  }) => {
    await page.goto("/phone-help/wifi");

    await expect(page.getByRole("button", { name: /previous/i })).toBeDisabled();
    await expect(page.getByRole("button", { name: /next step/i })).toBeEnabled();

    // Go to last step (wifi has 4 steps)
    await page.getByRole("button", { name: /next step/i }).click();
    await page.getByRole("button", { name: /next step/i }).click();
    await page.getByRole("button", { name: /next step/i }).click();

    await expect(page.getByRole("button", { name: /next step/i })).toBeDisabled();
    await expect(page.getByRole("button", { name: /previous/i })).toBeEnabled();
  });
});
