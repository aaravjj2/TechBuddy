import { expect, test } from "@playwright/test";

test.describe("ReadAloud expansion to practice debrief (v13)", () => {
  test("debrief view shows Read this to me button", async ({ page }) => {
    await page.route("**/api/practice", async (route) => {
      const body = route.request().postDataJSON();
      if (body?.phase === "roleplay" && body?.messages?.length === 0) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            reply: "Hello, I'm calling about your account...",
            phase: "roleplay",
          }),
        });
      } else {
        const lastMsg = body?.messages?.[body.messages.length - 1];
        if (lastMsg?.content === "STOP PRACTICE") {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              reply: "Great job! You handled that well.",
              phase: "debrief",
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              reply: "Tell me more...",
              phase: "roleplay",
            }),
          });
        }
      }
    });

    await page.goto("/practice/fake-tech-support");

    await page.getByRole("button", { name: /start practice/i }).click();
    await expect(page.getByText("Roleplay in progress")).toBeVisible();

    await page.getByRole("button", { name: /end practice/i }).click();

    await expect(page.getByText("Debrief")).toBeVisible();
    await expect(page.getByRole("button", { name: /read this to me/i })).toBeVisible();
  });

  test("debrief navigation links are still present", async ({ page }) => {
    await page.route("**/api/practice", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          reply: "You did great!",
          phase: "debrief",
        }),
      });
    });

    await page.goto("/practice/fake-tech-support");
    await page.getByRole("button", { name: /start practice/i }).click();
    await expect(page.getByText("Debrief")).toBeVisible();

    await expect(page.getByRole("link", { name: /try another scenario/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
  });

  test("mobile viewport — ReadAloud button visible at 375px", async ({ page }) => {
    await page.route("**/api/practice", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          reply: "Nice work completing this scenario.",
          phase: "debrief",
        }),
      });
    });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/practice/fake-tech-support");
    await page.getByRole("button", { name: /start practice/i }).click();
    await expect(page.getByText("Debrief")).toBeVisible();
    await expect(page.getByRole("button", { name: /read this to me/i })).toBeVisible();
  });

  test("regression — scam checker still has check button", async ({ page }) => {
    await page.goto("/scam-checker");
    await expect(page.getByRole("textbox")).toBeVisible();
    await expect(page.getByRole("button", { name: /check this message/i })).toBeVisible();
  });
});
