import { APIRequestContext, expect } from '@playwright/test';

/**
 * API Test Helpers for Task Management Application
 * 
 * This module provides utilities for:
 * - Common REST API operations
 * - Request/response validation
 * - Authentication handling
 * - Error response testing
 * - Data transformation and validation
 */

export interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: Record<string, string>;
  ok: boolean;
}

export interface TaskData {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  category?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * API Helper Class for Task Management Operations
 */
export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  /**
   * Generic HTTP request wrapper with error handling
   */
  async makeRequest<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    options: {
      data?: any;
      headers?: Record<string, string>;
      params?: Record<string, string>;
      expectedStatus?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { data, headers = {}, params, expectedStatus = 200 } = options;

    // Build URL with query parameters
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;

    // Default headers
    const requestHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers,
    };

    // Add auth headers if available
    if (process.env.TEST_API_KEY) {
      (requestHeaders as any)['Authorization'] = `Bearer ${process.env.TEST_API_KEY}`;
    }

    try {
      const response = await this.request.fetch(url, {
        method,
        headers: requestHeaders,
        data: data ? JSON.stringify(data) : undefined,
      });

      const responseData = await this.parseResponse<T>(response);
      
      const result: ApiResponse<T> = {
        status: response.status(),
        data: responseData,
        headers: response.headers(),
        ok: response.ok(),
      };

      // Assert expected status if provided
      if (expectedStatus !== undefined) {
        expect(result.status).toBe(expectedStatus);
      }

      return result;
    } catch (error) {
      console.error(`API request failed: ${method} ${url}`, error);
      throw error;
    }
  }

  /**
   * Parse API response based on content type
   */
  private async parseResponse<T>(response: any): Promise<T> {
    const contentType = response.headers()['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      return await response.json();
    } else if (contentType.includes('text/')) {
      return await response.text() as T;
    } else {
      // For binary or other content types
      return await response.body() as T;
    }
  }

  /**
   * Task-specific API operations
   */
  
  // Get all tasks
  async getTasks(params?: { 
    status?: 'completed' | 'pending';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    category?: string;
    search?: string;
  }): Promise<ApiResponse<TaskData[]>> {
    return this.makeRequest<TaskData[]>('GET', '/api/tasks', params ? { params } : {});
  }

  // Get single task
  async getTask(id: string): Promise<ApiResponse<TaskData>> {
    return this.makeRequest<TaskData>('GET', `/api/tasks/${id}`);
  }

  // Create new task
  async createTask(taskData: Omit<TaskData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<TaskData>> {
    return this.makeRequest<TaskData>('POST', '/api/tasks', { 
      data: taskData,
      expectedStatus: 201 
    });
  }

  // Update existing task
  async updateTask(id: string, updates: Partial<TaskData>): Promise<ApiResponse<TaskData>> {
    return this.makeRequest<TaskData>('PUT', `/api/tasks/${id}`, { data: updates });
  }

  // Partially update task
  async patchTask(id: string, updates: Partial<TaskData>): Promise<ApiResponse<TaskData>> {
    return this.makeRequest<TaskData>('PATCH', `/api/tasks/${id}`, { data: updates });
  }

  // Delete task
  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('DELETE', `/api/tasks/${id}`, { expectedStatus: 204 });
  }

  // Toggle task completion
  async toggleTaskCompletion(id: string): Promise<ApiResponse<TaskData>> {
    return this.makeRequest<TaskData>('PATCH', `/api/tasks/${id}/toggle`);
  }

  /**
   * Validation helpers
   */

  // Validate task structure
  validateTaskStructure(task: any): asserts task is TaskData {
    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('title');
    expect(task).toHaveProperty('completed');
    expect(typeof task.title).toBe('string');
    expect(typeof task.completed).toBe('boolean');
    
    if (task.priority) {
      expect(['LOW', 'MEDIUM', 'HIGH']).toContain(task.priority);
    }
    
    if (task.dueDate) {
      expect(new Date(task.dueDate)).toBeInstanceOf(Date);
    }
  }

  // Validate API error response
  validateErrorResponse(response: ApiResponse, expectedMessage?: string) {
    expect(response.ok).toBe(false);
    expect(response.data).toHaveProperty('message');
    
    if (expectedMessage) {
      expect(response.data.message).toContain(expectedMessage);
    }
  }

  // Assert response time is within acceptable limits
  async assertResponseTime<T>(
    operation: () => Promise<ApiResponse<T>>,
    maxTime: number = 5000
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    const response = await operation();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(maxTime);
    console.log(`✅ API response time: ${duration}ms (limit: ${maxTime}ms)`);
    
    return response;
  }
}

/**
 * Utility functions for test data generation
 */
export class TestDataGenerator {
  
  // Generate random task data
  static generateTaskData(overrides: Partial<TaskData> = {}): Omit<TaskData, 'id' | 'createdAt' | 'updatedAt'> {
    const priorities: ('LOW' | 'MEDIUM' | 'HIGH')[] = ['LOW', 'MEDIUM', 'HIGH'];
    const categories = ['Development', 'Testing', 'Design', 'Documentation', 'Meeting'];
    
    const baseData = {
      title: `Test Task ${Math.random().toString(36).substring(7)}`,
      description: `Auto-generated test task for testing purposes - ${Date.now()}`,
      completed: Math.random() > 0.5,
      priority: priorities[Math.floor(Math.random() * priorities.length)] as 'LOW' | 'MEDIUM' | 'HIGH',
      category: categories[Math.floor(Math.random() * categories.length)],
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    return { ...baseData, ...overrides };
  }

  // Generate multiple tasks
  static generateMultipleTasks(count: number): Omit<TaskData, 'id' | 'createdAt' | 'updatedAt'>[] {
    return Array.from({ length: count }, (_, index) => 
      this.generateTaskData({ title: `Test Task ${index + 1}` })
    );
  }

  // Generate invalid task data for negative testing
  static generateInvalidTaskData(): any {
    const invalidCases = [
      { title: '' }, // Empty title
      { title: null }, // Null title
      { title: 'Valid Title', priority: 'INVALID' }, // Invalid priority
      { title: 'Valid Title', completed: 'not-boolean' }, // Invalid completed type
      { title: 'Valid Title', dueDate: 'invalid-date' }, // Invalid date
    ];
    
    return invalidCases[Math.floor(Math.random() * invalidCases.length)];
  }
}

/**
 * Authentication helpers
 */
export class AuthHelper {
  constructor(private request: APIRequestContext) {}

  // Mock login (adapt to your auth system)
  async login(credentials: { email: string; password: string }): Promise<{ token: string; user: any }> {
    const response = await this.request.post('/api/auth/login', {
      data: credentials,
    });

    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  // Set auth token for subsequent requests
  setAuthToken(token: string) {
    process.env.TEST_API_KEY = token;
  }

  // Clear auth token
  clearAuthToken() {
    delete process.env.TEST_API_KEY;
  }
}

/**
 * Database/Storage helpers for test isolation
 */
export class TestStorageHelper {
  
  // Clear all test data
  static async clearTestData(request: APIRequestContext) {
    // Implementation depends on your backend
    // This could call a test endpoint to reset database
    try {
      await request.delete('/api/test/reset');
    } catch (error) {
      console.warn('Test data cleanup endpoint not available');
    }
  }

  // Seed test data
  static async seedTestData(request: APIRequestContext, tasks: TaskData[]) {
    try {
      await request.post('/api/test/seed', { data: { tasks } });
    } catch (error) {
      console.warn('Test data seeding endpoint not available');
    }
  }
}

/**
 * Export utility function to create API helper instance
 */
export function createApiHelper(request: APIRequestContext): ApiHelper {
  return new ApiHelper(request);
}

export function createAuthHelper(request: APIRequestContext): AuthHelper {
  return new AuthHelper(request);
} 