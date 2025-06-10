'use client';

import React from 'react';
import { Task, TaskPriority } from '../types/task';

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
  className = ''
}) => {
  /**
   * Get priority-specific styling classes
   */
  const getPriorityClasses = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'border-l-red-500 bg-red-50';
      case TaskPriority.MEDIUM:
        return 'border-l-yellow-500 bg-yellow-50';
      case TaskPriority.LOW:
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  /**
   * Get priority badge styling
   */
  const getPriorityBadgeClasses = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-red-100 text-red-800';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case TaskPriority.LOW:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div
      className={`
        border-l-4 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200
        ${getPriorityClasses(task.priority)}
        ${task.completed ? 'opacity-75' : ''}
        ${className}
      `}
    >
      {/* Header with title and actions */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3 flex-1">
          {/* Completion checkbox */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          
          {/* Task title */}
          <h3
            className={`
              text-lg font-medium text-gray-900 flex-1
              ${task.completed ? 'line-through text-gray-500' : ''}
            `}
          >
            {task.title}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
            aria-label={`Edit task "${task.title}"`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
            aria-label={`Delete task "${task.title}"`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className={`text-sm text-gray-600 mb-3 ${task.completed ? 'line-through' : ''}`}>
          {task.description}
        </p>
      )}

      {/* Footer with metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          {/* Priority badge */}
          <span
            className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${getPriorityBadgeClasses(task.priority)}
            `}
          >
            {task.priority.toUpperCase()}
          </span>

          {/* Category */}
          {task.category && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              {task.category}
            </span>
          )}
        </div>

        {/* Timestamps */}
        <div className="flex flex-col items-end space-y-1">
          <span>Created: {formatDate(task.createdAt)}</span>
          {task.updatedAt.getTime() !== task.createdAt.getTime() && (
            <span>Updated: {formatDate(task.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}; 