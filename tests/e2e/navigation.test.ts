import { expect, test } from '@playwright/test';

/**
 * Basic Navigation Tests - Essential Page Loading Only
 * 
 * Minimal tests for:
 * - Homepage loading
 * - Basic page accessibility
 */

test.describe('Basic Page Loading', () => {
  
  test.describe('Homepage', () => {
    test('should load homepage without errors', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      // Just verify the page loaded and has basic content
      await expect(page.locator('body')).toBeVisible();
    });

    test('should have a valid page title', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      // Check that the page has some title (not empty)
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });
  });

  test.describe('Error Handling Demo', () => {
    test('should load error handling demo page', async ({ page }) => {
      await page.goto('/demo/error-handling');
      await page.waitForLoadState('domcontentloaded');
      
      // Just verify the page loaded
      await expect(page.locator('body')).toBeVisible();
    });
  });
}); 