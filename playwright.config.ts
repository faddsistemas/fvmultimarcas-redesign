import { defineConfig, devices } from "@playwright/test";

const basePath = process.env.SMOKE_BASE_PATH || "/fvmultimarcas-redesign";
const port = process.env.SMOKE_PORT || "4320";
const baseURL = `http://127.0.0.1:${port}${basePath}/`;

export default defineConfig({
  testDir: "./tests/smoke",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: {
    command: "node scripts/serve-export.mjs",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      SMOKE_PORT: port,
      SMOKE_BASE_PATH: basePath,
    },
  },
});
