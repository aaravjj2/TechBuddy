import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Utility: wait for the live-region status text to include a substring.
 * The gallery renders "Showing N of M briefs" once loaded.
 */
async function waitForStatus(
  page: import("@playwright/test").Page,
  includes: RegExp | string
) {
  const status = page.getByRole("status").first();
  await expect(status).toContainText(includes, { timeout: 15000 });
  return status;
}

test.describe("Artifacts gallery", () => {
  test("loads, filters, searches, opens dialog, and passes axe", async ({
    page,
  }) => {
    await page.goto("/artifacts");

    await expect(
      page.getByRole("heading", { name: /Artifacts Gallery/i, level: 1 })
    ).toBeVisible();

    // Initial: 360 briefs
    await waitForStatus(page, /of\s+360\s+briefs/i);

    // Year 1 filter — the radio is visually hidden inside a label inside the
    // sidebar. "Year 1" text also appears on every card badge, so scope the
    // click to the filter sidebar explicitly.
    const sidebar = page.getByRole("complementary", { name: /Filter artifacts/i });
    await sidebar.getByText(/^Year 1$/).click();
    await waitForStatus(page, /of\s+120\s+briefs/i);

    // Domain filter — "Accessibility and Inclusion"
    await sidebar
      .locator("label", { hasText: "Accessibility and Inclusion" })
      .first()
      .click();

    const status = page.getByRole("status").first();
    await expect(status).not.toContainText(/of\s+120\s+briefs/i, {
      timeout: 15000,
    });
    // Should still be a valid "of N briefs/brief" text
    await expect(status).toContainText(/of\s+\d+\s+(briefs?|brief)/i);

    // Reset all filters — back to 360
    await page.getByRole("button", { name: /Reset all filters/i }).click();
    await waitForStatus(page, /of\s+360\s+briefs/i);

    // Search field
    await page.locator("#artifact-search").fill("accessibility");
    await waitForStatus(page, /of\s+\d+\s+(briefs?|brief)/i);

    const matchCountText = await status.textContent();
    // Should still have at least 1 result
    const match = matchCountText?.match(/of\s+(\d+)\s+/i);
    const total = match ? Number(match[1]) : 0;
    expect(total).toBeGreaterThanOrEqual(1);

    // Open first artifact card -> Radix dialog appears
    const firstCard = page.locator("ul button").first();
    await firstCard.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading").first()).toBeVisible();

    // Close dialog
    await dialog.getByRole("button", { name: /^Close$/i }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    // View toggles: List -> Grid
    const listToggle = page.getByRole("button", { name: /^List$/, exact: true });
    const gridToggle = page.getByRole("button", { name: /^Grid$/, exact: true });
    await listToggle.click();
    await expect(listToggle).toHaveAttribute("aria-pressed", "true");
    await gridToggle.click();
    await expect(gridToggle).toHaveAttribute("aria-pressed", "true");

    // axe scan — only assert 0 critical/serious violations
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );
    const otherViolations = results.violations.filter(
      (v) => v.impact !== "critical" && v.impact !== "serious"
    );
    for (const v of otherViolations) {
      console.warn(
        `[axe ${v.impact ?? "minor"}] ${v.id}: ${v.help} (${v.nodes.length} node${
          v.nodes.length === 1 ? "" : "s"
        })`
      );
    }
    expect(critical, `axe critical/serious violations: ${critical
      .map((v) => v.id)
      .join(", ")}`).toEqual([]);
  });
});
