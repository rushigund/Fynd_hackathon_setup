import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"]
  ],
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } }
  ],
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
