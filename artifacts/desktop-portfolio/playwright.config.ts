import { defineConfig, devices } from '@playwright/test';

const port = 4173;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `PORT=${port} BASE_PATH=/ pnpm run dev`,
    port,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-storage-recovery',
      testMatch: /desktop-persistence\.spec\.ts/,
      grep: /stays usable when browser storage reads, writes, and removals fail|reflows storage recovery help with enlarged text without clipping controls/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit-storage-recovery',
      testMatch: /desktop-persistence\.spec\.ts/,
      grep: /stays usable when browser storage reads, writes, and removals fail|reflows storage recovery help with enlarged text without clipping controls/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
});