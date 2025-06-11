'use client';

import { cn, loadTasksFromStorage, loadUserPreferences, saveTasksToStorage, saveUserPreferences, sortTasks, UserPreferences } from '@/lib/utils';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import React, { useEffect, useMemo, useState } from 'react';
import { TaskCard } from './TaskCard';

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
  loading = false,
  className = ''
}) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(loadUserPreferences());
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

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

  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
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
      {processedTasks.length === 0 ? (
        // Empty State
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {currentFilter && (currentFilter.status !== TaskStatus.ALL || currentFilter.priority || currentFilter.category || currentFilter.search)
                ? 'No matching tasks found'
                : stats.total > 0 && userPreferences.hideCompleted
                ? 'All tasks completed!'
                : 'No tasks yet'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
              {currentFilter && (currentFilter.status !== TaskStatus.ALL || currentFilter.priority || currentFilter.category || currentFilter.search)
                ? 'Try adjusting your filters to see more tasks.'
                : stats.total > 0 && userPreferences.hideCompleted
                ? 'Great job! You can show completed tasks using the toggle above.'
                : 'Create your first task to get started with managing your workflow.'
              }
            </p>
          </div>
        </div>
      ) : (
        // Task Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedTasks.map((task, index) => (
            <div
              key={task.id}
              className="transform transition-all duration-300 ease-out"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              <TaskCard
                task={task}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                className="h-full"
                {...(onEditTask && { onEdit: onEditTask })}
              />
            </div>
          ))}
        </div>
      )}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}; 