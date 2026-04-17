import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const INSTRUCTOR_EMAIL = "instructor@test.com";
const INSTRUCTOR_PASSWORD = "TestPass123";

async function signInAsInstructor(page: Page) {
  await page.goto("/sign-in");
  await page.locator("#email").fill(INSTRUCTOR_EMAIL);
  await page.locator("#password").fill(INSTRUCTOR_PASSWORD);
  await Promise.all([
    page.waitForURL(/\/instructor\/dashboard/, { timeout: 15000 }),
    page.getByRole("button", { name: /^Sign in$/i }).click(),
  ]);
}

test.describe("Instructor authentication & dashboard", () => {
  test("unauthenticated /instructor/dashboard redirects to /sign-in", async ({
    page,
  }) => {
    await page.goto("/instructor/dashboard");
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 15000 });
    expect(page.url()).toContain("callbackUrl");
  });

  test("sign-in then dashboard shows KPIs", async ({ page }) => {
    await signInAsInstructor(page);

    await expect(
      page.getByRole("heading", { level: 1 })
    ).toContainText(/Dashboard/i);

    // At least 4 digit-containing KPI-like cells. KPI cards live inside
    // the KPI section — use a broad selector and check count.
    const numericNodes = page.locator(
      "section div p.text-senior-2xl, section p.text-senior-2xl, .text-senior-2xl"
    );
    await expect(numericNodes.first()).toBeVisible();
    expect(await numericNodes.count()).toBeGreaterThanOrEqual(4);
  });

  test("instructor can visit learners / impact / center", async ({ page }) => {
    await signInAsInstructor(page);

    // Learners
    await page.goto("/instructor/learners");
    const table = page.locator("table").first();
    await expect(table).toBeVisible();
    // header row + at least one data row
    await expect(table.locator("tr")).not.toHaveCount(0);
    const rowCount = await table.locator("tbody tr").count();
    expect(rowCount).toBeGreaterThanOrEqual(1);

    // Impact
    await page.goto("/instructor/impact");
    await expect(
      page.getByRole("heading", { level: 1, name: /Impact/i })
    ).toBeVisible();
    await expect(page.locator("#impact-month")).toBeVisible();

    // Center — seeded center name is "Maplewood Senior Center"
    await page.goto("/instructor/center");
    await expect(
      page.getByText(/Maplewood Senior Center/i).first()
    ).toBeVisible();
  });

  test("instructor dashboard passes axe (wcag2a/aa critical+serious)", async ({
    page,
  }) => {
    await signInAsInstructor(page);
    await page.goto("/instructor/dashboard");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );
    for (const v of results.violations) {
      if (v.impact !== "critical" && v.impact !== "serious") {
        console.warn(
          `[axe ${v.impact ?? "minor"}] ${v.id}: ${v.help} (${v.nodes.length} node${
            v.nodes.length === 1 ? "" : "s"
          })`
        );
      }
    }
    expect(
      critical,
      `axe critical/serious on /instructor/dashboard: ${critical
        .map((v) => v.id)
        .join(", ")}`
    ).toEqual([]);
  });

  test("sign-out returns instructor to /sign-in", async ({ page }) => {
    await signInAsInstructor(page);
    await page.goto("/instructor/dashboard");

    await Promise.all([
      page.waitForURL(/\/sign-in/, { timeout: 15000 }),
      page.getByRole("button", { name: /^Sign out$/i }).click(),
    ]);

    // Visiting the dashboard again should also redirect back to /sign-in
    await page.goto("/instructor/dashboard");
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 15000 });
  });
});
