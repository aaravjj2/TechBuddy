import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: "http://localhost:3015",
    trace: "on-first-retry",
  },
  projects: process.env.MULTI_DEVICE === "true"
    ? [
        {
          name: "desktop-chromium",
          use: { ...devices["Desktop Chrome"] },
        },
        {
          name: "tablet-chromium",
          use: { ...devices["iPad Pro 11"], browserName: "chromium" },
        },
        {
          name: "mobile-chromium",
          use: { ...devices["Pixel 7"], browserName: "chromium" },
        },
      ]
    : [
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
      ],
  webServer: {
    command: "npm run dev -- -p 3015",
    url: "http://localhost:3015",
    reuseExistingServer: true,
    timeout: 30000,
  },
});
