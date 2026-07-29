import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:8080";
const IS_CI = !!process.env.CI;

/**
 * Estratégia de artefatos:
 * - trace: retain-on-failure → timeline completa (DOM, network, console) só em falhas.
 * - screenshot: only-on-failure + fullPage → captura o estado final do erro.
 * - video: retain-on-failure → grava tudo mas descarta em sucesso (barato em disco).
 * - reporter HTML embute screenshots/vídeos/traces por teste; JSON/JUnit alimentam CI.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "playwright-report/results.json" }],
    ["junit", { outputFile: "playwright-report/junit.xml" }],
    ...(IS_CI ? [["github"] as const] : []),
  ],
  outputDir: "test-results",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: { mode: "only-on-failure", fullPage: true },
    video: { mode: "retain-on-failure", size: { width: 1280, height: 720 } },
    viewport: { width: 1280, height: 1800 },
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : undefined,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
