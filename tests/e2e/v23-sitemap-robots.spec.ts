import { expect, test } from "@playwright/test";

test.describe("robots.txt and sitemap (v23)", () => {
  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.request.get("http://localhost:3015/robots.txt");
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toContain("User-Agent: *");
    expect(text).toContain("Allow: /");
    expect(text).toContain("Sitemap:");
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.request.get("http://localhost:3015/sitemap.xml");
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toContain("scam-checker");
    expect(text).toContain("phone-help");
    expect(text).toContain("what-is-ai");
    expect(text).toContain("practice");
    expect(text).toContain("quick-tips");
  });

  test("sitemap has all 6 pages", async ({ page }) => {
    const response = await page.request.get("http://localhost:3015/sitemap.xml");
    const text = await response.text();
    const urlCount = (text.match(/<url>/g) || []).length;
    expect(urlCount).toBe(6);
  });

  test("regression — pages still load", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /techbuddy/i })).toBeVisible();
  });
});
