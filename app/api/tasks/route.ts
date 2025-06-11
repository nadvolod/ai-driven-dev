import { API_ERROR_CODES, ApiError, GetTasksResponse, HTTP_STATUS } from '@/types/api';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Basic Tasks API for Testing
 * 
 * This is a simple in-memory implementation for demonstration and testing.
 * In a real application, this would connect to a database.
 */

// In-memory storage for demo purposes
let tasks: Task[] = [
  {
    id: '1',
    title: 'Sample Task 1',
    description: 'This is a sample task for testing',
    completed: false,
    priority: TaskPriority.MEDIUM,
    category: 'Development',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Completed Sample Task',
    description: 'This task is already completed',
    completed: true,
    priority: TaskPriority.LOW,
    category: 'Testing',
    createdAt: new Date(),
    updatedAt: new Date(),
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
    const body = await request.json();
    
    // Basic validation
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return NextResponse.json(
        { message: 'Title is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    
    if (body.priority && !['LOW', 'MEDIUM', 'HIGH'].includes(body.priority)) {
      return NextResponse.json(
        { message: 'Priority must be LOW, MEDIUM, or HIGH' },
        { status: 400 }
      );
    }
    
    // Create new task
    const newTask: Task = {
      id: (Date.now() + Math.random()).toString(),
      title: body.title.trim(),
      description: body.description || undefined,
      completed: body.completed || false,
      priority: TaskPriority.MEDIUM,
      category: body.category || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    tasks.push(newTask);
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid JSON data' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  // Clear all tasks (for testing purposes)
  tasks = [];
  
  return NextResponse.json(
    { message: 'All tasks deleted' },
    { status: 200 }
  );
} 