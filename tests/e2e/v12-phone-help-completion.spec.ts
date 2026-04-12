import { expect, test } from "@playwright/test";

test.describe("Phone help walkthrough completion (v12)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/phone-help/charging");
  });

  test("last step shows Done button instead of Next Step", async ({ page }) => {
    // charging has 3 steps — navigate to last step
    await page.getByRole("button", { name: /next step/i }).click();
    await page.getByRole("button", { name: /next step/i }).click();

    // Should be on step 3 of 3
    await expect(page.getByText("Step 3 of 3")).toBeVisible();

    // Done button should be visible, no Next Step button
    await expect(page.getByRole("button", { name: /done/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /next step/i })).not.toBeVisible();
  });

  test("tapping Done shows completion card", async ({ page }) => {
    // Navigate to last step
    await page.getByRole("button", { name: /next step/i }).click();
    await page.getByRole("button", { name: /next step/i }).click();

    // Tap Done
    await page.getByRole("button", { name: /done/i }).click();

    // Completion card should appear
    await expect(page.getByText("You did it!")).toBeVisible();
    await expect(page.getByText("You completed every step of this guide.")).toBeVisible();
    await expect(page.getByText(/— Complete$/)).toBeVisible();
  });

  test("completion card has navigation links", async ({ page }) => {
    // Navigate to last step and complete
    await page.getByRole("button", { name: /next step/i }).click();
    await page.getByRole("button", { name: /next step/i }).click();
    await page.getByRole("button", { name: /done/i }).click();

    // "Try another topic" link
    await expect(page.getByRole("link", { name: /try another topic/i })).toBeVisible();
    // "Back to home" link
    await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
  });

  test("Try another topic navigates to phone help index", async ({ page }) => {
    await page.getByRole("button", { name: /next step/i }).click();
    await page.getByRole("button", { name: /next step/i }).click();
    await page.getByRole("button", { name: /done/i }).click();

    await page.getByRole("link", { name: /try another topic/i }).click();
    await expect(page).toHaveURL("/phone-help");
  });

  test("Back to home navigates to home page", async ({ page }) => {
    await page.getByRole("button", { name: /next step/i }).click();
    await page.getByRole("button", { name: /next step/i }).click();
    await page.getByRole("button", { name: /done/i }).click();

    await page.getByRole("link", { name: /back to home/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("mobile viewport — completion card visible at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/phone-help/charging");

    await page.getByRole("button", { name: /next step/i }).click();
    await page.getByRole("button", { name: /next step/i }).click();
    await page.getByRole("button", { name: /done/i }).click();

    await expect(page.getByText("You did it!")).toBeVisible();
    await expect(page.getByRole("link", { name: /try another topic/i })).toBeVisible();
  });

  test("regression — previous button still works during walkthrough", async ({ page }) => {
    await page.getByRole("button", { name: /next step/i }).click();
    await expect(page.getByText("Step 2 of 3")).toBeVisible();

    await page.getByRole("button", { name: /previous/i }).click();
    await expect(page.getByText("Step 1 of 3")).toBeVisible();
  });
});
