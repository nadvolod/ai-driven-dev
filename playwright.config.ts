import { defineConfig, devices } from '@playwright/test';

/**
 * Simplified Playwright Configuration for Next.js 15 TypeScript Project
 * 
 * This configuration supports:
 * - API testing against local development server
 * - Browser testing with Chromium only
 * - Mobile testing (Chrome and Safari)
 * - TypeScript support
 */

// Read environment variables
const PORT = process.env.TEST_PORT || process.env.PORT || '3000';
const BASE_URL = process.env.TEST_BASE_URL || `http://localhost:${PORT}`;
const CI = !!process.env.CI;

export default defineConfig({
  // Test directory structure
  testDir: './tests',
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.ts'
  ],

  // Global test timeout
  timeout: 30000,

  // Expect timeout for assertions
  expect: {
    timeout: 10000,
  },

  // Fail the build on CI if test files are committed without tests
  forbidOnly: CI,

  // Retry on CI only
  retries: CI ? 2 : 0,

  // Opt out of parallel tests on CI
  ...(CI ? { workers: 1 } : {}),

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['line'],
    ...(CI ? [['github'] as const] : [])
  ],

  // Global setup and teardown
  globalSetup: require.resolve('./tests/setup/global-setup.ts'),
  globalTeardown: require.resolve('./tests/setup/global-teardown.ts'),

  // Shared test configuration
  use: {
    // Base URL for all tests
    baseURL: BASE_URL,

    // Browser context options
    locale: 'en-US',
    timezoneId: 'America/New_York',

    // Screenshots and videos
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // API testing defaults
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },

    // Ignore HTTPS errors in development
    ignoreHTTPSErrors: true,
  },

  // Test projects for different scenarios
  projects: [
    // API Testing Project
    {
      name: 'api',
      testDir: './tests/api',
      testMatch: '**/*.{test,spec}.{ts,js}',
      use: {
        // API tests don't need a browser
        ...devices['Desktop Chrome'],
        baseURL: BASE_URL,
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Playwright-API-Tests',
        },
      },
    },

    // Browser Testing - Chromium only
    {
      name: 'chromium',
      testDir: './tests/e2e',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: ['--disable-web-security'],
        },
      },
    },

    // Mobile testing
    {
      name: 'mobile-chrome',
      testDir: './tests/e2e',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'mobile-safari',
      testDir: './tests/e2e',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Local development server
  webServer: {
    command: 'npm run dev',
    port: parseInt(PORT),
    reuseExistingServer: !CI,
    timeout: 120000,
    env: {
      NODE_ENV: 'test',
    },
  },

  // Output directories
  outputDir: 'test-results/',
  
  // Global test configuration
  fullyParallel: true,
  
  // Maximum failures before stopping
  ...(CI ? { maxFailures: 5 } : {}),
}); 