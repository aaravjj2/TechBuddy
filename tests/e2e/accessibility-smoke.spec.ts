import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/scam-checker", "/phone-help", "/what-is-ai", "/practice", "/quick-tips", "/emergency", "/progress"];

test.describe("Accessibility smoke checks", () => {
  for (const route of ROUTES) {
    test(`axe scan on ${route}`, async ({ page }) => {
      await page.goto(route);

      const results = await new AxeBuilder({ page })
        .exclude('[aria-label="Quick navigation"]')
        .analyze();

      expect(results.violations, `${route} has axe violations`).toEqual([]);
    });
  }
});
