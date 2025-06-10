'use client';

import React, { useState } from 'react';
import { CreateTaskInput, TaskPriority } from '../types/task';

/**
 * Props interface for AddTaskForm component
 */
interface AddTaskFormProps {
  /** Callback function when task is created */
  onCreateTask: (task: CreateTaskInput) => void;
  /** Loading state for form submission */
  loading?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * Form data interface with validation state
 */
interface FormData {
  title: string;
  description: string;
  priority: TaskPriority;
  category: string;
}

/**
 * Form errors interface
 */
interface FormErrors {
  title?: string;
  description?: string;
}

/**
 * AddTaskForm Component
 * 
 * Form for creating new tasks with:
 * - Title and description inputs
 * - Priority selection
 * - Category input
 * - Form validation
 * - Loading states
 * 
 * Styling: Tailwind CSS with form styling
 * State: Local form state with validation
 */
export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onCreateTask,
  loading = false,
  className = ''
}) => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    category: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormVisible, setIsFormVisible] = useState(false);

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    // Description validation
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newTask: CreateTaskInput = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      category: formData.category.trim() || undefined,
      completed: false
    };

    onCreateTask(newTask);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      category: ''
    });
    setErrors({});
    setIsFormVisible(false);
  };

  /**
   * Handle input changes
   */
  const handleInputChange = (
    field: keyof FormData,
    value: string | TaskPriority
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  /**
   * Cancel form and reset
   */
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      category: ''
    });
    setErrors({});
    setIsFormVisible(false);
  };

  if (!isFormVisible) {
    return (
      <div className={`mb-6 ${className}`}>
        <button
          onClick={() => setIsFormVisible(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Task</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`mb-6 ${className}`}>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Create New Task</h3>
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title..."
              maxLength={100}
              className={`
                w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
              `}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter task description..."
              maxLength={500}
              rows={3}
              className={`
                w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none
                ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
              `}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Priority and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority Select */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as TaskPriority)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
              </select>
            </div>

            {/* Category Input */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g. Work, Personal..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>Create Task</span>
          </button>
        </div>
      </form>
    </div>
  );
}; 