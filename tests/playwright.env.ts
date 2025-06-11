/**
 * Test Environment Configuration
 * 
 * This file contains environment configuration for Playwright tests.
 * It provides defaults and helper functions for test setup.
 */

export const TEST_CONFIG = {
  // Server configuration
  PORT: process.env.TEST_PORT || process.env.PORT || '3000',
  BASE_URL: process.env.TEST_BASE_URL || `http://localhost:${process.env.TEST_PORT || process.env.PORT || '3000'}`,
  
  // Test timeouts
  TIMEOUT: 30000,
  API_TIMEOUT: 10000,
  
  // Browser configuration
  HEADLESS: process.env.HEADLESS !== 'false',
  SLOW_MO: parseInt(process.env.SLOW_MO || '0'),
  
  // Test data
  TEST_USER: {
    id: 'test-user-1',
    apiKey: 'test-api-key-12345',
    sessionToken: 'test-session-token',
  },
  
  // Feature flags
  FEATURES: {
    TOAST_NOTIFICATIONS: true,
    CONFIRMATION_DIALOGS: true,
    FORM_VALIDATION: true,
  },
  
  // Performance budgets
  PERFORMANCE: {
    PAGE_LOAD_MS: 5000,
    API_RESPONSE_MS: 3000,
  },
};

/**
 * Helper function to get the current test environment
 */
export function getTestEnvironment() {
  return {
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
    isCI: !!process.env.CI,
    baseUrl: TEST_CONFIG.BASE_URL,
    timeout: TEST_CONFIG.TIMEOUT,
  };
}

/**
 * Helper function to set up test environment variables
 */
export function setupTestEnvironment() {
  // Set test-specific environment variables
  process.env.TEST_API_KEY = TEST_CONFIG.TEST_USER.apiKey;
  process.env.TEST_USER_ID = TEST_CONFIG.TEST_USER.id;
  process.env.TEST_SESSION_TOKEN = TEST_CONFIG.TEST_USER.sessionToken;
}

/**
 * Helper function to clean up test environment
 */
export function cleanupTestEnvironment() {
  const testEnvVars = [
    'TEST_API_KEY',
    'TEST_USER_ID', 
    'TEST_SESSION_TOKEN',
    'TEST_TASKS',
  ];
  
  testEnvVars.forEach(varName => {
    delete process.env[varName];
  });
} 