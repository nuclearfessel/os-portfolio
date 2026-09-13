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
      name: 'firefox-blocked-storage',
      testMatch: /desktop-persistence\.spec\.ts/,
      grep: /stays usable when browser storage reads, writes, and removals fail/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit-blocked-storage',
      testMatch: /desktop-persistence\.spec\.ts/,
      grep: /stays usable when browser storage reads, writes, and removals fail/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
});