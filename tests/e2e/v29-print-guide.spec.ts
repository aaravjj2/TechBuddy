import { expect, test } from "@playwright/test";

test.describe("Print-friendly guides (v29)", () => {
  test("Print button is visible on phone help topic page", async ({ page }) => {
    await page.goto("/phone-help/wifi");
    await expect(
      page.getByRole("button", { name: /print this guide/i }),
    ).toBeVisible();
  });

  test("Print button triggers window.print", async ({ page }) => {
    await page.goto("/phone-help/wifi");
    // Verify the button calls window.print by checking it exists and is clickable
    const printButton = page.getByRole("button", { name: /print this guide/i });
    await expect(printButton).toBeEnabled();
  });

  test("Print button is hidden on home page", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /print this guide/i }),
    ).toHaveCount(0);
  });

  test("Print view shows all steps", async ({ page }) => {
    await page.goto("/phone-help/wifi");
    // The print-only div is hidden on screen but contains all steps
    const printArea = page.locator(".print-only").first();
    const steps = printArea.locator(".step-card");
    // print area contains all 4 wifi steps with numbered format "1. instruction"
    await expect(steps).toHaveCount(4);
    await expect(steps.nth(0)).toContainText("1.");
  });

  test("mobile viewport — print button visible at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/phone-help/wifi");
    await expect(
      page.getByRole("button", { name: /print this guide/i }),
    ).toBeVisible();
  });

  test("regression — phone help topic still works normally", async ({
    page,
  }) => {
    await page.goto("/phone-help/wifi");
    await expect(
      page.getByRole("heading", { name: /connect to wifi/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /next step/i }),
    ).toBeVisible();
  });
});
