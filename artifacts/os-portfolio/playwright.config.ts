import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";

const port = 4173;
const webkitExecutable = fileURLToPath(new URL("./scripts/playwright-webkit.sh", import.meta.url));

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 0,
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],
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
        launchOptions: { executablePath: webkitExecutable },
      },
    },
  ],
});
