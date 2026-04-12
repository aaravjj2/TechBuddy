import { expect, test } from "@playwright/test";

test.describe("Breadcrumb navigation (v24)", () => {
  test("phone help topic has breadcrumb with Home and Phone Help links", async ({ page }) => {
    await page.goto("/phone-help/wifi");

    // Breadcrumb link "Phone Help" (distinct from "← All topics" and MobileNav)
    await expect(page.getByRole("link", { name: "Phone Help", exact: true })).toBeVisible();
  });

  test("breadcrumb Home link works", async ({ page }) => {
    await page.goto("/phone-help/wifi");

    // Click the first breadcrumb "Home" link
    await page.getByRole("link", { name: "Home", exact: true }).first().click();
    await expect(page).toHaveURL("/");
  });

  test("practice scenario has breadcrumb with Practice link", async ({ page }) => {
    await page.goto("/practice/fake-tech-support");

    await expect(page.getByRole("link", { name: "Practice", exact: true })).toBeVisible();
  });

  test("mobile viewport — breadcrumb visible at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/phone-help/wifi");

    await expect(page.getByRole("link", { name: "Phone Help", exact: true })).toBeVisible();
  });

  test("regression — walkthrough still works", async ({ page }) => {
    await page.goto("/phone-help/wifi");
    await expect(page.getByText("Step 1 of 4")).toBeVisible();
    await page.getByRole("button", { name: /next step/i }).click();
    await expect(page.getByText("Step 2 of 4")).toBeVisible();
  });
});
