import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:4174",
    headless: true,
  },
  webServer: {
    command: "npm run dev:e2e",
    url: "http://localhost:4174",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

