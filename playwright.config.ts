import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
const executablePath =
  process.env.CHROMIUM_PATH ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const production = process.env.TEST_PRODUCTION === "1";
const port = production ? 5174 : 5173;
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 30000,
  expect: { timeout: 6000 },
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    headless: true,
    viewport: { width: 1440, height: 1000 },
    launchOptions: { executablePath, args: ["--no-sandbox"] },
    screenshot: "only-on-failure",
  },
  webServer: {
    command: production ? "npm start" : "npm run dev -- --port 5173",
    env: { PORT: String(port), HOST: "127.0.0.1" },
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !production && !process.env.CI,
  },
});
