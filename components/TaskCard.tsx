'use client';

import React from 'react';

import { cn, formatDate, isTaskOverdue } from '@/lib/utils';
import { Task, TaskPriority } from '@/types/task';

/**
 * Props interface for TaskCard component
 */
export interface TaskCardProps {
  /** The task object to display */
  task: Task;
  /** Callback function when task completion status changes */
  onToggleComplete?: (taskId: string) => void;
  /** Callback function when task is edited */
  onEdit?: (task: Task) => void;
  /** Callback function when task is deleted */
  onDelete?: (taskId: string) => void;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * TaskCard Component
 * 
 * A comprehensive card component for displaying individual tasks with:
 * - Task completion toggle with visual feedback
 * - Priority indicators with color coding
 * - Due date display with overdue warnings
 * - Edit and delete actions
 * - Smooth animations for state changes
 * - Responsive design with dark mode support
 */
export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  className = ''
}) => {
  const isOverdue = isTaskOverdue(task);
  
  /**
   * Get priority color classes based on task priority
   */
  const getPriorityClasses = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case TaskPriority.LOW:
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  /**
   * Get priority icon based on task priority
   */
  const getPriorityIcon = (priority: TaskPriority): React.ReactNode => {
    const iconClasses = "w-3 h-3";
    
    switch (priority) {
      case TaskPriority.HIGH:
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
        );
      case TaskPriority.MEDIUM:
        return <div className={cn(iconClasses, "rounded-full bg-current")} />;
      case TaskPriority.LOW:
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  /**
   * Handle task completion toggle
   */
  const handleToggleComplete = () => {
    if (onToggleComplete) {
      onToggleComplete(task.id);
    }
  };

  /**
   * Handle edit action
   */
  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  /**
   * Handle delete action
   */
  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    }
  };

  return (
    <div
      className={cn(
        // Base styles
        'group relative bg-white dark:bg-gray-800 rounded-lg border shadow-sm',
        'transition-all duration-300 ease-in-out',
        'hover:shadow-md hover:-translate-y-0.5',
        // Completed task styles
        task.completed && 'opacity-75 bg-gray-50 dark:bg-gray-900/50',
        // Overdue styles
        isOverdue && !task.completed && 'border-red-300 dark:border-red-700 ring-1 ring-red-200 dark:ring-red-800',
        // Normal border
        !isOverdue && 'border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {/* Overdue indicator */}
      {isOverdue && !task.completed && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}

      <div className="p-4 space-y-3">
        {/* Header with checkbox and priority */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Completion checkbox */}
            <button
              onClick={handleToggleComplete}
              className={cn(
                'mt-1 w-5 h-5 rounded border-2 flex items-center justify-center',
                'transition-all duration-200 ease-in-out',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                task.completed
                  ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
              )}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Task content */}
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'font-semibold text-gray-900 dark:text-white transition-all duration-300',
                  task.completed && 'line-through text-gray-500 dark:text-gray-400'
                )}
              >
                {task.title}
              </h3>
              
              {task.description && (
                <p
                  className={cn(
                    'mt-1 text-sm text-gray-600 dark:text-gray-300 transition-all duration-300',
                    task.completed && 'line-through text-gray-400 dark:text-gray-500'
                  )}
                >
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Priority badge */}
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
              'transition-all duration-200',
              getPriorityClasses(task.priority)
            )}
          >
            {getPriorityIcon(task.priority)}
            {task.priority}
          </span>
        </div>

        {/* Metadata row */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            {/* Category */}
            {task.category && (
              <span className="inline-flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {task.category}
              </span>
            )}

            {/* Due date */}
            {task.dueDate && (
              <span
                className={cn(
                  'inline-flex items-center gap-1',
                  isOverdue && !task.completed && 'text-red-600 dark:text-red-400 font-medium'
                )}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(task.dueDate)}
                {isOverdue && !task.completed && ' (Overdue)'}
              </span>
            )}
          </div>

          {/* Created date */}
          <span>
            Created {formatDate(task.createdAt)}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
              aria-label="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
              aria-label="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 