import { expect, test } from '@playwright/test';

/**
 * Basic Responsive Tests - Essential Viewport Testing Only
 * 
 * Minimal tests for:
 * - Desktop viewport loading
 * - Mobile viewport loading
 */

test.describe('Basic Responsive Design', () => {
  
  test.describe('Desktop Viewport', () => {
    test('should load on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Mobile Viewport', () => {
    test('should load on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      await expect(page.locator('body')).toBeVisible();
    });
  });
}); 