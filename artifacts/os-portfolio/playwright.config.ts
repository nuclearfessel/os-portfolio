import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";

const port = Number.parseInt(process.env.PLAYWRIGHT_PORT ?? "4173", 10);
const outputDir = process.env.PLAYWRIGHT_OUTPUT_DIR ?? "test-results";
const reportDir = process.env.PLAYWRIGHT_REPORT_DIR ?? "playwright-report";
const webkitExecutable = fileURLToPath(new URL("./scripts/playwright-webkit.sh", import.meta.url));
const useWebkitCompatLauncher = process.env.PLAYWRIGHT_WEBKIT_COMPAT_LAUNCHER === "1"
  || (process.env.PLAYWRIGHT_WEBKIT_COMPAT_LAUNCHER !== "0" && Boolean(process.env.REPL_ID));

export default defineConfig({
  testDir: "./tests",
  outputDir,
  fullyParallel: false,
  retries: 0,
  reporter: [["html", { outputFolder: reportDir, open: "never" }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `PORT=${port} BASE_PATH=/ pnpm run dev`,
    port,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox-storage-recovery",
      testMatch: /desktop-persistence\.spec\.ts/,
      grep: /stays usable when browser storage reads, writes, and removals fail|reflows storage recovery help with enlarged text without clipping controls/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "firefox-layout",
      testMatch: /firefox-layout\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "firefox-overlap-windows",
      testMatch: /desktop-persistence\.spec\.ts/,
      grep: /keeps stacked windows locally painted while moving and dragging across them/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit-storage-recovery",
      testMatch: /desktop-persistence\.spec\.ts/,
      grep: /stays usable when browser storage reads, writes, and removals fail|reflows storage recovery help with enlarged text without clipping controls/,
      use: {
        ...devices["Desktop Safari"],
        ...(useWebkitCompatLauncher ? {
          launchOptions: { executablePath: webkitExecutable },
        } : {}),
      },
    },
  ],
});
