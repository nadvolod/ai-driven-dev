import { Task, TaskPriority } from '@/types/task';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date for display in the UI
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Format a date for display with full information
 */
export function formatDateFull(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}

/**
 * Generate a random UUID v4
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Sleep function for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Local Storage Keys
 */
const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks',
  PREFERENCES: 'taskflow_preferences'
} as const;

/**
 * User preferences for task management
 */
export interface UserPreferences {
  sortBy: 'priority' | 'dueDate' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
  hideCompleted: boolean;
}

/**
 * Default user preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  sortBy: 'priority',
  sortOrder: 'desc',
  hideCompleted: false
};

/**
 * Safely checks if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads tasks from localStorage with proper error handling
 * @returns Array of tasks or empty array if none found/error occurred
 */
export function loadTasksFromStorage(): Task[] {
  try {
    if (!isLocalStorageAvailable()) return [];
    
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!stored) return [];
    
    const tasks = JSON.parse(stored);
    
    // Convert date strings back to Date objects
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined
    }));
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
}

/**
 * Saves tasks to localStorage with proper error handling
 * @param tasks - Array of tasks to save
 */
export function saveTasksToStorage(tasks: Task[]): void {
  try {
    if (!isLocalStorageAvailable()) return;
    
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
}

/**
 * Loads user preferences from localStorage
 * @returns User preferences or default preferences
 */
export function loadUserPreferences(): UserPreferences {
  try {
    if (!isLocalStorageAvailable()) return DEFAULT_PREFERENCES;
    
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!stored) return DEFAULT_PREFERENCES;
    
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch (error) {
    console.error('Error loading preferences from localStorage:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Saves user preferences to localStorage
 * @param preferences - User preferences to save
 */
export function saveUserPreferences(preferences: UserPreferences): void {
  try {
    if (!isLocalStorageAvailable()) return;
    
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences to localStorage:', error);
  }
}

/**
 * Checks if a task is overdue
 * @param task - Task to check
 * @returns True if task is overdue, false otherwise
 */
export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.completed) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  return dueDate < today;
}

/**
 * Formats a date for HTML date input
 * @param date - Date to format
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

/**
 * Priority order for sorting (High = 0, Medium = 1, Low = 2)
 */
const PRIORITY_ORDER: Record<TaskPriority, number> = {
  [TaskPriority.HIGH]: 0,
  [TaskPriority.MEDIUM]: 1,
  [TaskPriority.LOW]: 2
};

/**
 * Sorts tasks based on the provided criteria
 * @param tasks - Array of tasks to sort
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order (asc/desc)
 * @returns Sorted array of tasks
 */
export function sortTasks(
  tasks: Task[], 
  sortBy: UserPreferences['sortBy'], 
  sortOrder: UserPreferences['sortOrder']
): Task[] {
  const sorted = [...tasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'priority':
        comparison = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = a.dueDate.getTime() - b.dueDate.getTime();
        break;
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
} 