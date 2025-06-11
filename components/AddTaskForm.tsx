'use client';

import { cn, formatDateForInput, generateId } from '@/lib/utils';
import { Task, TaskPriority } from '@/types/task';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

/**
 * Form data interface for task creation
 */
interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  category: string;
  dueDate: string; // HTML date input uses string format (YYYY-MM-DD)
}

/**
 * Props interface for AddTaskForm component
 */
export interface AddTaskFormProps {
  /** Callback function when a task is successfully created */
  onTaskCreated: (task: Task) => void;
  /** Optional className for custom styling */
  className?: string;
  /** Whether the form is in a collapsed state initially */
  initiallyCollapsed?: boolean;
}

/**
 * Priority options for the select dropdown
 */
const PRIORITY_OPTIONS = [
  { value: TaskPriority.LOW, label: 'Low Priority', color: 'text-green-600' },
  { value: TaskPriority.MEDIUM, label: 'Medium Priority', color: 'text-yellow-600' },
  { value: TaskPriority.HIGH, label: 'High Priority', color: 'text-red-600' },
] as const;

/**
 * Common category suggestions
 */
const CATEGORY_SUGGESTIONS = [
  'Development',
  'Design',
  'Marketing',
  'Testing',
  'Documentation',
  'Meeting',
  'Research',
  'Planning',
  'Review',
  'Deployment'
] as const;

/**
 * AddTaskForm Component
 * 
 * A comprehensive form component for creating new tasks with:
 * - Title input with validation (required, max 100 characters)
 * - Description textarea (optional, max 500 characters)
 * - Priority selection (required)
 * - Category input with autocomplete suggestions (optional)
 * - Due date picker (optional)
 * - Form validation with error handling
 * - Collapsible interface for space efficiency
 * - Loading states and success feedback
 * - Accessibility features and keyboard navigation
 */
export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onTaskCreated,
  className = '',
  initiallyCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid }
  } = useForm<TaskFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      category: '',
      dueDate: ''
    }
  });

  // Watch form values for character counts and validation
  const watchedTitle = watch('title');
  const watchedDescription = watch('description');
  const watchedCategory = watch('category');

  /**
   * Handle form submission
   */
  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Create task object
      const now = new Date();
      const task: Task = {
        id: generateId(),
        title: data.title.trim(),
        completed: false,
        priority: data.priority,
        createdAt: now,
        updatedAt: now,
        ...(data.description.trim() && { description: data.description.trim() }),
        ...(data.category.trim() && { category: data.category.trim() }),
        ...(data.dueDate && { dueDate: new Date(data.dueDate) })
      };

      // Call the callback function
      onTaskCreated(task);

      // Show success state
      setSubmitSuccess(true);
      
      // Reset form after a short delay
      setTimeout(() => {
        reset();
        setSubmitSuccess(false);
        if (initiallyCollapsed) {
          setIsCollapsed(true);
        }
      }, 1500);

    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form toggle
   */
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      // Reset form when collapsing
      reset();
      setSubmitSuccess(false);
    }
  };

  /**
   * Get minimum date for due date input (today)
   */
  const getMinDate = (): string => {
    return formatDateForInput(new Date());
  };

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm', className)}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={handleToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Task</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isCollapsed ? 'Click to expand form' : 'Create a new task with details'}
            </p>
          </div>
        </div>
        
        <button
          type="button"
          className={cn(
            'p-2 rounded-lg transition-all duration-200',
            'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
            'hover:bg-gray-100 dark:hover:bg-gray-700',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          )}
          aria-label={isCollapsed ? 'Expand form' : 'Collapse form'}
        >
          <svg 
            className={cn('w-5 h-5 transition-transform duration-200', !isCollapsed && 'rotate-180')} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Form Content */}
      <div className={cn(
        'overflow-hidden transition-all duration-300 ease-in-out',
        isCollapsed ? 'max-h-0' : 'max-h-[800px]'
      )}>
        <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 1, message: 'Title cannot be empty' },
                  maxLength: { value: 100, message: 'Title must be 100 characters or less' },
                  pattern: {
                    value: /^(?!\s*$).+/,
                    message: 'Title cannot be only whitespace'
                  }
                })}
                type="text"
                id="title"
                placeholder="Enter a descriptive title for your task..."
                className={cn(
                  'w-full px-4 py-3 rounded-lg border transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
                  errors.title
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                )}
                aria-describedby={errors.title ? 'title-error' : 'title-help'}
              />
              <div className="flex justify-between items-center">
                <div className="text-xs space-y-1">
                  {errors.title && (
                    <p id="title-error" className="text-red-600 dark:text-red-400">
                      {errors.title.message}
                    </p>
                  )}
                  {!errors.title && (
                    <p id="title-help" className="text-gray-500 dark:text-gray-400">
                      Choose a clear, specific title for your task
                    </p>
                  )}
                </div>
                <span className={cn(
                  'text-xs tabular-nums',
                  watchedTitle?.length > 90 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-500 dark:text-gray-400'
                )}>
                  {watchedTitle?.length || 0}/100
                </span>
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                {...register('description', {
                  maxLength: { value: 500, message: 'Description must be 500 characters or less' }
                })}
                id="description"
                rows={3}
                placeholder="Add more details about this task..."
                className={cn(
                  'w-full px-4 py-3 rounded-lg border transition-all duration-200 resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
                  errors.description
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                )}
                aria-describedby={errors.description ? 'description-error' : 'description-help'}
              />
              <div className="flex justify-between items-center">
                <div className="text-xs space-y-1">
                  {errors.description && (
                    <p id="description-error" className="text-red-600 dark:text-red-400">
                      {errors.description.message}
                    </p>
                  )}
                  {!errors.description && (
                    <p id="description-help" className="text-gray-500 dark:text-gray-400">
                      Optional: Provide additional context or requirements
                    </p>
                  )}
                </div>
                <span className={cn(
                  'text-xs tabular-nums',
                  watchedDescription?.length > 450 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-500 dark:text-gray-400'
                )}>
                  {watchedDescription?.length || 0}/500
                </span>
              </div>
            </div>

            {/* Priority and Due Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority Selection */}
              <div className="space-y-2">
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('priority', { required: 'Priority is required' })}
                  id="priority"
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'dark:bg-gray-700 dark:text-white',
                    errors.priority
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  )}
                  aria-describedby={errors.priority ? 'priority-error' : 'priority-help'}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.priority && (
                  <p id="priority-error" className="text-xs text-red-600 dark:text-red-400">
                    {errors.priority.message}
                  </p>
                )}
                {!errors.priority && (
                  <p id="priority-help" className="text-xs text-gray-500 dark:text-gray-400">
                    Select the task urgency level
                  </p>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date
                </label>
                <input
                  {...register('dueDate')}
                  type="date"
                  id="dueDate"
                  min={getMinDate()}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'dark:bg-gray-700 dark:text-white dark:color-scheme-dark',
                    'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  )}
                  aria-describedby="dueDate-help"
                />
                <p id="dueDate-help" className="text-xs text-gray-500 dark:text-gray-400">
                  Optional: Set a target completion date
                </p>
              </div>
            </div>

            {/* Category Input */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <div className="relative">
                <input
                  {...register('category', {
                    maxLength: { value: 50, message: 'Category must be 50 characters or less' }
                  })}
                  type="text"
                  id="category"
                  list="category-suggestions"
                  placeholder="Enter or select a category..."
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
                    errors.category
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  )}
                  aria-describedby={errors.category ? 'category-error' : 'category-help'}
                />
                <datalist id="category-suggestions">
                  {CATEGORY_SUGGESTIONS.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs space-y-1">
                  {errors.category && (
                    <p id="category-error" className="text-red-600 dark:text-red-400">
                      {errors.category.message}
                    </p>
                  )}
                  {!errors.category && (
                    <p id="category-help" className="text-gray-500 dark:text-gray-400">
                      Optional: Organize tasks by project or type
                    </p>
                  )}
                </div>
                <span className={cn(
                  'text-xs tabular-nums',
                  watchedCategory?.length > 45 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-500 dark:text-gray-400'
                )}>
                  {watchedCategory?.length || 0}/50
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  'disabled:cursor-not-allowed',
                  submitSuccess
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : isValid && !isSubmitting
                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating Task...</span>
                  </span>
                ) : submitSuccess ? (
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Task Created!</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Task</span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 