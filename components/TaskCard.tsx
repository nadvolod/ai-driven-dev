'use client';

import React from 'react';

import { cn, formatDate } from '@/lib/utils';
import { Task, TaskPriority } from '@/types/task';

/**
 * Props interface for TaskCard component
 */
interface TaskCardProps {
  /** The task object to display */
  task: Task;
  /** Callback function when task completion status changes */
  onToggleComplete: (taskId: string) => void;
  /** Callback function when task is edited */
  onEdit: (task: Task) => void;
  /** Callback function when task is deleted */
  onDelete: (taskId: string) => void;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * TaskCard Component
 * 
 * Displays an individual task with:
 * - Task title and description
 * - Completion status toggle
 * - Priority indicator
 * - Edit and delete actions
 * - Created/updated timestamps
 * 
 * Styling: Tailwind CSS with responsive design
 * State: Stateless component, all state managed by parent
 */
export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  className
}) => {
  /**
   * Get priority-specific styling classes
   */
  const getPriorityClasses = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case TaskPriority.MEDIUM:
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case TaskPriority.LOW:
        return 'border-l-green-500 bg-green-50 dark:bg-green-950/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  /**
   * Get priority badge styling
   */
  const getPriorityBadgeClasses = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case TaskPriority.LOW:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div
      className={cn(
        'card border-l-4 p-6 transition-all duration-200 hover:shadow-lg group',
        getPriorityClasses(task.priority),
        task.completed && 'opacity-75',
        className
      )}
    >
      {/* Header with title and actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Completion checkbox */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className={cn(
              'mt-1 h-5 w-5 rounded border-gray-300 text-primary',
              'focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'transition-colors duration-200',
              'dark:border-gray-600 dark:bg-gray-700'
            )}
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          
          {/* Task title */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'text-lg font-semibold text-foreground leading-tight',
                task.completed && 'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </h3>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            className={cn(
              'btn btn-ghost btn-sm p-2 h-8 w-8',
              'text-muted-foreground hover:text-primary hover:bg-primary/10'
            )}
            aria-label={`Edit task "${task.title}"`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className={cn(
              'btn btn-ghost btn-sm p-2 h-8 w-8',
              'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
            )}
            aria-label={`Delete task "${task.title}"`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p 
          className={cn(
            'text-sm text-muted-foreground mb-4 leading-relaxed',
            task.completed && 'line-through'
          )}
        >
          {task.description}
        </p>
      )}

      {/* Footer with metadata */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center space-x-2">
          {/* Priority badge */}
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getPriorityBadgeClasses(task.priority)
            )}
          >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"></span>
            {task.priority.toUpperCase()}
          </span>

          {/* Category */}
          {task.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {task.category}
            </span>
          )}
        </div>

        {/* Timestamps */}
        <div className="flex flex-col items-end space-y-1 text-xs text-muted-foreground">
          <time dateTime={task.createdAt.toISOString()}>
            Created: {formatDate(task.createdAt)}
          </time>
          {task.updatedAt.getTime() !== task.createdAt.getTime() && (
            <time dateTime={task.updatedAt.toISOString()}>
              Updated: {formatDate(task.updatedAt)}
            </time>
          )}
        </div>
      </div>
    </div>
  );
}; 