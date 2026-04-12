import { expect, test } from "@playwright/test";

test.describe("PWA manifest (v22)", () => {
  test("manifest.json is accessible", async ({ page }) => {
    const response = await page.request.get("http://localhost:3013/manifest.json");
    expect(response.ok()).toBeTruthy();

    const manifest = await response.json();
    expect(manifest.name).toContain("TechBuddy");
    expect(manifest.short_name).toBe("TechBuddy");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBe("#2d7dd2");
  });

  test("manifest has icons defined", async ({ page }) => {
    const response = await page.request.get("http://localhost:3013/manifest.json");
    const manifest = await response.json();
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  });

  test("icon files are accessible", async ({ page }) => {
    const icon192 = await page.request.get("http://localhost:3013/icon-192.svg");
    expect(icon192.ok()).toBeTruthy();

    const icon512 = await page.request.get("http://localhost:3013/icon-512.svg");
    expect(icon512.ok()).toBeTruthy();
  });

  test("manifest link is in page head", async ({ page }) => {
    await page.goto("/");
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toBeAttached();
  });

  test("regression — pages still load normally", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /techbuddy/i })).toBeVisible();
  });
});
