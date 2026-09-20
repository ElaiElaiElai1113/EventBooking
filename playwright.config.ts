import { defineConfig, devices } from "@playwright/test";
const hostedURL = process.env.DEMO_BASE_URL;
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: hostedURL ?? "http://127.0.0.1:3100",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 5"] } },
    ...(process.env.DEMO_WEBKIT === "1"
      ? [{ name: "iphone-webkit", use: { ...devices["iPhone 13"] } }]
      : []),
  ],
  webServer: hostedURL
    ? undefined
    : {
        command:
          "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100",
        url: "http://127.0.0.1:3100",
        reuseExistingServer: process.env.DEMO_DEV_CHECK === "1",
        timeout: 120000,
      },
});
