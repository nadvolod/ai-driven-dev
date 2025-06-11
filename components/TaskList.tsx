'use client';

import { cn, loadTasksFromStorage, loadUserPreferences, saveTasksToStorage, saveUserPreferences, sortTasks, UserPreferences } from '@/lib/utils';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { LoadingState } from '@/types/ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TaskCard } from './TaskCard';
import { useConfirmationDialog } from './ui/ConfirmationDialog';
import { EmptyState, EmptyStatePresets } from './ui/EmptyState';
import { ErrorMessage } from './ui/ErrorMessage';
import { Loading } from './ui/Loading';
import { useToast } from './ui/Toast';

/**
 * Props interface for TaskList component
 */
export interface TaskListProps {
  /** Array of tasks to display */
  tasks: Task[];
  /** Callback function when task completion status changes */
  onToggleComplete?: (taskId: string) => void;
  /** Callback function when task is edited */
  onEditTask?: (task: Task) => void;
  /** Callback function when task is deleted */
  onDeleteTask?: (taskId: string) => void;
  /** Callback function when tasks are updated (for localStorage sync) */
  onTasksUpdate?: (tasks: Task[]) => void;
  /** Current filter settings */
  currentFilter?: {
    status: TaskStatus;
    priority?: TaskPriority;
    category?: string;
    search?: string;
  };
  /** Loading state */
  loading?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * TaskList Component
 * 
 * A comprehensive task list component with:
 * - Responsive grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)
 * - Priority-based sorting with user preferences
 * - Local storage integration for persistence
 * - Task completion toggle with visual feedback
 * - Empty state and loading state support
 * - Smooth animations for task state changes
 * - Filter and sort controls
 * - Task statistics display
 */
export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onTasksUpdate,
  currentFilter,
  loading: _loading = false,
  className = ''
}) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(loadUserPreferences());
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'createdAt'>('priority');
  const [showCompleted, setShowCompleted] = useState(true);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  
  const { addToast } = useToast();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = loadTasksFromStorage();
    setLocalTasks(storedTasks);
    if (onTasksUpdate) {
      onTasksUpdate(storedTasks);
    }
  }, [onTasksUpdate]);

  // Save tasks to localStorage when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasksToStorage(tasks);
      setLocalTasks(tasks);
    }
  }, [tasks]);

  /**
   * Handle user preference changes
   */
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...userPreferences, ...newPreferences };
    setUserPreferences(updated);
    saveUserPreferences(updated);
  };

  /**
   * Filter and sort tasks based on current settings
   */
  const processedTasks = useMemo(() => {
    let filtered = [...(tasks.length > 0 ? tasks : localTasks)];

    // Apply current filter if provided
    if (currentFilter) {
      filtered = filtered.filter(task => {
        // Status filter
        if (currentFilter.status === TaskStatus.COMPLETED && !task.completed) return false;
        if (currentFilter.status === TaskStatus.PENDING && task.completed) return false;
        
        // Priority filter
        if (currentFilter.priority && task.priority !== currentFilter.priority) return false;
        
        // Category filter
        if (currentFilter.category && task.category !== currentFilter.category) return false;
        
        // Search filter
        if (currentFilter.search) {
          const searchTerm = currentFilter.search.toLowerCase();
          const titleMatch = task.title.toLowerCase().includes(searchTerm);
          const descriptionMatch = task.description?.toLowerCase().includes(searchTerm) || false;
          if (!titleMatch && !descriptionMatch) return false;
        }
        
        return true;
      });
    }

    // Apply hide completed preference
    if (userPreferences.hideCompleted) {
      filtered = filtered.filter(task => !task.completed);
    }

    // Sort tasks
    return sortTasks(filtered, userPreferences.sortBy, userPreferences.sortOrder);
  }, [tasks, localTasks, currentFilter, userPreferences]);

  /**
   * Handle task completion toggle
   */
  const handleToggleComplete = (taskId: string) => {
    const updatedTasks = (tasks.length > 0 ? tasks : localTasks).map(task =>
      task.id === taskId 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    );
    
    saveTasksToStorage(updatedTasks);
    setLocalTasks(updatedTasks);
    
    if (onToggleComplete) {
      onToggleComplete(taskId);
    }
    if (onTasksUpdate) {
      onTasksUpdate(updatedTasks);
    }
  };

  /**
   * Handle task deletion
   */
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = (tasks.length > 0 ? tasks : localTasks).filter(task => task.id !== taskId);
    
    saveTasksToStorage(updatedTasks);
    setLocalTasks(updatedTasks);
    
    if (onDeleteTask) {
      onDeleteTask(taskId);
    }
    if (onTasksUpdate) {
      onTasksUpdate(updatedTasks);
    }
  };

  /**
   * Get task statistics
   */
  const getTaskStats = () => {
    const allTasks = tasks.length > 0 ? tasks : localTasks;
    const total = allTasks.length;
    const completed = allTasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = allTasks.filter(task => 
      task.dueDate && 
      !task.completed && 
      new Date(task.dueDate) < new Date()
    ).length;

    return { total, completed, pending, overdue, filtered: processedTasks.length };
  };

  const stats = getTaskStats();

  /**
   * Get sort icon
   */
  const getSortIcon = (isActive: boolean) => (
    <svg 
      className={cn(
        'w-4 h-4 transition-transform duration-200',
        isActive && userPreferences.sortOrder === 'desc' && 'rotate-180'
      )} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
  );

  /**
   * Load initial data and preferences
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingState('loading');
        setError(null);

        // Simulate loading delay for demo
        await new Promise(resolve => setTimeout(resolve, 500));

        const preferences = loadUserPreferences();
        if (preferences) {
          setSortBy(preferences.sortBy);
          setShowCompleted(preferences.showCompleted);
        }

        setLoadingState('success');
      } catch (err) {
        setError('Failed to load tasks. Please try again.');
        setLoadingState('error');
        addToast({
          type: 'error',
          title: 'Loading Error',
          message: 'Failed to load your tasks. Please refresh the page.'
        });
      }
    };

    loadData();
  }, [addToast]);

  /**
   * Save user preferences when they change
   */
  useEffect(() => {
    const preferences = { sortBy, showCompleted };
    saveUserPreferences(preferences);
  }, [sortBy, showCompleted]);

  /**
   * Handle task completion toggle
   */
  const handleTaskToggle = useCallback(async (taskId: string, completed: boolean) => {
    try {
      setLoadingState('loading');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      onToggleComplete && onToggleComplete(taskId);
      
      setLoadingState('success');
      addToast({
        type: 'success',
        title: completed ? 'Task Completed!' : 'Task Reopened',
        message: completed ? 'Great job completing this task!' : 'Task has been marked as incomplete.'
      });
    } catch (err) {
      setLoadingState('error');
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update task. Please try again.'
      });
    }
  }, [onToggleComplete, addToast]);

  /**
   * Handle task deletion with confirmation
   */
  const handleTaskDelete = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const confirmed = await confirm({
        title: 'Delete Task',
        message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        variant: 'danger'
      });

      if (!confirmed) return;

      setDeletingTaskId(taskId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      onDeleteTask && onDeleteTask(taskId);
      setDeletingTaskId(null);
      
      addToast({
        type: 'success',
        title: 'Task Deleted',
        message: 'Task has been successfully deleted.',
        action: {
          label: 'Undo',
          onClick: () => {
            // In a real app, you would restore the task here
            addToast({
              type: 'info',
              title: 'Undo Feature',
              message: 'Undo functionality would be implemented here.'
            });
          }
        }
      });
    } catch (err) {
      setDeletingTaskId(null);
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete task. Please try again.'
      });
    }
  }, [tasks, confirm, onDeleteTask, addToast]);

  /**
   * Handle retry on error
   */
  const handleRetry = useCallback(() => {
    setLoadingState('idle');
    setError(null);
    // Trigger reload
    window.location.reload();
  }, []);

  /**
   * Get appropriate empty state
   */
  const getEmptyState = () => {
    if (tasks.length === 0) {
      return (
        <EmptyState
          {...EmptyStatePresets.noTasks}
          action={{
            label: 'Create Your First Task',
            onClick: () => {
              // Scroll to form or open modal
              document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="col-span-full"
        />
      );
    }

    if (!showCompleted && stats.pending === 0) {
      return (
        <EmptyState
          {...EmptyStatePresets.allCompleted}
          action={{
            label: 'Show Completed Tasks',
            onClick: () => setShowCompleted(true),
            variant: 'secondary'
          }}
          className="col-span-full"
        />
      );
    }

    if (processedTasks.length === 0) {
      return (
        <EmptyState
          {...EmptyStatePresets.noResults}
          action={{
            label: 'Show All Tasks',
            onClick: () => setShowCompleted(true),
            variant: 'secondary'
          }}
          className="col-span-full"
        />
      );
    }

    return null;
  };

  // Loading state
  if (loadingState === 'loading') {
    return (
      <div className={cn('space-y-6', className)}>
        <Loading 
          variant="skeleton" 
          center 
          text="Loading your tasks..." 
          className="py-8"
        />
      </div>
    );
  }

  // Error state
  if (loadingState === 'error' && error) {
    return (
      <div className={cn('space-y-6', className)}>
        <ErrorMessage
          error={error}
          variant="card"
          showRetry
          onRetry={handleRetry}
          className="max-w-md mx-auto"
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with stats and controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Task Statistics */}
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-white">{stats.filtered}</span> of{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{stats.total}</span> tasks
            </div>
            
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-600 dark:text-gray-300">{stats.completed} completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-600 dark:text-gray-300">{stats.pending} pending</span>
              </div>
              {stats.overdue > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-600 dark:text-red-400 font-medium">{stats.overdue} overdue</span>
                </div>
              )}
            </div>
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center gap-3">
            {/* Hide Completed Toggle */}
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={userPreferences.hideCompleted}
                onChange={(e) => updatePreferences({ hideCompleted: e.target.checked })}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              Hide completed
            </label>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
              <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                {[
                  { key: 'priority' as const, label: 'Priority' },
                  { key: 'dueDate' as const, label: 'Due Date' },
                  { key: 'createdAt' as const, label: 'Created' },
                  { key: 'title' as const, label: 'Title' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      if (userPreferences.sortBy === option.key) {
                        updatePreferences({ 
                          sortOrder: userPreferences.sortOrder === 'asc' ? 'desc' : 'asc' 
                        });
                      } else {
                        updatePreferences({ 
                          sortBy: option.key,
                          sortOrder: option.key === 'priority' ? 'desc' : 'asc'
                        });
                      }
                    }}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium transition-colors duration-200 flex items-center gap-1',
                      userPreferences.sortBy === option.key
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                  >
                    {option.label}
                    {userPreferences.sortBy === option.key && getSortIcon(true)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {processedTasks.map((task, index) => (
          <div
            key={task.id}
            className="animate-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <TaskCard
              task={task}
              onToggle={(completed) => handleTaskToggle(task.id, completed)}
              onDelete={() => handleTaskDelete(task.id)}
              onEdit={(updates) => onEditTask && onEditTask(updates)}
              isDeleting={deletingTaskId === task.id}
              className="h-full"
            />
          </div>
        ))}
        
        {/* Empty State */}
        {getEmptyState()}
      </div>

      {/* Confirmation Dialog */}
      {ConfirmationDialog}
    </div>
  );
}; 