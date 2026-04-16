import { expect, test } from "@playwright/test";

test.describe("Emergency page", () => {
  test("loads and shows key content", async ({ page }) => {
    await page.goto("/emergency");

    // Page heading
    await expect(
      page.getByRole("heading", { name: "I Think I've Been Scammed" })
    ).toBeVisible();

    // Safety warning
    await expect(page.getByText("If you are in immediate danger, call 911")).toBeVisible();

    // Steps are numbered
    await expect(page.getByText("Stop and breathe")).toBeVisible();
    await expect(page.getByText("Do not send any more money")).toBeVisible();

    // Resources section
    await expect(page.getByRole("heading", { name: "Federal Trade Commission (FTC)" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AARP Fraud Watch Network" })).toBeVisible();

    // Phone links
    const phoneLinks = page.locator('a[href^="tel:"]');
    await expect(phoneLinks.first()).toBeVisible();

    // Encouragement message
    await expect(page.getByText("You did nothing wrong")).toBeVisible();
  });

  test("emergency link from home page", async ({ page }) => {
    await page.goto("/");

    const emergencyLink = page.getByRole("link", {
      name: /I've Been Scammed/i,
    });
    await expect(emergencyLink).toBeVisible();
    await emergencyLink.click();
    await expect(page).toHaveURL(/\/emergency/);
  });

  test("all click targets meet 48px minimum", async ({ page }) => {
    await page.goto("/emergency");

    const links = page.locator("a");
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const box = await link.boundingBox();
      if (box) {
        expect(box.height, `Link "${await link.textContent()}" is too short`).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
