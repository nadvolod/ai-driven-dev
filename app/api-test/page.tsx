'use client';

import { cn } from '@/lib/utils';
import { CreateTaskResponse, GetTasksResponse } from '@/types/api';
import { TaskPriority, TaskStatus } from '@/types/task';
import { useState } from 'react';

/**
 * Interface for API test form state
 */
interface TestFormState {
  status: string;
  priority: string;
  search: string;
}

/**
 * Interface for create task form state
 */
interface CreateTaskFormState {
  title: string;
  description: string;
  priority: TaskPriority;
  category: string;
}

/**
 * Interface for API response state
 */
interface ApiResponseState {
  data: GetTasksResponse | null;
  error: string | null;
  loading: boolean;
  lastRequest: string | null;
}

/**
 * Interface for create task response state
 */
interface CreateTaskResponseState {
  data: CreateTaskResponse | null;
  error: string | null;
  loading: boolean;
  success: boolean;
}

/**
 * API Testing Demo Page
 * 
 * This page provides a comprehensive interface to test the GET /api/tasks endpoint
 * with various filtering options and displays the results in a user-friendly format.
 */
export default function ApiTestPage() {
  const [formState, setFormState] = useState<TestFormState>({
    status: '',
    priority: '',
    search: ''
  });

  const [apiResponse, setApiResponse] = useState<ApiResponseState>({
    data: null,
    error: null,
    loading: false,
    lastRequest: null
  });

  const [createForm, setCreateForm] = useState<CreateTaskFormState>({
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    category: ''
  });

  const [createResponse, setCreateResponse] = useState<CreateTaskResponseState>({
    data: null,
    error: null,
    loading: false,
    success: false
  });

  /**
   * Builds query string from form state
   */
  const buildQueryString = (params: TestFormState): string => {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.search.trim()) queryParams.append('search', params.search.trim());
    
    return queryParams.toString();
  };

  /**
   * Fetches tasks from the API with current form parameters
   */
  const fetchTasks = async (customParams?: Partial<TestFormState>) => {
    const params = { ...formState, ...customParams };
    const queryString = buildQueryString(params);
    const url = `/api/tasks${queryString ? `?${queryString}` : ''}`;
    
    setApiResponse(prev => ({
      ...prev,
      loading: true,
      error: null,
      lastRequest: url
    }));

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      setApiResponse(prev => ({
        ...prev,
        data,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('API request failed:', error);
      setApiResponse(prev => ({
        ...prev,
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  };

  /**
   * Handles form input changes
   */
  const handleInputChange = (field: keyof TestFormState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Clears all form fields and results
   */
  const clearAll = () => {
    setFormState({
      status: '',
      priority: '',
      search: ''
    });
    setApiResponse({
      data: null,
      error: null,
      loading: false,
      lastRequest: null
    });
  };

  /**
   * Quick action buttons for common test cases
   */
  const quickActions = [
    { label: 'All Tasks', params: {} },
    { label: 'Completed Tasks', params: { status: TaskStatus.COMPLETED } },
    { label: 'Pending Tasks', params: { status: TaskStatus.PENDING } },
    { label: 'High Priority', params: { priority: TaskPriority.HIGH } },
    { label: 'Development Tasks', params: { search: 'development' } },
  ];

  /**
   * Creates a new task via POST request
   */
  const createTask = async () => {
    // Validate form
    if (!createForm.title.trim()) {
      setCreateResponse(prev => ({
        ...prev,
        error: 'Title is required',
        success: false
      }));
      return;
    }

    if (createForm.title.length > 100) {
      setCreateResponse(prev => ({
        ...prev,
        error: 'Title must be 100 characters or less',
        success: false
      }));
      return;
    }

    if (createForm.description.length > 500) {
      setCreateResponse(prev => ({
        ...prev,
        error: 'Description must be 500 characters or less',
        success: false
      }));
      return;
    }

    setCreateResponse(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false
    }));

    try {
      const taskData = {
        title: createForm.title.trim(),
        priority: createForm.priority,
        ...(createForm.description.trim() && { description: createForm.description.trim() }),
        ...(createForm.category.trim() && { category: createForm.category.trim() })
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      setCreateResponse({
        data,
        error: null,
        loading: false,
        success: true
      });

      // Reset form on success
      setCreateForm({
        title: '',
        description: '',
        priority: TaskPriority.MEDIUM,
        category: ''
      });

      // Refresh task list if we have current filters
      if (apiResponse.lastRequest) {
        await fetchTasks();
      }

    } catch (error) {
      console.error('Create task failed:', error);
      setCreateResponse({
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false,
        success: false
      });
    }
  };

  /**
   * Handles create form input changes
   */
  const handleCreateFormChange = (field: keyof CreateTaskFormState, value: string | TaskPriority) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear any previous errors when user starts typing
    if (createResponse.error) {
      setCreateResponse(prev => ({
        ...prev,
        error: null
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          API Testing Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Interactive testing interface for the <code className="bg-muted px-2 py-1 rounded text-sm">GET /api/tasks</code> endpoint.
          Test filtering, search functionality, and view formatted API responses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Test Controls */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => fetchTasks(action.params)}
                  disabled={apiResponse.loading}
                  className="btn btn-outline btn-sm text-left"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Form */}
          <div className="card space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Filter Parameters</h2>
              <button
                onClick={clearAll}
                className="btn btn-outline btn-sm"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium text-foreground">
                  Status Filter
                </label>
                <select
                  id="status"
                  value={formState.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">All Statuses</option>
                  <option value={TaskStatus.ALL}>All</option>
                  <option value={TaskStatus.COMPLETED}>Completed</option>
                  <option value={TaskStatus.PENDING}>Pending</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <label htmlFor="priority" className="block text-sm font-medium text-foreground">
                  Priority Filter
                </label>
                <select
                  id="priority"
                  value={formState.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">All Priorities</option>
                  <option value={TaskPriority.HIGH}>High Priority</option>
                  <option value={TaskPriority.MEDIUM}>Medium Priority</option>
                  <option value={TaskPriority.LOW}>Low Priority</option>
                </select>
              </div>

              {/* Search Filter */}
              <div className="space-y-2">
                <label htmlFor="search" className="block text-sm font-medium text-foreground">
                  Search (Title & Description)
                </label>
                <input
                  id="search"
                  type="text"
                  value={formState.search}
                  onChange={(e) => handleInputChange('search', e.target.value)}
                  placeholder="Enter search term..."
                  maxLength={100}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  {formState.search.length}/100 characters
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => fetchTasks()}
              disabled={apiResponse.loading}
              className={cn(
                'w-full btn btn-primary',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2'
              )}
            >
              {apiResponse.loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <span>{apiResponse.loading ? 'Fetching...' : 'Fetch Tasks'}</span>
            </button>
          </div>

          {/* Request Info */}
          {apiResponse.lastRequest && (
            <div className="card space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Last Request</h3>
              <div className="bg-muted p-3 rounded-lg">
                <code className="text-sm break-all text-foreground">
                  GET {apiResponse.lastRequest}
                </code>
              </div>
            </div>
          )}

          {/* Create Task Form */}
          <div className="card space-y-5">
            <h2 className="text-xl font-semibold text-foreground">Create New Task</h2>
            
            <div className="space-y-4">
              {/* Title Input */}
              <div className="space-y-2">
                <label htmlFor="create-title" className="block text-sm font-medium text-foreground">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="create-title"
                  type="text"
                  value={createForm.title}
                  onChange={(e) => handleCreateFormChange('title', e.target.value)}
                  placeholder="Enter task title..."
                  maxLength={100}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  {createForm.title.length}/100 characters
                </p>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label htmlFor="create-description" className="block text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id="create-description"
                  value={createForm.description}
                  onChange={(e) => handleCreateFormChange('description', e.target.value)}
                  placeholder="Enter task description..."
                  maxLength={500}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {createForm.description.length}/500 characters
                </p>
              </div>

              {/* Priority Select */}
              <div className="space-y-2">
                <label htmlFor="create-priority" className="block text-sm font-medium text-foreground">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  id="create-priority"
                  value={createForm.priority}
                  onChange={(e) => handleCreateFormChange('priority', e.target.value as TaskPriority)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value={TaskPriority.LOW}>Low Priority</option>
                  <option value={TaskPriority.MEDIUM}>Medium Priority</option>
                  <option value={TaskPriority.HIGH}>High Priority</option>
                </select>
              </div>

              {/* Category Input */}
              <div className="space-y-2">
                <label htmlFor="create-category" className="block text-sm font-medium text-foreground">
                  Category
                </label>
                <input
                  id="create-category"
                  type="text"
                  value={createForm.category}
                  onChange={(e) => handleCreateFormChange('category', e.target.value)}
                  placeholder="Enter category..."
                  maxLength={50}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  {createForm.category.length}/50 characters
                </p>
              </div>
            </div>

            {/* Create Task Button */}
            <button
              onClick={createTask}
              disabled={createResponse.loading || !createForm.title.trim()}
              className={cn(
                'w-full btn',
                createResponse.success ? 'btn-success' : 'btn-primary',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2'
              )}
            >
              {createResponse.loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <span>
                {createResponse.loading 
                  ? 'Creating Task...' 
                  : createResponse.success 
                    ? 'Task Created!' 
                    : 'Create Task'
                }
              </span>
            </button>

            {/* Create Response Messages */}
            {createResponse.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 dark:text-red-300 text-sm">{createResponse.error}</p>
                </div>
              </div>
            )}

            {createResponse.success && createResponse.data && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm">
                    <p className="text-green-700 dark:text-green-300 font-medium">Task created successfully!</p>
                    <p className="text-green-600 dark:text-green-400 mt-1">
                      Created "{createResponse.data.data.title}" with ID: {createResponse.data.data.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - API Response */}
        <div className="space-y-6">
          {/* Response Status */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">API Response</h2>
              {apiResponse.data && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-green-600">Success</span>
                </div>
              )}
              {apiResponse.error && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-red-600">Error</span>
                </div>
              )}
            </div>

            {/* Loading State */}
            {apiResponse.loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-foreground">Loading tasks...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {apiResponse.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-red-800 dark:text-red-200">Request Failed</h3>
                    <p className="text-red-700 dark:text-red-300 mt-1">{apiResponse.error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success State - Stats Summary */}
            {apiResponse.data && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-200">
                        Found {apiResponse.data.data.length} task{apiResponse.data.data.length !== 1 ? 's' : ''}
                      </h3>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        {apiResponse.data.meta.stats.completed} completed, {apiResponse.data.meta.stats.pending} pending
                      </p>
                    </div>
                  </div>
                </div>

                {/* Task Summary Cards */}
                {apiResponse.data.data.length > 0 && (
                  <div className="grid grid-cols-1 gap-3">
                    {apiResponse.data.data.slice(0, 3).map((task) => (
                      <div key={task.id} className="border border-border rounded-lg p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">{task.title}</h4>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <span className={cn(
                                'px-2 py-1 rounded-full',
                                task.priority === TaskPriority.HIGH ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                                task.priority === TaskPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                                'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                              )}>
                                {task.priority}
                              </span>
                              {task.category && (
                                <span className="text-muted-foreground">{task.category}</span>
                              )}
                            </div>
                          </div>
                          <div className={cn(
                            'w-3 h-3 rounded-full shrink-0 mt-1',
                            task.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                          )} />
                        </div>
                      </div>
                    ))}
                    {apiResponse.data.data.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        And {apiResponse.data.data.length - 3} more task{apiResponse.data.data.length - 3 !== 1 ? 's' : ''}...
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Raw JSON Response */}
          {(apiResponse.data || apiResponse.error) && (
            <div className="card space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Raw JSON Response</h3>
              <div className="bg-gray-50 dark:bg-gray-900 border border-border rounded-lg overflow-hidden">
                <pre className="p-4 text-sm overflow-auto max-h-96 text-foreground">
                  <code>
                    {JSON.stringify(apiResponse.data || { error: apiResponse.error }, null, 2)}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 