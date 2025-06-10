import { CreateTaskInput, Task, TaskPriority, TaskStatus, UpdateTaskInput } from './task';

/**
 * =============================================================================
 * API REQUEST & RESPONSE INTERFACES
 * =============================================================================
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  /** Indicates if the request was successful */
  success: boolean;
  /** Response data (present on success) */
  data?: T;
  /** Error information (present on failure) */
  error?: ApiError;
  /** Additional metadata */
  meta?: ResponseMeta;
}

/**
 * Pagination and filtering metadata
 */
export interface ResponseMeta {
  /** Total number of items available */
  total: number;
  /** Current page number (1-based) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of pages */
  totalPages: number;
  /** Indicates if there are more pages */
  hasNext: boolean;
  /** Indicates if there are previous pages */
  hasPrev: boolean;
}

/**
 * Error response structure
 */
export interface ApiError {
  /** Error code (machine-readable) */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: Record<string, any>;
  /** Field-specific validation errors */
  validation?: ValidationError[];
}

/**
 * Validation error for specific fields
 */
export interface ValidationError {
  /** Field name that failed validation */
  field: string;
  /** Validation error message */
  message: string;
  /** The invalid value that was provided */
  value?: any;
}

/**
 * =============================================================================
 * GET /api/tasks - RETRIEVE TASKS
 * =============================================================================
 */

/**
 * Query parameters for filtering and pagination
 */
export interface GetTasksQuery {
  /** Filter by completion status */
  status?: TaskStatus;
  /** Filter by priority level */
  priority?: TaskPriority;
  /** Filter by category */
  category?: string;
  /** Search in title and description */
  search?: string;
  /** Sort field */
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'priority';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Page number (1-based) */
  page?: number;
  /** Items per page (1-100) */
  limit?: number;
}

/**
 * Response for GET /api/tasks
 */
export interface GetTasksResponse extends ApiResponse<Task[]> {
  data: Task[];
  meta: ResponseMeta & {
    /** Summary statistics */
    stats: {
      total: number;
      completed: number;
      pending: number;
      byPriority: Record<TaskPriority, number>;
    };
  };
}

/**
 * =============================================================================
 * POST /api/tasks - CREATE TASK
 * =============================================================================
 */

/**
 * Request body for creating a new task
 */
export interface CreateTaskRequest {
  /** Task data */
  task: CreateTaskInput;
}

/**
 * Response for POST /api/tasks
 */
export interface CreateTaskResponse extends ApiResponse<Task> {
  data: Task;
}

/**
 * =============================================================================
 * GET /api/tasks/[id] - GET SINGLE TASK
 * =============================================================================
 */

/**
 * Response for GET /api/tasks/[id]
 */
export interface GetTaskResponse extends ApiResponse<Task> {
  data: Task;
}

/**
 * =============================================================================
 * PUT /api/tasks/[id] - UPDATE TASK
 * =============================================================================
 */

/**
 * Request body for updating a task
 */
export interface UpdateTaskRequest {
  /** Partial task data to update */
  task: Omit<UpdateTaskInput, 'id' | 'updatedAt'>;
}

/**
 * Response for PUT /api/tasks/[id]
 */
export interface UpdateTaskResponse extends ApiResponse<Task> {
  data: Task;
}

/**
 * =============================================================================
 * DELETE /api/tasks/[id] - DELETE TASK
 * =============================================================================
 */

/**
 * Response for DELETE /api/tasks/[id]
 */
export interface DeleteTaskResponse extends ApiResponse<{ id: string }> {
  data: {
    /** ID of the deleted task */
    id: string;
    /** Confirmation message */
    message: string;
  };
}

/**
 * =============================================================================
 * ERROR CODES
 * =============================================================================
 */

export const API_ERROR_CODES = {
  // Validation Errors (400)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_REQUEST_BODY: 'INVALID_REQUEST_BODY',
  INVALID_QUERY_PARAMS: 'INVALID_QUERY_PARAMS',
  
  // Resource Errors (404)
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  
  // Conflict Errors (409)
  DUPLICATE_TASK: 'DUPLICATE_TASK',
  
  // Server Errors (500)
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  
  // Rate Limiting (429)
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];

/**
 * =============================================================================
 * VALIDATION SCHEMAS
 * =============================================================================
 */

/**
 * Request validation rules
 */
export const VALIDATION_RULES = {
  /** Title validation */
  title: {
    required: true,
    minLength: 1,
    maxLength: 100,
    pattern: /^(?!\s*$).+/, // Not just whitespace
  },
  
  /** Description validation */
  description: {
    required: false,
    maxLength: 500,
  },
  
  /** Priority validation */
  priority: {
    required: true,
    enum: [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH],
  },
  
  /** Category validation */
  category: {
    required: false,
    maxLength: 50,
  },
  
  /** Completed validation */
  completed: {
    required: false,
    type: 'boolean' as const,
  },
} as const;

/**
 * Query parameter validation rules
 */
export const QUERY_VALIDATION_RULES = {
  status: {
    required: false,
    enum: [TaskStatus.ALL, TaskStatus.COMPLETED, TaskStatus.PENDING],
  },
  
  priority: {
    required: false,
    enum: [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH],
  },
  
  category: {
    required: false,
    type: 'string' as const,
    maxLength: 50,
  },
  
  search: {
    required: false,
    type: 'string' as const,
    maxLength: 100,
  },
  
  sortBy: {
    required: false,
    enum: ['createdAt', 'updatedAt', 'title', 'priority'] as const,
  },
  
  sortOrder: {
    required: false,
    enum: ['asc', 'desc'] as const,
  },
  
  page: {
    required: false,
    type: 'number' as const,
    min: 1,
    max: 1000,
  },
  
  limit: {
    required: false,
    type: 'number' as const,
    min: 1,
    max: 100,
    default: 20,
  },
} as const;

/**
 * =============================================================================
 * HTTP STATUS CODES
 * =============================================================================
 */

export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  
  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * =============================================================================
 * API ENDPOINT DEFINITIONS
 * =============================================================================
 */

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestBody?: string;
  queryParams?: string[];
  responses: {
    status: number;
    description: string;
    schema: string;
  }[];
}

export const API_ENDPOINTS: Record<string, ApiEndpoint> = {
  GET_TASKS: {
    method: 'GET',
    path: '/api/tasks',
    description: 'Retrieve all tasks with optional filtering and pagination',
    queryParams: ['status', 'priority', 'category', 'search', 'sortBy', 'sortOrder', 'page', 'limit'],
    responses: [
      { status: 200, description: 'Tasks retrieved successfully', schema: 'GetTasksResponse' },
      { status: 400, description: 'Invalid query parameters', schema: 'ApiError' },
      { status: 500, description: 'Internal server error', schema: 'ApiError' },
    ],
  },
  
  CREATE_TASK: {
    method: 'POST',
    path: '/api/tasks',
    description: 'Create a new task',
    requestBody: 'CreateTaskRequest',
    responses: [
      { status: 201, description: 'Task created successfully', schema: 'CreateTaskResponse' },
      { status: 400, description: 'Invalid request body', schema: 'ApiError' },
      { status: 422, description: 'Validation error', schema: 'ApiError' },
      { status: 500, description: 'Internal server error', schema: 'ApiError' },
    ],
  },
  
  GET_TASK: {
    method: 'GET',
    path: '/api/tasks/{id}',
    description: 'Retrieve a specific task by ID',
    responses: [
      { status: 200, description: 'Task retrieved successfully', schema: 'GetTaskResponse' },
      { status: 404, description: 'Task not found', schema: 'ApiError' },
      { status: 500, description: 'Internal server error', schema: 'ApiError' },
    ],
  },
  
  UPDATE_TASK: {
    method: 'PUT',
    path: '/api/tasks/{id}',
    description: 'Update an existing task',
    requestBody: 'UpdateTaskRequest',
    responses: [
      { status: 200, description: 'Task updated successfully', schema: 'UpdateTaskResponse' },
      { status: 400, description: 'Invalid request body', schema: 'ApiError' },
      { status: 404, description: 'Task not found', schema: 'ApiError' },
      { status: 422, description: 'Validation error', schema: 'ApiError' },
      { status: 500, description: 'Internal server error', schema: 'ApiError' },
    ],
  },
  
  DELETE_TASK: {
    method: 'DELETE',
    path: '/api/tasks/{id}',
    description: 'Delete a specific task',
    responses: [
      { status: 200, description: 'Task deleted successfully', schema: 'DeleteTaskResponse' },
      { status: 404, description: 'Task not found', schema: 'ApiError' },
      { status: 500, description: 'Internal server error', schema: 'ApiError' },
    ],
  },
} as const; 