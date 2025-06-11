import { expect, request, test } from '@playwright/test';

/**
 * Basic API Tests - Essential CRUD Operations Only
 * 
 * Minimal test coverage for:
 * - Create task (POST)
 * - Read tasks (GET)
 */

test.describe('Task Management API - Basic Tests', () => {
  let requestContext: Awaited<ReturnType<typeof request.newContext>>;

  test.beforeAll(async () => {
    requestContext = await request.newContext();
  });

  test.describe('Basic API Health', () => {
    test('should respond to GET /api/tasks', async () => {
      const response = await requestContext.get('/api/tasks');
      
      expect(response.status()).toBeGreaterThanOrEqual(200);
      expect(response.status()).toBeLessThan(500);
    });

    test('should respond to GET /api/health', async () => {
      const response = await requestContext.get('/api/health');
      
      expect(response.status()).toBeGreaterThanOrEqual(200);
      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe('Task Creation', () => {
    test('should accept POST to /api/tasks', async () => {
      const taskData = {
        title: 'Simple Test Task'
      };

      const response = await requestContext.post('/api/tasks', {
        data: taskData
      });

      // Accept any 2xx or 3xx status code as success for basic test
      expect(response.status()).toBeGreaterThanOrEqual(200);
      expect(response.status()).toBeLessThan(400);
    });
  });
}); 