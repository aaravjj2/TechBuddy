import { expect, test } from "@playwright/test";

test.describe("Loading skeletons (v18)", () => {
  test("scam checker page loads and renders correctly", async ({ page }) => {
    await page.goto("/scam-checker");
    await expect(page.getByRole("heading", { name: "Is This a Scam?" })).toBeVisible();
    await expect(page.getByRole("textbox")).toBeVisible();
  });

  test("phone help page loads and renders correctly", async ({ page }) => {
    await page.goto("/phone-help");
    await expect(page.getByRole("heading", { name: "Help With My Phone" })).toBeVisible();
  });

  test("what is AI page loads and renders correctly", async ({ page }) => {
    await page.goto("/what-is-ai");
    await expect(page.getByRole("heading", { name: "What Is AI?" })).toBeVisible();
  });

  test("practice page loads and renders correctly", async ({ page }) => {
    await page.goto("/practice");
    await expect(page.getByRole("heading", { name: "Practice Mode" })).toBeVisible();
  });

  test("mobile viewport — pages load correctly at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/scam-checker");
    await expect(page.getByRole("heading", { name: "Is This a Scam?" })).toBeVisible();
  });

  test("regression — footer still appears after load", async ({ page }) => {
    await page.goto("/what-is-ai");
    await expect(page.getByText("Need real help?")).toBeVisible();
  });
});
