'use client';

import React from 'react';
import { Task, TaskFilter, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';

/**
 * Props interface for TaskList component
 */
interface TaskListProps {
  /** Array of tasks to display */
  tasks: Task[];
  /** Current filter settings */
  filter: TaskFilter;
  /** Callback function when task completion status changes */
  onToggleComplete: (taskId: string) => void;
  /** Callback function when task is edited */
  onEdit: (task: Task) => void;
  /** Callback function when task is deleted */
  onDelete: (taskId: string) => void;
  /** Loading state */
  loading?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * TaskList Component
 * 
 * Renders a list of tasks with:
 * - Filtering based on status, priority, and category
 * - Loading state handling
 * - Empty state display
 * - Responsive grid layout
 * 
 * Styling: Tailwind CSS with responsive design
 * State: Stateless component, receives filtered tasks from parent
 */
export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onToggleComplete,
  onEdit,
  onDelete,
  loading = false,
  className = ''
}) => {
  /**
   * Filter tasks based on current filter settings
   */
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      // Filter by status
      if (filter.status === TaskStatus.COMPLETED && !task.completed) return false;
      if (filter.status === TaskStatus.PENDING && task.completed) return false;
      
      // Filter by priority
      if (filter.priority && task.priority !== filter.priority) return false;
      
      // Filter by category
      if (filter.category && task.category !== filter.category) return false;
      
      return true;
    });
  }, [tasks, filter]);

  /**
   * Sort tasks by priority and creation date
   */
  const sortedTasks = React.useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by priority (high to low)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Finally by creation date (newest first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [filteredTasks]);

  /**
   * Get task count summary
   */
  const getTaskSummary = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    return { total, completed, pending };
  };

  const summary = getTaskSummary();

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Loading skeleton */}
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="border-l-4 border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50 animate-pulse"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-3"></div>
            <div className="flex justify-between">
              <div className="h-6 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sortedTasks.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
          </h3>
          <p className="text-gray-500">
            {tasks.length === 0
              ? 'Create your first task to get started!'
              : 'Try adjusting your filters to see more tasks.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Task summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex space-x-6">
            <span>
              <span className="font-medium text-gray-900">{summary.total}</span> total
            </span>
            <span>
              <span className="font-medium text-green-600">{summary.completed}</span> completed
            </span>
            <span>
              <span className="font-medium text-blue-600">{summary.pending}</span> pending
            </span>
          </div>
          <div className="text-xs">
            Showing {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-4">
        {sortedTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}; 