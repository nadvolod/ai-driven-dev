'use client';

import { cn } from '@/lib/utils';
import { GetTasksResponse } from '@/types/api';
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
 * Interface for API response state
 */
interface ApiResponseState {
  data: GetTasksResponse | null;
  error: string | null;
  loading: boolean;
  lastRequest: string | null;
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