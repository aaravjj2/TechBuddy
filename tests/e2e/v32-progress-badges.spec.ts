import { expect, test } from "@playwright/test";

test.describe("Progress & badges", () => {
  test("progress page loads and shows badge system", async ({ page }) => {
    await page.goto("/progress");

    // Page heading
    await expect(
      page.getByRole("heading", { name: "My Progress" })
    ).toBeVisible();

    // Progress bar exists
    await expect(page.getByRole("progressbar")).toBeVisible();

    // Shows earned and locked badges sections
    await expect(
      page.getByText("Badges to Earn")
    ).toBeVisible();

    // Badge count is shown
    await expect(page.getByText(/of \d+ badges earned/)).toBeVisible();
  });

  test("home page shows badge summary when badges exist", async ({ page }) => {
    // Award a badge manually via localStorage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "techbuddy-progress",
        JSON.stringify({
          completedTutorials: ["video-call"],
          completedScenarios: [],
          readTips: [],
          badges: ["first-tutorial"],
          streakDays: 1,
          lastVisitDate: new Date().toISOString().slice(0, 10),
        })
      );
    });
    await page.reload();

    // Badge summary should appear
    await expect(page.getByText("Your achievements")).toBeVisible();
    await expect(page.getByText("1 of")).toBeVisible();
  });

  test("progress page link works from header", async ({ page }) => {
    await page.goto("/");
    const progressLink = page.getByRole("link", { name: "My progress" });
    await expect(progressLink).toBeVisible();
    await progressLink.click();
    await expect(page).toHaveURL(/\/progress/);
  });
});
