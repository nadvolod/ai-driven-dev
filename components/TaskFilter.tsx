'use client';

import React from 'react';
import { TaskFilter, TaskPriority, TaskStatus } from '../types/task';

/**
 * Props interface for TaskFilter component
 */
interface TaskFilterProps {
  /** Current filter settings */
  filter: TaskFilter;
  /** Callback function when filter changes */
  onFilterChange: (filter: TaskFilter) => void;
  /** Available categories for filtering */
  availableCategories: string[];
  /** Optional className for custom styling */
  className?: string;
}

/**
 * TaskFilter Component
 * 
 * Provides filtering controls for tasks:
 * - Status filter (all, completed, pending)
 * - Priority filter (all, high, medium, low)
 * - Category filter (dynamic based on available categories)
 * - Clear filters button
 * 
 * Styling: Tailwind CSS with responsive design
 * State: Stateless component, filter state managed by parent
 */
export const TaskFilter: React.FC<TaskFilterProps> = ({
  filter,
  onFilterChange,
  availableCategories,
  className = ''
}) => {
  /**
   * Handle status filter change
   */
  const handleStatusChange = (status: TaskStatus) => {
    onFilterChange({
      ...filter,
      status
    });
  };

  /**
   * Handle priority filter change
   */
  const handlePriorityChange = (priority: TaskPriority | undefined) => {
    onFilterChange({
      ...filter,
      priority
    });
  };

  /**
   * Handle category filter change
   */
  const handleCategoryChange = (category: string | undefined) => {
    onFilterChange({
      ...filter,
      category
    });
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    onFilterChange({
      status: TaskStatus.ALL,
      priority: undefined,
      category: undefined
    });
  };

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = () => {
    return (
      filter.status !== TaskStatus.ALL ||
      filter.priority !== undefined ||
      filter.category !== undefined
    );
  };

  /**
   * Get button styling based on active state
   */
  const getButtonClasses = (isActive: boolean): string => {
    return `
      px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
      ${isActive
        ? 'bg-blue-100 text-blue-700 border-blue-200'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }
      border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    `;
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange(TaskStatus.ALL)}
              className={getButtonClasses(filter.status === TaskStatus.ALL)}
            >
              All
            </button>
            <button
              onClick={() => handleStatusChange(TaskStatus.PENDING)}
              className={getButtonClasses(filter.status === TaskStatus.PENDING)}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusChange(TaskStatus.COMPLETED)}
              className={getButtonClasses(filter.status === TaskStatus.COMPLETED)}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePriorityChange(undefined)}
              className={getButtonClasses(filter.priority === undefined)}
            >
              All
            </button>
            <button
              onClick={() => handlePriorityChange(TaskPriority.HIGH)}
              className={getButtonClasses(filter.priority === TaskPriority.HIGH)}
            >
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>High</span>
              </span>
            </button>
            <button
              onClick={() => handlePriorityChange(TaskPriority.MEDIUM)}
              className={getButtonClasses(filter.priority === TaskPriority.MEDIUM)}
            >
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>Medium</span>
              </span>
            </button>
            <button
              onClick={() => handlePriorityChange(TaskPriority.LOW)}
              className={getButtonClasses(filter.priority === TaskPriority.LOW)}
            >
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Low</span>
              </span>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        {availableCategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange(undefined)}
                className={getButtonClasses(filter.category === undefined)}
              >
                All
              </button>
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={getButtonClasses(filter.category === category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filter Summary */}
        {hasActiveFilters() && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Active filters:</span>
              <div className="flex flex-wrap gap-1">
                {filter.status !== TaskStatus.ALL && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {filter.status}
                  </span>
                )}
                {filter.priority && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {filter.priority} priority
                  </span>
                )}
                {filter.category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {filter.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 