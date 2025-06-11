import { chromium, FullConfig } from '@playwright/test';

/**
 * Global Setup for Playwright Tests
 * 
 * This runs once before all test suites and handles:
 * - Database initialization and seeding
 * - Authentication token generation
 * - Environment validation
 * - Service health checks
 */

async function globalSetup(config: FullConfig) {
  console.log('🔧 Starting global test setup...');

  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
  
  try {
    // 1. Wait for the development server to be ready
    await waitForServer(baseURL);
    console.log('✅ Development server is ready');

    // 2. Setup test database/localStorage state
    await setupTestData();
    console.log('✅ Test data initialized');

    // 3. Generate authentication tokens if needed
    await setupAuthentication(baseURL);
    console.log('✅ Authentication setup complete');

    // 4. Clear any existing browser storage
    await clearBrowserStorage();
    console.log('✅ Browser storage cleared');

    console.log('🎉 Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

/**
 * Wait for the development server to be ready
 */
async function waitForServer(baseURL: string): Promise<void> {
  const maxAttempts = 30;
  const delay = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(`${baseURL}/api/health`).catch(() => {
        // If health endpoint doesn't exist, try the main page
        return fetch(baseURL);
      });

      if (response.ok) {
        return;
      }
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(`Server not ready after ${maxAttempts} attempts`);
      }
    }

    console.log(`⏳ Waiting for server (attempt ${attempt}/${maxAttempts})...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

/**
 * Setup test data - initialize database or local storage
 */
async function setupTestData(): Promise<void> {
  // For our task management app, we'll setup initial task data
  const testTasks = [
    {
      id: 'test-task-1',
      title: 'Test Task 1',
      description: 'This is a test task for automated testing',
      completed: false,
      priority: 'HIGH',
      category: 'Testing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'test-task-2',
      title: 'Completed Test Task',
      description: 'This task is marked as completed',
      completed: true,
      priority: 'MEDIUM',
      category: 'Testing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  // Store test data in a way that tests can access it
  process.env.TEST_TASKS = JSON.stringify(testTasks);
}

/**
 * Setup authentication for API tests
 */
async function setupAuthentication(baseURL: string): Promise<void> {
  // Generate test user tokens or API keys if your app requires authentication
  // For now, we'll just prepare test credentials
  
  const testCredentials = {
    apiKey: 'test-api-key-12345',
    userId: 'test-user-1',
    sessionToken: 'test-session-token',
  };

  // Store credentials for test access
  process.env.TEST_API_KEY = testCredentials.apiKey;
  process.env.TEST_USER_ID = testCredentials.userId;
  process.env.TEST_SESSION_TOKEN = testCredentials.sessionToken;
}

/**
 * Clear browser storage to ensure clean test state
 */
async function clearBrowserStorage(): Promise<void> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  try {
    // Clear cookies and permissions
    await context.clearCookies();
    await context.clearPermissions();
    
    const page = await context.newPage();
    
    // Navigate to a valid URL first to access localStorage
    const baseURL = process.env.TEST_BASE_URL || 'http://localhost:3000';
    try {
      await page.goto(baseURL);
      await page.evaluate(() => {
        if (typeof localStorage !== 'undefined') {
          localStorage.clear();
        }
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.clear();
        }
      });
    } catch (error) {
      console.warn('⚠️ Could not clear browser storage:', error);
      // Continue with test setup even if storage clearing fails
    }
  } finally {
    await browser.close();
  }
}

export default globalSetup; 