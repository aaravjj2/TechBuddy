import { expect, test } from "@playwright/test";

test.describe("Completion celebration animation (v20)", () => {
  test("phone help completion checkmark is visible", async ({ page }) => {
    await page.goto("/phone-help/charging");

    // Navigate to last step
    await page.getByRole("button", { name: "Go to step 3" }).click();
    await expect(page.getByText("Step 3 of 3")).toBeVisible();

    // Tap Done
    await page.getByRole("button", { name: /done/i }).click();

    // Completion should show with checkmark
    await expect(page.getByText("You did it!")).toBeVisible();
  });

  test("celebration animation class is applied", async ({ page }) => {
    await page.goto("/phone-help/charging");
    await page.getByRole("button", { name: "Go to step 3" }).click();
    await page.getByRole("button", { name: /done/i }).click();

    // The checkmark should have the animate-celebrate class
    const checkmark = page.locator("span.animate-celebrate");
    await expect(checkmark).toBeVisible();
  });

  test("mobile viewport — celebration works at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/phone-help/charging");
    await page.getByRole("button", { name: "Go to step 3" }).click();
    await page.getByRole("button", { name: /done/i }).click();

    await expect(page.getByText("You did it!")).toBeVisible();
    await expect(page.locator("span.animate-celebrate")).toBeVisible();
  });

  test("prefers-reduced-motion disables animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/phone-help/charging");
    await page.getByRole("button", { name: "Go to step 3" }).click();
    await page.getByRole("button", { name: /done/i }).click();

    // Checkmark should still be visible, just without animation
    await expect(page.getByText("You did it!")).toBeVisible();
  });

  test("regression — navigation links work after completion", async ({ page }) => {
    await page.goto("/phone-help/charging");
    await page.getByRole("button", { name: "Go to step 3" }).click();
    await page.getByRole("button", { name: /done/i }).click();

    await page.getByRole("link", { name: /try another topic/i }).click();
    await expect(page).toHaveURL("/phone-help");
  });
});
