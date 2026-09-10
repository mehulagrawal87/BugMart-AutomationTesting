import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration for BugMart E2E Test Suite.
 * Configured for simplicity, reliability, and clear interview explanation.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1, // Single worker prevents state collision across tests
  retries: 0,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list']
  ],
  use: {
    // Default to the live deployment, override with local http://localhost:5173 via BASE_URL if needed
    baseURL: process.env.BASE_URL || 'https://bugmart-manualtesting.onrender.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
