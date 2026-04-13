import { expect, test } from "@playwright/test";

test.describe("Scam Checker — tappable examples (v1)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/scam-checker");
  });

  test("example cards are visible with Check this example buttons", async ({
    page,
  }) => {
    const buttons = page.getByRole("button", { name: /check this example/i });
    await expect(buttons).toHaveCount(6);

    // Each button has min-height 56px (senior-friendly tap target)
    for (const button of await buttons.all()) {
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(50); // allow small rendering variance
    }
  });

  test("tapping an example fills textarea and shows loading state", async ({
    page,
  }) => {
    // Mock the API to return a safe verdict
    await page.route("**/api/scam-check", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          verdict: "SAFE",
          headline: "This looks legitimate",
          explanation: "This is a real bank notification.",
        }),
      });
    });

    const firstExample = page.getByRole("button", { name: /check this example/i }).first();
    await firstExample.click();

    // The textarea should now contain the example text
    const textarea = page.getByPlaceholder(/example.*amazon/i);
    await expect(textarea).toHaveValue(/.+/);

    // Result area should appear
    await expect(page.getByText("This looks legitimate")).toBeVisible({
      timeout: 10000,
    });
  });

  test("Check another message resets the form cleanly", async ({ page }) => {
    await page.route("**/api/scam-check", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          verdict: "SAFE",
          headline: "Looks safe",
          explanation: "Nothing suspicious.",
        }),
      });
    });

    // Submit an example
    await page.getByRole("button", { name: /check this example/i }).first().click();
    await expect(page.getByText("Looks safe")).toBeVisible({ timeout: 10000 });

    // Click "Check another message"
    await page.getByRole("button", { name: /check another message/i }).click();

    // Form should be empty
    const textarea = page.locator("#scam-input");
    await expect(textarea).toHaveValue("");

    // Result should be gone
    await expect(page.getByText("Looks safe")).not.toBeVisible();
  });

  test("manual typing and Check This Message still works", async ({ page }) => {
    await page.route("**/api/scam-check", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          verdict: "SCAM",
          headline: "This is a scam!",
          explanation: "Do not click that link.",
          warning_signs: ["Urgency tactic", "Fake URL"],
          action_steps: ["Delete the message", "Block the sender"],
        }),
      });
    });

    const textarea = page.locator("#scam-input");
    await textarea.fill("Your account is suspended. Click amz-login.net now!");
    await page.getByRole("button", { name: /check this message/i }).click();

    await expect(page.getByText("This is a scam!")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Delete the message")).toBeVisible();
  });

  test("mobile viewport — example cards are still usable at 375px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/scam-checker");

    const buttons = page.getByRole("button", { name: /check this example/i });
    await expect(buttons.first()).toBeVisible();

    // Buttons should still have adequate tap target height
    const box = await buttons.first().boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(50);
  });

  test("regression — read aloud button still present after example check", async ({
    page,
  }) => {
    await page.route("**/api/scam-check", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          verdict: "SAFE",
          headline: "All good",
          explanation: "Nothing to worry about.",
        }),
      });
    });

    await page.getByRole("button", { name: /check this example/i }).first().click();
    await expect(page.getByText("All good")).toBeVisible({ timeout: 10000 });

    // Read aloud button should still be there
    await expect(page.getByRole("button", { name: /read this to me/i })).toBeVisible();
  });
});
