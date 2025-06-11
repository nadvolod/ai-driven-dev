import { Locator, Page, expect } from '@playwright/test';

/**
 * Browser Test Helpers for Task Management Application
 * 
 * This module provides utilities for:
 * - Common UI interactions
 * - Page object pattern helpers
 * - Form handling utilities
 * - Navigation helpers
 * - Wait and assertion utilities
 */

/**
 * Base Page Object Class
 * Provides common functionality for all page objects
 */
export class BasePage {
  constructor(protected page: Page) {}

  // Navigation helpers
  async goto(path: string = '') {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  // Generic element interaction helpers
  async clickElement(selector: string) {
    await this.page.click(selector);
  }

  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async selectOption(selector: string, value: string) {
    await this.page.selectOption(selector, value);
  }

  // Wait for elements
  async waitForElement(selector: string, options: { timeout?: number } = {}) {
    return await this.page.waitForSelector(selector, options);
  }

  async waitForElementToDisappear(selector: string, options: { timeout?: number } = {}) {
    await this.page.waitForSelector(selector, { state: 'hidden', ...options });
  }

  // Screenshot helpers
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }

  // Scroll helpers
  async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }
}

/**
 * Task Management App Page Objects
 */

export class HomePage extends BasePage {
  // Locators
  get addTaskButton() { return this.page.locator('[data-testid="add-task-button"]'); }
  get taskList() { return this.page.locator('[data-testid="task-list"]'); }
  get searchInput() { return this.page.locator('[data-testid="search-input"]'); }
  get filterDropdown() { return this.page.locator('[data-testid="filter-dropdown"]'); }
  get emptyState() { return this.page.locator('[data-testid="empty-state"]'); }

  // Actions
  async addNewTask(taskData: { title: string; description?: string; priority?: string; category?: string; dueDate?: string }) {
    await this.addTaskButton.click();
    await this.fillTaskForm(taskData);
    await this.page.locator('[data-testid="submit-task"]').click();
  }

  async searchTasks(query: string) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  async filterTasks(filter: string) {
    await this.filterDropdown.selectOption(filter);
  }

  async getTaskCount(): Promise<number> {
    const tasks = await this.page.locator('[data-testid="task-item"]').count();
    return tasks;
  }

  async getTaskByTitle(title: string): Promise<Locator> {
    return this.page.locator(`[data-testid="task-item"]:has-text("${title}")`);
  }

  // Private helpers
  private async fillTaskForm(taskData: { title: string; description?: string; priority?: string; category?: string; dueDate?: string }) {
    await this.page.locator('[data-testid="task-title-input"]').fill(taskData.title);
    
    if (taskData.description) {
      await this.page.locator('[data-testid="task-description-input"]').fill(taskData.description);
    }
    
    if (taskData.priority) {
      await this.page.locator('[data-testid="task-priority-select"]').selectOption(taskData.priority);
    }
    
    if (taskData.category) {
      await this.page.locator('[data-testid="task-category-input"]').fill(taskData.category);
    }
    
    if (taskData.dueDate) {
      await this.page.locator('[data-testid="task-due-date-input"]').fill(taskData.dueDate);
    }
  }
}

export class TaskListPage extends BasePage {
  // Locators
  get taskItems() { return this.page.locator('[data-testid="task-item"]'); }
  get loadingSpinner() { return this.page.locator('[data-testid="loading-spinner"]'); }
  get errorMessage() { return this.page.locator('[data-testid="error-message"]'); }

  // Actions
  async toggleTaskCompletion(taskTitle: string) {
    const task = await this.getTaskByTitle(taskTitle);
    const checkbox = task.locator('[data-testid="task-checkbox"]');
    await checkbox.click();
  }

  async deleteTask(taskTitle: string) {
    const task = await this.getTaskByTitle(taskTitle);
    const deleteButton = task.locator('[data-testid="delete-task-button"]');
    await deleteButton.click();
    
    // Handle confirmation dialog
    await this.page.locator('[data-testid="confirm-delete"]').click();
  }

  async editTask(taskTitle: string, newData: { title?: string; description?: string }) {
    const task = await this.getTaskByTitle(taskTitle);
    const editButton = task.locator('[data-testid="edit-task-button"]');
    await editButton.click();
    
    if (newData.title) {
      await this.page.locator('[data-testid="edit-title-input"]').fill(newData.title);
    }
    
    if (newData.description) {
      await this.page.locator('[data-testid="edit-description-input"]').fill(newData.description);
    }
    
    await this.page.locator('[data-testid="save-edit"]').click();
  }

  async getTaskByTitle(taskTitle: string): Promise<Locator> {
    return this.page.locator(`[data-testid="task-item"]:has-text("${taskTitle}")`);
  }

  async waitForTasksToLoad() {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async getVisibleTaskTitles(): Promise<string[]> {
    const taskTitles = await this.taskItems.locator('[data-testid="task-title"]').allTextContents();
    return taskTitles;
  }
}

export class ErrorHandlingDemoPage extends BasePage {
  // Locators for UX demo components
  get toastContainer() { return this.page.locator('[data-testid="toast-container"]'); }
  get confirmationDialog() { return this.page.locator('[data-testid="confirmation-dialog"]'); }
  get loadingDemo() { return this.page.locator('[data-testid="loading-demo"]'); }
  get formDemo() { return this.page.locator('[data-testid="form-demo"]'); }

  // Toast notification actions
  async triggerSuccessToast() {
    await this.page.locator('button:has-text("Success Toast")').click();
  }

  async triggerErrorToast() {
    await this.page.locator('button:has-text("Error Toast")').click();
  }

  async triggerWarningToast() {
    await this.page.locator('button:has-text("Warning Toast")').click();
  }

  async triggerInfoToast() {
    await this.page.locator('button:has-text("Info Toast")').click();
  }

  async getLatestToast(): Promise<Locator> {
    return this.toastContainer.locator('.toast').last();
  }

  async waitForToastToAppear() {
    await this.toastContainer.locator('.toast').first().waitFor({ state: 'visible' });
  }

  async dismissToast() {
    await this.toastContainer.locator('.toast .dismiss-button').first().click();
  }

  // Confirmation dialog actions
  async triggerDangerDialog() {
    await this.page.locator('button:has-text("Danger Dialog")').click();
  }

  async confirmDialog() {
    await this.confirmationDialog.locator('[data-testid="confirm-button"]').click();
  }

  async cancelDialog() {
    await this.confirmationDialog.locator('[data-testid="cancel-button"]').click();
  }

  async waitForDialogToAppear() {
    await this.confirmationDialog.waitFor({ state: 'visible' });
  }

  // Loading state actions
  async triggerLoadingDemo() {
    await this.page.locator('button:has-text("Start Loading Demo")').click();
  }

  async waitForLoadingToComplete() {
    await this.loadingDemo.locator('[data-testid="loading-spinner"]').waitFor({ state: 'hidden', timeout: 15000 });
  }

  // Form validation actions
  async submitFormWithData(data: { email: string; message: string; priority: string }) {
    await this.formDemo.locator('[data-testid="email-input"]').fill(data.email);
    await this.formDemo.locator('[data-testid="message-input"]').fill(data.message);
    await this.formDemo.locator('[data-testid="priority-select"]').selectOption(data.priority);
    await this.formDemo.locator('[data-testid="submit-form"]').click();
  }

  async getFormValidationErrors(): Promise<string[]> {
    const errors = await this.formDemo.locator('[data-testid="validation-error"]').allTextContents();
    return errors;
  }
}

/**
 * Utility Classes for Common Testing Patterns
 */

export class FormHelper {
  constructor(private page: Page) {}

  async fillForm(formSelector: string, data: Record<string, string>) {
    const form = this.page.locator(formSelector);
    
    for (const [field, value] of Object.entries(data)) {
      const input = form.locator(`[name="${field}"], [data-testid="${field}"], [id="${field}"]`);
      
      const inputType = await input.getAttribute('type');
      
      if (inputType === 'checkbox' || inputType === 'radio') {
        if (value === 'true') {
          await input.check();
        }
      } else if (await input.evaluate(el => el.tagName.toLowerCase()) === 'select') {
        await input.selectOption(value);
      } else {
        await input.fill(value);
      }
    }
  }

  async getFormData(formSelector: string): Promise<Record<string, string>> {
    const form = this.page.locator(formSelector);
    const inputs = await form.locator('input, select, textarea').all();
    const formData: Record<string, string> = {};
    
    for (const input of inputs) {
      const name = await input.getAttribute('name') || await input.getAttribute('data-testid') || await input.getAttribute('id');
      if (name) {
        const value = await input.inputValue();
        formData[name] = value;
      }
    }
    
    return formData;
  }

  async validateFormErrors(formSelector: string, expectedErrors: string[]) {
    const form = this.page.locator(formSelector);
    const errorElements = await form.locator('[data-testid*="error"], .error, .invalid').allTextContents();
    
    for (const expectedError of expectedErrors) {
      expect(errorElements.some(error => error.includes(expectedError))).toBeTruthy();
    }
  }
}

export class WaitHelper {
  constructor(private page: Page) {}

  async waitForApiResponse(urlPattern: string | RegExp, timeout: number = 10000) {
    return await this.page.waitForResponse(urlPattern, { timeout });
  }

  async waitForNetworkIdle(timeout: number = 5000) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async waitForCondition(condition: () => Promise<boolean>, timeout: number = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await this.page.waitForTimeout(100);
    }
    
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  async retryAction(action: () => Promise<void>, maxRetries: number = 3, delay: number = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await action();
        return;
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        await this.page.waitForTimeout(delay);
      }
    }
  }
}

export class AssertionHelper {
  constructor(private page: Page) {}

  async assertElementExists(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async assertElementNotExists(selector: string) {
    await expect(this.page.locator(selector)).not.toBeVisible();
  }

  async assertElementText(selector: string, expectedText: string) {
    await expect(this.page.locator(selector)).toHaveText(expectedText);
  }

  async assertElementCount(selector: string, expectedCount: number) {
    await expect(this.page.locator(selector)).toHaveCount(expectedCount);
  }

  async assertPageTitle(expectedTitle: string) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async assertPageUrl(expectedUrl: string | RegExp) {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  async assertElementAttribute(selector: string, attribute: string, expectedValue: string) {
    await expect(this.page.locator(selector)).toHaveAttribute(attribute, expectedValue);
  }
}

/**
 * Factory functions for creating page objects and helpers
 */
export function createPageObjects(page: Page) {
  return {
    homePage: new HomePage(page),
    taskListPage: new TaskListPage(page),
    errorHandlingDemoPage: new ErrorHandlingDemoPage(page),
  };
}

export function createTestHelpers(page: Page) {
  return {
    formHelper: new FormHelper(page),
    waitHelper: new WaitHelper(page),
    assertionHelper: new AssertionHelper(page),
  };
} 