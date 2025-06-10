'use client';

import { cn } from '@/lib/utils';
import { CreateTaskInput, TaskPriority } from '@/types/task';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

/**
 * Form data interface that matches CreateTaskInput
 */
interface TaskFormData {
  title: string;
  description?: string;
  priority: TaskPriority;
  category?: string;
}

/**
 * Props interface for AddTaskForm component
 */
interface AddTaskFormProps {
  /** Callback function when task is created */
  onCreateTask: (task: CreateTaskInput) => Promise<void> | void;
  /** Loading state for form submission */
  loading?: boolean;
  /** Optional className for custom styling */
  className?: string;
  /** Auto-expand form (skip collapsed state) */
  autoExpand?: boolean;
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
  'Planning',
  'Research',
  'Testing',
  'Documentation',
  'Meeting',
  'Personal',
  'Work'
] as const;

/**
 * AddTaskForm Component
 * 
 * A comprehensive form for creating new tasks using React Hook Form.
 * 
 * Features:
 * - React Hook Form integration for form state management
 * - TypeScript validation with proper error handling
 * - Required title field with character limit
 * - Optional description with character limit
 * - Priority selection dropdown
 * - Optional category with autocomplete suggestions
 * - Form reset after successful submission
 * - Loading state with disabled inputs
 * - Responsive design with Tailwind CSS
 * - Focus states and error styling
 * - Collapsible/expandable interface
 */
export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onCreateTask,
  loading = false,
  className,
  autoExpand = false
}) => {
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup with validation rules
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isValid, isDirty }
  } = useForm<TaskFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      category: ''
    }
  });

  // Watch field values for character counters
  const titleValue = watch('title');
  const descriptionValue = watch('description');

  /**
   * Handle form submission
   */
  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);

             // Transform form data to CreateTaskInput
       const taskInput: CreateTaskInput = {
         title: data.title.trim(),
         ...(data.description?.trim() && { description: data.description.trim() }),
         priority: data.priority,
         ...(data.category?.trim() && { category: data.category.trim() }),
         completed: false
       };

      // Call the parent's create function
      await onCreateTask(taskInput);

      // Reset form and collapse if successful
      reset();
      if (!autoExpand) {
        setIsExpanded(false);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      // Error handling could be enhanced with toast notifications
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form cancellation
   */
  const handleCancel = () => {
    reset();
    if (!autoExpand) {
      setIsExpanded(false);
    }
  };

  /**
   * Expand form when add button is clicked
   */
  const handleExpand = () => {
    setIsExpanded(true);
  };

  // Determine loading state
  const isFormLoading = loading || isSubmitting;

  // Collapsed state (show add button)
  if (!isExpanded && !autoExpand) {
    return (
      <div className={cn('w-full', className)}>
        <button
          onClick={handleExpand}
          className="w-full p-6 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-200 flex items-center justify-center space-x-3 group"
        >
          <div className="w-6 h-6 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-medium">Add New Task</span>
        </button>
      </div>
    );
  }

  // Expanded form state
  return (
    <div className={cn('w-full', className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        {/* Form Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Create New Task</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new task to your list with details and priority
            </p>
          </div>
          {!autoExpand && (
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-5">
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              Task Title <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              disabled={isFormLoading}
              placeholder="Enter a clear, concise task title..."
              className={cn(
                'w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'transition-colors duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                errors.title 
                  ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' 
                  : 'border-border'
              )}
              {...register('title', {
                required: 'Task title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters long'
                },
                maxLength: {
                  value: 100,
                  message: 'Title must be 100 characters or less'
                },
                pattern: {
                  value: /^(?!\s*$).+/,
                  message: 'Title cannot be only whitespace'
                }
              })}
            />
            <div className="flex items-center justify-between">
              {errors.title && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.title.message}
                </p>
              )}
              <p className={cn(
                'text-xs',
                titleValue?.length > 90 ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {titleValue?.length || 0}/100 characters
              </p>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
              Description <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              disabled={isFormLoading}
              placeholder="Provide additional details about this task..."
              className={cn(
                'w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground resize-none',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'transition-colors duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                errors.description 
                  ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' 
                  : 'border-border'
              )}
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description must be 500 characters or less'
                }
              })}
            />
            <div className="flex items-center justify-between">
              {errors.description && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.description.message}
                </p>
              )}
              <p className={cn(
                'text-xs',
                (descriptionValue?.length || 0) > 450 ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {descriptionValue?.length || 0}/500 characters
              </p>
            </div>
          </div>

          {/* Priority and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Priority Field */}
            <div className="space-y-2">
              <label htmlFor="priority" className="block text-sm font-medium text-foreground">
                Priority
              </label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <select
                    id="priority"
                    disabled={isFormLoading}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border bg-background text-foreground',
                      'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                      'transition-colors duration-200',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'border-border'
                    )}
                    {...field}
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-foreground">
                Category <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <input
                id="category"
                type="text"
                disabled={isFormLoading}
                placeholder="e.g. Work, Personal, Project..."
                list="category-suggestions"
                className={cn(
                  'w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  'transition-colors duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'border-border'
                )}
                {...register('category', {
                  maxLength: {
                    value: 50,
                    message: 'Category must be 50 characters or less'
                  }
                })}
              />
              <datalist id="category-suggestions">
                {CATEGORY_SUGGESTIONS.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
              {errors.category && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          {!autoExpand && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isFormLoading}
              className="btn btn-outline"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isFormLoading || !isValid}
            className={cn(
              'btn btn-primary',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center gap-2'
            )}
          >
            {isFormLoading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <span>{isFormLoading ? 'Creating...' : 'Create Task'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}; 