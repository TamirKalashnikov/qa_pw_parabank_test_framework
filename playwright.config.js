import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  retries: 1,
  workers: process.env.CI ? 1 : 1,
  reporter: [['allure-playwright'], ['list', { printSteps: false }]],
  use: {
    baseURL: 'https://parabank.parasoft.com/parabank/',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
