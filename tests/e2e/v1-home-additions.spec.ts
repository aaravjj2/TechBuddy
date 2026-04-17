import { expect, test } from "@playwright/test";

test.describe("Home page footer additions", () => {
  test("artifacts gallery footer link navigates to /artifacts", async ({
    page,
  }) => {
    await page.goto("/");
    const link = page
      .getByRole("link", { name: /Artifacts gallery/i })
      .first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/artifacts$/);
  });

  test("instructor sign-in link navigates to /sign-in", async ({ page }) => {
    await page.goto("/");
    const link = page
      .getByRole("link", { name: /Instructor sign-in/i })
      .first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/sign-in(\?|$)/);
  });

  test("accessibility statement link navigates to /accessibility", async ({
    page,
  }) => {
    await page.goto("/");
    const link = page
      .getByRole("link", { name: /Accessibility statement/i })
      .first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/accessibility$/);

    await expect(
      page.getByRole("heading", { level: 1 })
    ).toContainText(/Accessibility/i);
  });
});
