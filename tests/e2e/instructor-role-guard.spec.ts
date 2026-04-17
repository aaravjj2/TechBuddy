import { expect, test, type Page } from "@playwright/test";

const SENIOR_EMAIL = "senior1@test.com";
const SENIOR_PASSWORD = "SeniorPass123";

/**
 * A senior successfully authenticates, but the sign-in page (and the
 * /instructor and /admin middleware) explicitly redirect SENIOR users
 * to "/". We therefore expect the final URL after sign-in to be "/".
 */
async function signInAsSenior(page: Page) {
  await page.goto("/sign-in");
  await page.locator("#email").fill(SENIOR_EMAIL);
  await page.locator("#password").fill(SENIOR_PASSWORD);

  await Promise.all([
    page.waitForURL((url) => !/\/sign-in/.test(url.pathname), {
      timeout: 15000,
    }),
    page.getByRole("button", { name: /^Sign in$/i }).click(),
  ]);
}

test.describe("Role guard: SENIOR blocked from staff areas", () => {
  test("SENIOR cannot reach /instructor/dashboard", async ({ page }) => {
    await signInAsSenior(page);

    await page.goto("/instructor/dashboard");
    // Final URL must NOT be /instructor/dashboard.
    const finalUrl = new URL(page.url());
    expect(finalUrl.pathname).not.toBe("/instructor/dashboard");
    // Expected behavior: middleware redirects SENIOR -> "/"
    expect(["/", "/sign-in"]).toContain(finalUrl.pathname);
  });

  test("SENIOR cannot reach /admin/impact", async ({ page }) => {
    await signInAsSenior(page);

    await page.goto("/admin/impact");
    const finalUrl = new URL(page.url());
    expect(finalUrl.pathname).not.toBe("/admin/impact");
    expect(["/", "/sign-in"]).toContain(finalUrl.pathname);
  });
});
