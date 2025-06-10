/**
 * Priority levels for tasks
 */
export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium", 
  HIGH = "high"
}

/**
 * Task status for filtering
 */
export enum TaskStatus {
  ALL = "all",
  COMPLETED = "completed",
  PENDING = "pending"
}

/**
 * Represents a task object with all necessary properties for task management
 */
export interface Task {
  /**
   * Unique identifier for the task
   * @format UUID v4 format (e.g., "123e4567-e89b-12d3-a456-426614174000")
   * @validation Must be a valid UUID string
   */
  id: string;

  /**
   * The title/name of the task
   * @minLength 1
   * @maxLength 100
   * @validation Required field, cannot be empty, maximum 100 characters
   */
  title: string;

  /**
   * Detailed description of the task
   * @maxLength 500
   * @validation Optional field, maximum 500 characters when provided
   */
  description?: string;

  /**
   * Indicates whether the task has been completed
   * @default false
   * @validation Boolean value, defaults to false for new tasks
   */
  completed: boolean;

  /**
   * Priority level of the task
   * @validation Must be one of: "low", "medium", "high"
   */
  priority: TaskPriority;

  /**
   * Timestamp when the task was created
   * @validation Must be a valid Date object, automatically set on creation
   */
  createdAt: Date;

  /**
   * Timestamp when the task was last updated
   * @validation Must be a valid Date object, automatically updated on any modification
   */
  updatedAt: Date;

  /**
   * Category or classification for the task
   * @validation Optional string field for organizing tasks
   */
  category?: string;
}

/**
 * Type for creating a new task (excludes auto-generated fields)
 */
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & {
  /**
   * Optional completed status for new tasks
   * @default false
   */
  completed?: boolean;
};

/**
 * Type for updating an existing task (all fields optional except id)
 */
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt'>> & {
  /**
   * Required task ID for updates
   */
  id: string;
  
  /**
   * Automatically updated timestamp
   */
  updatedAt: Date;
};

/**
 * Filter options for task list
 */
export interface TaskFilter {
  status: TaskStatus;
  priority?: TaskPriority;
  category?: string;
} 