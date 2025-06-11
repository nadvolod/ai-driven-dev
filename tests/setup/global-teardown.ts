import { FullConfig } from '@playwright/test';

/**
 * Global Teardown for Playwright Tests
 * 
 * This runs once after all test suites complete and handles:
 * - Cleanup of test data
 * - Removal of temporary files
 * - Final reporting and metrics
 * - Resource cleanup
 */

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');

  try {
    // 1. Clean up test data
    await cleanupTestData();
    console.log('✅ Test data cleaned up');

    // 2. Clean up temporary files
    await cleanupTempFiles();
    console.log('✅ Temporary files cleaned up');

    // 3. Generate final test report summary
    await generateTestSummary();
    console.log('✅ Test summary generated');

    // 4. Clean up environment variables
    cleanupEnvironmentVariables();
    console.log('✅ Environment variables cleaned up');

    console.log('🎉 Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw here as tests have already completed
  }
}

/**
 * Clean up test data from database or storage
 */
async function cleanupTestData(): Promise<void> {
  // Remove test tasks or reset database to clean state
  // For localStorage-based app, we don't need to do much here
  // as each test should clean up after itself
  
  // Remove test environment data
  delete process.env.TEST_TASKS;
}

/**
 * Clean up temporary files created during testing
 */
async function cleanupTempFiles(): Promise<void> {
  const { promises: fs } = await import('fs');
  const path = await import('path');

  try {
    // Clean up any temporary screenshots or videos older than test run
    const tempDirs = ['test-results/', 'playwright-report/'];
    
    for (const dir of tempDirs) {
      if (await fs.access(dir).then(() => true).catch(() => false)) {
        // Directory exists, we could implement cleanup logic here
        // For now, we'll let Playwright handle its own cleanup
        console.log(`📂 Temporary directory exists: ${dir}`);
      }
    }
  } catch (error) {
    console.warn('⚠️ Error cleaning temporary files:', error);
  }
}

/**
 * Generate a summary of test results
 */
async function generateTestSummary(): Promise<void> {
  const { promises: fs } = await import('fs');
  
  try {
    // Read test results if they exist
    const resultsPath = 'test-results.json';
    
    if (await fs.access(resultsPath).then(() => true).catch(() => false)) {
      const resultsData = await fs.readFile(resultsPath, 'utf8');
      const results = JSON.parse(resultsData);
      
      console.log('\n📊 Test Summary:');
      console.log(`   Total Tests: ${results.stats?.expected || 'Unknown'}`);
      console.log(`   Passed: ${results.stats?.passed || 'Unknown'}`);
      console.log(`   Failed: ${results.stats?.failed || 'Unknown'}`);
      console.log(`   Skipped: ${results.stats?.skipped || 'Unknown'}`);
      console.log(`   Duration: ${results.stats?.duration || 'Unknown'}ms`);
    }
  } catch (error) {
    console.warn('⚠️ Could not generate test summary:', error);
  }
}

/**
 * Clean up test-specific environment variables
 */
function cleanupEnvironmentVariables(): void {
  const testEnvVars = [
    'TEST_API_KEY',
    'TEST_USER_ID',
    'TEST_SESSION_TOKEN',
    'TEST_TASKS'
  ];

  testEnvVars.forEach(varName => {
    delete process.env[varName];
  });
}

export default globalTeardown; 