import { expect, test } from "@playwright/test";

test.describe("Phone help step navigation dots (v14)", () => {
  test.beforeEach(async ({ page }) => {
    // wifi has 4 steps
    await page.goto("/phone-help/wifi");
  });

  test("step dots appear for each step", async ({ page }) => {
    // wifi has 4 steps, so 4 numbered dots
    const dots = page.getByRole("button", { name: /go to step/i });
    await expect(dots).toHaveCount(4);
  });

  test("current step dot is highlighted", async ({ page }) => {
    // On step 1, dot 1 should be current
    const step1 = page.getByRole("button", { name: /go to step 1.*current/i });
    await expect(step1).toBeVisible();
    await expect(step1).toHaveAttribute("aria-current", "step");
  });

  test("clicking a dot navigates to that step", async ({ page }) => {
    // Click step 3 dot
    await page.getByRole("button", { name: "Go to step 3" }).click();
    await expect(page.getByText("Step 3 of 4")).toBeVisible();
  });

  test("completed steps show visually different from upcoming", async ({ page }) => {
    // Navigate to step 3
    await page.getByRole("button", { name: "Go to step 3" }).click();
    await expect(page.getByText("Step 3 of 4")).toBeVisible();

    // Steps 1 and 2 should be completed
    const step1 = page.getByRole("button", { name: /go to step 1.*completed/i });
    await expect(step1).toBeVisible();
    const step2 = page.getByRole("button", { name: /go to step 2.*completed/i });
    await expect(step2).toBeVisible();

    // Step 4 should not be completed
    const step4 = page.getByRole("button", { name: "Go to step 4" });
    await expect(step4).toBeVisible();
  });

  test("mobile viewport — dots visible at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/phone-help/wifi");

    const dots = page.getByRole("button", { name: /go to step/i });
    await expect(dots).toHaveCount(4);
    await expect(page.getByText("Step 1 of 4")).toBeVisible();
  });

  test("regression — previous and next buttons still work", async ({ page }) => {
    await page.getByRole("button", { name: /next step/i }).click();
    await expect(page.getByText("Step 2 of 4")).toBeVisible();

    await page.getByRole("button", { name: /previous/i }).click();
    await expect(page.getByText("Step 1 of 4")).toBeVisible();
  });

  test("regression — Done button on last step triggers completion", async ({ page }) => {
    // Navigate to last step
    await page.getByRole("button", { name: "Go to step 4" }).click();
    await expect(page.getByText("Step 4 of 4")).toBeVisible();

    // Done button should be visible
    await page.getByRole("button", { name: /done/i }).click();
    await expect(page.getByText("You did it!")).toBeVisible();
  });
});
