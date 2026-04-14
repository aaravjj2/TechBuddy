import { expect, test } from "@playwright/test";

test.describe("Multi-device smoke checks", () => {
  test("home page renders core navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "TechBuddy" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Is This a Scam?" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Help With My Phone" })).toBeVisible();
  });

  test("scam checker supports core interaction", async ({ page }) => {
    await page.goto("/scam-checker");

    await page.getByRole("textbox", { name: /message/i }).fill("Test suspicious text");
    await expect(page.getByRole("button", { name: /check this message/i })).toBeVisible();
  });

  test("phone help topic page loads", async ({ page }) => {
    await page.goto("/phone-help");
    await page.getByRole("link", { name: /How to make a video call/i }).click();
    await expect(page.getByText(/Step 1 of/i)).toBeVisible();
  });

  test("quick tips page loads and shows daily tip", async ({ page }) => {
    await page.goto("/quick-tips");
    await expect(page.getByText(/today's tip/i)).toBeVisible();
  });

  test("practice page shows scenarios", async ({ page }) => {
    await page.goto("/practice");
    await expect(page.getByRole("heading", { name: /Practice Mode/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /fake tech support/i })).toBeVisible();
  });
});
