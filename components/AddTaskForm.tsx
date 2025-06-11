'use client';

import { cn, formatDateForInput, generateId } from '@/lib/utils';
import { Task, TaskPriority } from '@/types/task';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from './ui/ErrorMessage';
import { useToast } from './ui/Toast';

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
  { value: TaskPriority.LOW, label: 'Low Priority' },
  { value: TaskPriority.MEDIUM, label: 'Medium Priority' },
  { value: TaskPriority.HIGH, label: 'High Priority' },
];

/**
 * AddTaskForm Component
 */
export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onTaskCreated,
  className = '',
  initiallyCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
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

  const { addToast } = useToast();

  /**
   * Handle form submission
   */
  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

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

      addToast({
        type: 'success',
        title: 'Task Created!',
        message: `"${task.title}" has been added to your task list.`
      });

    } catch (error) {
      console.error('Error creating task:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create task');
      
      addToast({
        type: 'error',
        title: 'Failed to Create Task',
        message: error instanceof Error ? error.message : 'Failed to create task'
      });
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

  const watchedTitle = watch('title');

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
            {/* Submit Error */}
            {submitError && (
              <div className="mb-6">
                <ErrorMessage
                  error={submitError}
                  variant="banner"
                  onDismiss={() => setSubmitError(null)}
                />
              </div>
            )}

            {/* Success State */}
            {submitSuccess && (
              <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      Task created successfully!
                    </p>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      You can create another task below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title', { 
                  required: 'Title is required',
                  maxLength: { value: 100, message: 'Title must be 100 characters or less' }
                })}
                type="text"
                id="title"
                placeholder="Enter a descriptive title for your task..."
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                  errors.title ? 'border-red-500' : 'border-gray-300'
                )}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
              <p className="text-xs text-gray-500">{watchedTitle?.length || 0}/100 characters</p>
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
                  'w-full px-3 py-2 border rounded-lg shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                  errors.description ? 'border-red-500' : 'border-gray-300'
                )}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Priority and Due Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Priority Selection */}
              <div className="space-y-2">
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </label>
                <select
                  {...register('priority')}
                  id="priority"
                  className={cn(
                    'w-full px-3 py-2 border rounded-lg shadow-sm',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                    'border-gray-300'
                  )}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date
                </label>
                <input
                  {...register('dueDate', { 
                    min: { value: getMinDate(), message: 'Due date cannot be in the past' }
                  })}
                  type="date"
                  id="dueDate"
                  min={getMinDate()}
                  className={cn(
                    'w-full px-3 py-2 border rounded-lg shadow-sm',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                    errors.dueDate ? 'border-red-500' : 'border-gray-300'
                  )}
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-600">{errors.dueDate.message}</p>
                )}
              </div>
            </div>

            {/* Category Input */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <input
                {...register('category', { 
                  maxLength: { value: 50, message: 'Category must be 50 characters or less' }
                })}
                type="text"
                id="category"
                placeholder="Enter or select a category..."
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                  errors.category ? 'border-red-500' : 'border-gray-300'
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={!watchedTitle?.trim() || isSubmitting}
                className={cn(
                  'flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  watchedTitle?.trim() && !isSubmitting
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Task...
                  </div>
                ) : (
                  'Create Task'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  reset();
                  setSubmitSuccess(false);
                  setSubmitError(null);
                }}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 