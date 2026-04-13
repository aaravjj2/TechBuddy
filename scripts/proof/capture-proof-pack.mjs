import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "https://techbuddy-aarav.vercel.app";
const stamp = new Date().toISOString().slice(0, 10);
const packDir = path.resolve("proof-pack", `${stamp}-techbuddy-vercel`);
const shotsDir = path.join(packDir, "screenshots");

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function capture() {
  await ensureDir(shotsDir);

  const browser = await chromium.launch({ headless: true });
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await desktopContext.newPage();

  async function shot(name, fullPage = true) {
    const filePath = path.join(shotsDir, name);
    await page.waitForTimeout(700);
    await page.screenshot({ path: filePath, fullPage });
    console.log(`Saved ${filePath}`);
  }

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await shot("01-home-desktop.png");

  await page
    .getByRole("button", { name: /high contrast|standard contrast/i })
    .click();
  await shot("02-home-high-contrast.png");
  await page
    .getByRole("button", { name: /high contrast|standard contrast/i })
    .click();

  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(700);
  await mobilePage.screenshot({
    path: path.join(shotsDir, "03-home-mobile-nav.png"),
    fullPage: true,
  });
  await mobileContext.close();

  await page.goto(`${baseUrl}/scam-checker`, { waitUntil: "networkidle" });
  await shot("04-scam-checker-empty.png");

  const scamHandler = async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        verdict: "SCAM",
        headline: "This looks like a scam.",
        explanation:
          "The message uses pressure and a suspicious link that does not match the real company website.",
        warning_signs: [
          "Urgent pressure language",
          "Unknown link domain",
          "Requests sensitive information",
        ],
        action_steps: [
          "Do not click the link",
          "Delete the message",
          "Call the company using their official website number",
        ],
        already_clicked:
          "Change your password immediately and contact your bank if you shared payment details.",
      }),
    });
  };

  await page.route("**/api/scam-check", scamHandler);
  await page.locator("#scam-input").fill(
    "Your account is suspended. Click amz-secure-login.net now to avoid charges.",
  );
  await page.getByRole("button", { name: /check this message/i }).click();
  await page.getByRole("button", { name: /check another message/i }).waitFor();
  await shot("05-scam-checker-result.png");
  await page.unroute("**/api/scam-check", scamHandler);

  await page.goto(`${baseUrl}/phone-help`, { waitUntil: "networkidle" });
  await shot("06-phone-help-topics.png");

  await page.goto(`${baseUrl}/phone-help/wifi`, { waitUntil: "networkidle" });
  await shot("07-phone-help-step.png");

  await shot("08-phone-help-print-guide.png", false);

  for (let i = 0; i < 4; i += 1) {
    const doneButton = page.getByRole("button", { name: /done/i });
    if (await doneButton.isVisible().catch(() => false)) {
      await doneButton.click();
      break;
    }
    const nextButton = page.getByRole("button", { name: /next step/i });
    if (await nextButton.isVisible().catch(() => false)) {
      await nextButton.click();
      await page.waitForTimeout(400);
    }
  }
  await page.getByRole("heading", { name: /you did it/i }).waitFor({
    timeout: 10000,
  });
  await shot("09-phone-help-completion.png");

  await page.goto(`${baseUrl}/what-is-ai`, { waitUntil: "networkidle" });
  await shot("10-what-is-ai-starters.png");

  const aiReply =
    "Think of AI like a very fast library helper. It can answer questions and explain things in plain language, but it can still make mistakes. You are always in charge of what you trust and what you do next.";
  const aiSseBody = aiReply
    .split(" ")
    .map((word) => `data: ${JSON.stringify({ text: `${word} ` })}\n\n`)
    .join("");

  const aiHandler = async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: aiSseBody,
    });
  };

  await page.route("**/api/ai-chat", aiHandler);
  await page.locator("#ai-input").fill("What is AI in simple words?");
  await page.getByRole("button", { name: /^send$/i }).click();
  await page
    .locator('[role="article"][aria-label="TechBuddy says"] p')
    .last()
    .waitFor({ timeout: 10000 });
  await shot("11-what-is-ai-response.png");
  await page.unroute("**/api/ai-chat", aiHandler);

  await page.goto(`${baseUrl}/practice`, { waitUntil: "networkidle" });
  await shot("12-practice-scenarios.png");

  const practiceHandler = async (route) => {
    const raw = route.request().postData() || "{}";
    const body = JSON.parse(raw);
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const hasStop = messages.some((m) => m?.content === "STOP PRACTICE");

    if (messages.length === 0) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          reply:
            "Hello, this is Microsoft support. We found a virus and need remote access right now.",
          phase: "roleplay",
        }),
      });
      return;
    }

    if (hasStop) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          reply:
            "Great job practicing! Here's what happened:\n\n✅ What you did well: You stayed calm and did not share private details.\n🔍 Watch out for: Fake urgency and pressure to act immediately.\n💡 The golden rule: Real companies do not ask for remote access out of the blue.",
          phase: "debrief",
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        reply:
          "If you hang up now, your account could be locked. I need your details immediately.",
        phase: "roleplay",
      }),
    });
  };

  await page.route("**/api/practice", practiceHandler);
  await page.goto(`${baseUrl}/practice/fake-tech-support`, {
    waitUntil: "networkidle",
  });
  await page.getByRole("button", { name: /start practice/i }).click();
  await page
    .locator('[role="article"][aria-label="TechBuddy says"]')
    .first()
    .waitFor({ timeout: 10000 });
  await shot("13-practice-roleplay.png");

  await page.getByRole("button", { name: /end practice/i }).click();
  await page.getByRole("heading", { name: /debrief/i }).waitFor();
  await shot("14-practice-debrief.png");
  await page.unroute("**/api/practice", practiceHandler);

  await page.goto(`${baseUrl}/quick-tips`, { waitUntil: "networkidle" });
  await shot("15-quick-tips.png");

  await page.getByRole("button", { name: /increase font size/i }).click();
  await shot("16-quick-tips-large-text.png");

  await page.goto(`${baseUrl}/privacy`, { waitUntil: "networkidle" });
  await shot("17-privacy.png");

  await page.goto(`${baseUrl}/for-centers`, { waitUntil: "networkidle" });
  await shot("18-for-centers.png");

  await desktopContext.close();
  await browser.close();

  console.log(`Proof screenshots complete at ${shotsDir}`);
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
