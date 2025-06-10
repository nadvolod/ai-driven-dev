import { generateId } from '@/lib/utils';
import { API_ERROR_CODES, ApiError, CreateTaskResponse, GetTasksResponse, HTTP_STATUS } from '@/types/api';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * In-memory task storage for demo purposes
 * In a real application, this would be replaced with a database
 */
const tasks: Task[] = [
  {
    id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    title: 'Implement user authentication system',
    description: 'Set up OAuth integration with Google and GitHub for secure user login. Include proper error handling and user session management.',
    completed: false,
    priority: TaskPriority.HIGH,
    createdAt: new Date('2025-01-08T10:00:00.000Z'),
    updatedAt: new Date('2025-01-09T14:30:00.000Z'),
    category: 'Development'
  },
  {
    id: '2b3c4d5e-6f78-90ab-cdef-123456789012',
    title: 'Design system documentation',
    description: 'Create comprehensive documentation for our design system including component guidelines, color palettes, and usage examples.',
    completed: true,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date('2025-01-05T09:15:00.000Z'),
    updatedAt: new Date('2025-01-07T16:45:00.000Z'),
    category: 'Design'
  },
  {
    id: '3c4d5e6f-7890-abcd-ef12-34567890abcd',
    title: 'Fix responsive layout issues',
    description: 'Address mobile layout problems on the dashboard and task list pages. Test across different devices and screen sizes.',
    completed: false,
    priority: TaskPriority.HIGH,
    createdAt: new Date('2025-01-10T07:00:00.000Z'),
    updatedAt: new Date('2025-01-10T07:00:00.000Z'),
    category: 'Development'
  },
  {
    id: '4d5e6f78-90ab-cdef-1234-567890abcdef',
    title: 'Team standup meeting',
    completed: true,
    priority: TaskPriority.LOW,
    createdAt: new Date('2025-01-09T10:00:00.000Z'),
    updatedAt: new Date('2025-01-09T11:00:00.000Z'),
    category: 'Meetings'
  },
  {
    id: '5e6f7890-abcd-ef12-3456-7890abcdef12',
    title: 'Update project README',
    description: 'Add installation instructions, API documentation, and contribution guidelines to the main README file.',
    completed: false,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date('2025-01-10T04:00:00.000Z'),
    updatedAt: new Date('2025-01-10T04:00:00.000Z'),
    category: 'Documentation'
  },
  {
    id: '6f789012-3456-7890-abcd-ef123456789a',
    title: 'Code review for PR #123',
    completed: false,
    priority: TaskPriority.LOW,
    createdAt: new Date('2025-01-10T09:30:00.000Z'),
    updatedAt: new Date('2025-01-10T09:30:00.000Z'),
    category: 'Development'
  },
  {
    id: '7890abcd-ef12-3456-7890-abcdef123456',
    title: 'Implement dark mode theme',
    description: 'Add dark mode support across the entire application with proper color schemes and user preference persistence.',
    completed: false,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date('2025-01-06T13:20:00.000Z'),
    updatedAt: new Date('2025-01-08T10:15:00.000Z'),
    category: 'Development'
  },
  {
    id: '890abcde-f123-4567-890a-bcdef1234567',
    title: 'Performance optimization audit',
    description: 'Conduct comprehensive performance analysis and implement optimizations for faster page load times.',
    completed: true,
    priority: TaskPriority.HIGH,
    createdAt: new Date('2025-01-03T11:00:00.000Z'),
    updatedAt: new Date('2025-01-05T15:30:00.000Z'),
    category: 'Performance'
  }
];

/**
 * Validates query parameters and returns parsed values
 */
function validateAndParseQuery(searchParams: URLSearchParams) {
  const errors: string[] = [];
  
  // Validate status parameter
  const status = searchParams.get('status');
  if (status && !Object.values(TaskStatus).includes(status as TaskStatus)) {
    errors.push(`Invalid status: ${status}. Must be one of: ${Object.values(TaskStatus).join(', ')}`);
  }
  
  // Validate priority parameter
  const priority = searchParams.get('priority');
  if (priority && !Object.values(TaskPriority).includes(priority as TaskPriority)) {
    errors.push(`Invalid priority: ${priority}. Must be one of: ${Object.values(TaskPriority).join(', ')}`);
  }
  
  // Validate search parameter
  const search = searchParams.get('search');
  if (search && search.length > 100) {
    errors.push('Search term must be 100 characters or less');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    params: {
      status: status as TaskStatus | null,
      priority: priority as TaskPriority | null,
      search: search || null
    }
  };
}

/**
 * Filters tasks based on provided query parameters
 */
function filterTasks(tasks: Task[], filters: {
  status: TaskStatus | null;
  priority: TaskPriority | null;
  search: string | null;
}): Task[] {
  return tasks.filter(task => {
    // Filter by status
    if (filters.status === TaskStatus.COMPLETED && !task.completed) return false;
    if (filters.status === TaskStatus.PENDING && task.completed) return false;
    
    // Filter by priority
    if (filters.priority && task.priority !== filters.priority) return false;
    
    // Filter by search term (search in title and description)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = task.description?.toLowerCase().includes(searchTerm) || false;
      if (!titleMatch && !descriptionMatch) return false;
    }
    
    return true;
  });
}

/**
 * Generates task statistics for the response metadata
 */
function generateTaskStats(allTasks: Task[], filteredTasks: Task[]) {
  const completed = allTasks.filter(task => task.completed).length;
  const pending = allTasks.length - completed;
  
  const byPriority = {
    [TaskPriority.LOW]: allTasks.filter(task => task.priority === TaskPriority.LOW).length,
    [TaskPriority.MEDIUM]: allTasks.filter(task => task.priority === TaskPriority.MEDIUM).length,
    [TaskPriority.HIGH]: allTasks.filter(task => task.priority === TaskPriority.HIGH).length,
  };
  
  return {
    total: allTasks.length,
    completed,
    pending,
    byPriority,
    filtered: filteredTasks.length
  };
}

/**
 * GET /api/tasks
 * 
 * Retrieves all tasks with optional filtering capabilities.
 * 
 * Query Parameters:
 * - status: Filter by completion status ('all', 'completed', 'pending')
 * - priority: Filter by priority level ('low', 'medium', 'high')
 * - search: Search in task title and description (max 100 characters)
 * 
 * @param request - The NextRequest object containing query parameters
 * @returns NextResponse with filtered tasks or error response
 * 
 * @example
 * GET /api/tasks?status=pending&priority=high&search=auth
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": [...tasks],
 *   "meta": {
 *     "total": 8,
 *     "filtered": 2,
 *     "stats": {...}
 *   }
 * }
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate query parameters
    const validation = validateAndParseQuery(searchParams);
    
    if (!validation.isValid) {
      const errorResponse: ApiError = {
        code: API_ERROR_CODES.INVALID_QUERY_PARAMS,
        message: 'Invalid query parameters provided',
        details: {
          errors: validation.errors
        }
      };
      
      return NextResponse.json(
        { success: false, error: errorResponse },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    
    // Filter tasks based on query parameters
    const filteredTasks = filterTasks(tasks, validation.params);
    
    // Sort tasks by creation date (newest first) then by priority
    const sortedTasks = filteredTasks.sort((a, b) => {
      // First sort by completion status (incomplete tasks first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by priority (high to low)
      const priorityOrder = { 
        [TaskPriority.HIGH]: 3, 
        [TaskPriority.MEDIUM]: 2, 
        [TaskPriority.LOW]: 1 
      };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Finally by creation date (newest first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    
    // Generate response metadata
    const stats = generateTaskStats(tasks, filteredTasks);
    
    // Build successful response
    const response: GetTasksResponse = {
      success: true,
      data: sortedTasks,
      meta: {
        total: stats.total,
        page: 1, // For now, we don't implement pagination
        limit: sortedTasks.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        stats: {
          total: stats.total,
          completed: stats.completed,
          pending: stats.pending,
          byPriority: stats.byPriority
        }
      }
    };
    
    return NextResponse.json(response, { 
      status: HTTP_STATUS.OK,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    
    const errorResponse: ApiError = {
      code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred while fetching tasks',
      details: {
        timestamp: new Date().toISOString()
      }
    };
    
    return NextResponse.json(
      { success: false, error: errorResponse },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * Zod schema for validating task creation requests
 */
const createTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .trim(),
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be low, medium, or high' })
  }),
  category: z.string()
    .max(50, 'Category must be 50 characters or less')
    .optional()
});

/**
 * POST /api/tasks
 * 
 * Creates a new task with the provided data.
 * 
 * Request Body:
 * - title: Required string (1-100 characters)
 * - description: Optional string (max 500 characters)
 * - priority: Required enum ('low', 'medium', 'high')
 * - category: Optional string (max 50 characters)
 * 
 * @param request - The NextRequest object containing the task data in the body
 * @returns NextResponse with created task or error response
 * 
 * @example
 * POST /api/tasks
 * Body: {
 *   "title": "New task",
 *   "description": "Task description",
 *   "priority": "high",
 *   "category": "Development"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "uuid-here",
 *     "title": "New task",
 *     "description": "Task description",
 *     "completed": false,
 *     "priority": "high",
 *     "createdAt": "2025-01-10T...",
 *     "updatedAt": "2025-01-10T...",
 *     "category": "Development"
 *   }
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: API_ERROR_CODES.INVALID_REQUEST_BODY,
            message: 'Invalid JSON in request body',
            details: { reason: 'Request body must be valid JSON' }
          }
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Validate request body using Zod schema
    const validation = createTaskSchema.safeParse(body);
    
    if (!validation.success) {
      const errorDetails = validation.error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: API_ERROR_CODES.VALIDATION_ERROR,
            message: 'Validation failed',
            details: { errors: errorDetails }
          }
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Create new task with validated data
    const now = new Date();
    const newTask: Task = {
      id: generateId(),
      title: validation.data.title,
      completed: false,
      priority: validation.data.priority as TaskPriority,
      createdAt: now,
      updatedAt: now,
      ...(validation.data.description && { description: validation.data.description }),
      ...(validation.data.category && { category: validation.data.category })
    };

    // Add task to in-memory storage
    tasks.push(newTask);

    // Return success response with created task
    return NextResponse.json(
      {
        success: true,
        data: newTask
      } as CreateTaskResponse,
      { status: HTTP_STATUS.CREATED }
    );

  } catch (error) {
    console.error('Error creating task:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          details: { reason: 'An unexpected error occurred while creating the task' }
        }
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
} 