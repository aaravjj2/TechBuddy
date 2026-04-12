import { expect, test } from "@playwright/test";

test.describe("Chat input keyboard submit (v19)", () => {
  test("practice input submits on Enter key", async ({ page }) => {
    await page.route("**/api/practice", async (route) => {
      const body = route.request().postDataJSON();
      if (body?.messages?.length === 0) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ reply: "Hello there!", phase: "roleplay" }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ reply: "Tell me more.", phase: "roleplay" }),
        });
      }
    });

    await page.goto("/practice/fake-tech-support");
    await page.getByRole("button", { name: /start practice/i }).click();
    await expect(page.getByText("Roleplay in progress")).toBeVisible();

    const textarea = page.getByRole("textbox", { name: /your response/i });
    await textarea.fill("I don't trust this call");
    await textarea.press("Enter");

    // Input should be cleared after submit
    await expect(textarea).toHaveValue("");
  });

  test("practice Shift+Enter does not submit", async ({ page }) => {
    await page.route("**/api/practice", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ reply: "Starting.", phase: "roleplay" }),
      });
    });

    await page.goto("/practice/fake-tech-support");
    await page.getByRole("button", { name: /start practice/i }).click();
    await expect(page.getByText("Roleplay in progress")).toBeVisible();

    const textarea = page.getByRole("textbox", { name: /your response/i });
    await textarea.fill("Hello");
    await textarea.press("Shift+Enter");
    await textarea.type("World");

    const value = await textarea.inputValue();
    expect(value).toContain("Hello");
    expect(value).toContain("World");
  });

  test("mobile viewport — practice Enter works at 375px", async ({ page }) => {
    await page.route("**/api/practice", async (route) => {
      const body = route.request().postDataJSON();
      if (body?.messages?.length === 0) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ reply: "Calling about your PC.", phase: "roleplay" }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ reply: "Interesting response.", phase: "roleplay" }),
        });
      }
    });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/practice/fake-tech-support");
    await page.getByRole("button", { name: /start practice/i }).click();
    await expect(page.getByText("Roleplay in progress")).toBeVisible();

    const textarea = page.getByRole("textbox", { name: /your response/i });
    await textarea.fill("No thanks");
    await textarea.press("Enter");
    await expect(textarea).toHaveValue("");
  });

  test("regression — practice Send button still works", async ({ page }) => {
    await page.route("**/api/practice", async (route) => {
      const body = route.request().postDataJSON();
      if (body?.messages?.length === 0) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ reply: "Hello!", phase: "roleplay" }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ reply: "OK.", phase: "roleplay" }),
        });
      }
    });

    await page.goto("/practice/fake-tech-support");
    await page.getByRole("button", { name: /start practice/i }).click();
    await expect(page.getByText("Roleplay in progress")).toBeVisible();

    const textarea = page.getByRole("textbox", { name: /your response/i });
    await textarea.fill("Test message");
    await page.getByRole("button", { name: /send/i }).click();
    await expect(textarea).toHaveValue("");
  });

  test("regression — AI chat page still renders", async ({ page }) => {
    await page.goto("/what-is-ai");
    await expect(page.getByRole("heading", { name: "What Is AI?" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /ask a question/i })).toBeVisible();
  });
});
