import { expect, test } from "@playwright/test";

test.describe("Emergency resources footer (v16)", () => {
  test("footer appears on home page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Need real help?")).toBeVisible();
  });

  test("footer shows all 3 helpline resources", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("FTC Fraud Report")).toBeVisible();
    await expect(page.getByText("AARP Fraud Watch Network")).toBeVisible();
    await expect(page.getByText("988 Suicide & Crisis Lifeline")).toBeVisible();
  });

  test("phone numbers are tappable tel links", async ({ page }) => {
    await page.goto("/");

    const ftcLink = page.getByRole("link", { name: /call 1-877-382-4357/i });
    await expect(ftcLink).toBeVisible();
    await expect(ftcLink).toHaveAttribute("href", "tel:18773824357");

    const aarpLink = page.getByRole("link", { name: /call 1-877-908-3360/i });
    await expect(aarpLink).toBeVisible();
    await expect(aarpLink).toHaveAttribute("href", "tel:18779083360");

    const lifelineLink = page.getByRole("link", { name: /call 988/i });
    await expect(lifelineLink).toBeVisible();
    await expect(lifelineLink).toHaveAttribute("href", "tel:988");
  });

  test("footer appears on scam checker page", async ({ page }) => {
    await page.goto("/scam-checker");
    await expect(page.getByText("Need real help?")).toBeVisible();
  });

  test("footer appears on phone help page", async ({ page }) => {
    await page.goto("/phone-help");
    await expect(page.getByText("Need real help?")).toBeVisible();
  });

  test("footer appears on quick tips page", async ({ page }) => {
    await page.goto("/quick-tips");
    await expect(page.getByText("Need real help?")).toBeVisible();
  });

  test("mobile viewport — footer visible at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(page.getByText("Need real help?")).toBeVisible();
    await expect(page.getByRole("link", { name: /call 988/i })).toBeVisible();
  });

  test("regression — skip to content link still works", async ({ page }) => {
    await page.goto("/");
    // Tab to the skip link
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });
});
