import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  fullyParallel: true,
  // One `next start` serves every test; more workers than this starves it on a laptop.
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  // Run `npm run build` first; this serves the production build.
  webServer: process.env.BASE_URL
    ? undefined
    : { command: `npm run start -- -p ${PORT}`, url: `${BASE_URL}/en`, reuseExistingServer: true, timeout: 120_000 },
});
