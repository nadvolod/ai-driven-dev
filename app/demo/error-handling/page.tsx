'use client';

import { useConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { EmptyState, EmptyStatePresets } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { FormField, validators } from '@/components/ui/FormField';
import { ButtonLoading, Loading } from '@/components/ui/Loading';
import { useToast } from '@/components/ui/Toast';
import { ApiError, LoadingState } from '@/types/ui';
import React, { useState } from 'react';

/**
 * Error Handling and UX Demo Page
 * 
 * Comprehensive showcase of all the new error handling and UX components.
 */
export default function ErrorHandlingDemoPage() {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    priority: 'medium'
  });
  const [simulatedError, setSimulatedError] = useState<ApiError | null>(null);
  const [showEmptyState, setShowEmptyState] = useState('noTasks');

  const { addToast } = useToast();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  /**
   * Demo toast notifications
   */
  const handleToastDemo = (type: 'success' | 'error' | 'warning' | 'info') => {
    const toastExamples = {
      success: {
        title: 'Success!',
        message: 'Operation completed successfully. Everything is working as expected.'
      },
      error: {
        title: 'Error Occurred',
        message: 'Something went wrong. Please try again or contact support if the problem persists.'
      },
      warning: {
        title: 'Warning',
        message: 'Please review your input. Some fields may need attention before proceeding.'
      },
      info: {
        title: 'Information',
        message: 'This is an informational message to keep you updated on the current status.'
      }
    };

    const baseToast = { type, ...toastExamples[type] };
    
    if (type === 'error') {
      addToast({
        ...baseToast,
        action: {
          label: 'Retry',
          onClick: () => addToast({
            type: 'info',
            title: 'Retry Clicked',
            message: 'This would trigger a retry action in a real application.'
          })
        }
      });
    } else {
      addToast(baseToast);
    }
  };

  /**
   * Demo confirmation dialogs
   */
  const handleConfirmationDemo = async (variant: 'danger' | 'warning' | 'info') => {
    const dialogExamples = {
      danger: {
        title: 'Delete Item',
        message: 'Are you sure you want to permanently delete this item? This action cannot be undone.',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel'
      },
      warning: {
        title: 'Unsaved Changes',
        message: 'You have unsaved changes that will be lost. Do you want to continue without saving?',
        confirmLabel: 'Continue',
        cancelLabel: 'Save Changes'
      },
      info: {
        title: 'Confirm Action',
        message: 'This action will process your request and send notifications to team members.',
        confirmLabel: 'Proceed',
        cancelLabel: 'Cancel'
      }
    };

    const confirmed = await confirm({
      variant,
      ...dialogExamples[variant]
    });

    addToast({
      type: confirmed ? 'success' : 'info',
      title: confirmed ? 'Confirmed' : 'Cancelled',
      message: confirmed 
        ? `You confirmed the ${variant} action.`
        : 'Action was cancelled by user.'
    });
  };

  /**
   * Demo loading states
   */
  const handleLoadingDemo = async () => {
    setLoadingState('loading');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Randomly succeed or fail for demo
    if (Math.random() > 0.5) {
      setLoadingState('success');
      addToast({
        type: 'success',
        title: 'Demo Completed',
        message: 'The loading demo finished successfully!'
      });
    } else {
      setLoadingState('error');
      setSimulatedError({
        message: 'Demo API call failed',
        code: 'DEMO_ERROR',
        statusCode: 500
      });
    }
  };

  /**
   * Demo form submission
   */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoadingState('loading');
    
    // Simulate form processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoadingState('success');
    addToast({
      type: 'success',
      title: 'Form Submitted',
      message: 'Your demo form has been processed successfully!'
    });
    
    // Reset form
    setFormData({ email: '', message: '', priority: 'medium' });
  };

  const isFormValid = formData.email && formData.message;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Error Handling & UX Demo
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Comprehensive showcase of professional error handling, loading states, form validation, 
          and user experience enhancements built for the task management application.
        </p>
      </div>

      {/* Toast Notifications Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Toast Notifications
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Click the buttons below to see different types of toast notifications with various features.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleToastDemo('success')}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
          >
            Success Toast
          </button>
          <button
            onClick={() => handleToastDemo('error')}
            className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
          >
            Error Toast
          </button>
          <button
            onClick={() => handleToastDemo('warning')}
            className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm font-medium"
          >
            Warning Toast
          </button>
          <button
            onClick={() => handleToastDemo('info')}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            Info Toast
          </button>
        </div>
      </div>

      {/* Confirmation Dialogs Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Confirmation Dialogs
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Test different variants of confirmation dialogs with proper focus management and accessibility.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleConfirmationDemo('danger')}
            className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
          >
            Danger Dialog
          </button>
          <button
            onClick={() => handleConfirmationDemo('warning')}
            className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm font-medium"
          >
            Warning Dialog
          </button>
          <button
            onClick={() => handleConfirmationDemo('info')}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            Info Dialog
          </button>
        </div>
      </div>

      {/* Loading States Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Loading States
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Various loading indicators for different use cases and contexts.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Loading Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Loading Variants
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Loading variant="spinner" size="md" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Spinner</span>
              </div>
              <div className="flex items-center gap-4">
                <Loading variant="dots" size="md" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Dots</span>
              </div>
              <div className="flex items-center gap-4">
                <Loading variant="pulse" size="md" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Pulse</span>
              </div>
              <div className="w-full">
                <Loading variant="skeleton" />
              </div>
            </div>
          </div>

          {/* Demo Loading Action */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Interactive Demo
            </h3>
            <div className="space-y-4">
              <button
                onClick={handleLoadingDemo}
                disabled={loadingState === 'loading'}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
              >
                {loadingState === 'loading' ? (
                  <>
                    <ButtonLoading size="sm" />
                    Processing...
                  </>
                ) : (
                  'Trigger Loading Demo'
                )}
              </button>
              
              {loadingState === 'error' && simulatedError && (
                <ErrorMessage
                  error={simulatedError}
                  variant="banner"
                  showRetry
                  onRetry={() => {
                    setLoadingState('idle');
                    setSimulatedError(null);
                  }}
                  onDismiss={() => {
                    setLoadingState('idle');
                    setSimulatedError(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Empty States Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Empty States
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Different empty state scenarios with helpful messaging and actions.
        </p>
        
        <div className="space-y-6">
          {/* Empty State Selector */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(EmptyStatePresets).map(([key]) => (
              <button
                key={key}
                onClick={() => setShowEmptyState(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  showEmptyState === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </button>
            ))}
          </div>

          {/* Empty State Display */}
          <div className="min-h-64">
            <EmptyState
              {...EmptyStatePresets[showEmptyState as keyof typeof EmptyStatePresets]}
              action={{
                label: 'Demo Action',
                onClick: () => addToast({
                  type: 'info',
                  title: 'Empty State Action',
                  message: 'This would perform the relevant action in a real application.'
                })
              }}
            />
          </div>
        </div>
      </div>

      {/* Form Validation Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Form Validation
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Real-time form validation with accessible error messages and visual feedback.
        </p>
        
        <form onSubmit={handleFormSubmit} className="space-y-6 max-w-md">
          <FormField
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
            validate={validators.combine(
              validators.required('Email is required'),
              validators.email
            )}
            placeholder="Enter your email address..."
            required
            helpText="We'll use this to send you updates"
          />

          <FormField
            name="message"
            label="Message"
            type="textarea"
            value={formData.message}
            onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
            validate={validators.combine(
              validators.required('Message is required'),
              validators.minLength(10, 'Message must be at least 10 characters')
            )}
            placeholder="Enter your message..."
            required
            maxLength={500}
            showCharacterCount
            helpText="Tell us what you think about the demo"
          />

          <FormField
            name="priority"
            label="Priority"
            type="select"
            value={formData.priority}
            onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            options={[
              { value: 'low', label: 'Low Priority' },
              { value: 'medium', label: 'Medium Priority' },
              { value: 'high', label: 'High Priority' }
            ]}
            helpText="Select the importance level"
          />

          <button
            type="submit"
            disabled={!isFormValid || loadingState === 'loading'}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            {loadingState === 'loading' ? (
              <>
                <ButtonLoading size="sm" />
                Submitting...
              </>
            ) : (
              'Submit Demo Form'
            )}
          </button>
        </form>
      </div>

      {/* Features Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Enhanced UX Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              ✅ Implemented Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Real-time form validation with debouncing</li>
              <li>• Professional error handling with user-friendly messages</li>
              <li>• Loading states for all async operations</li>
              <li>• Empty state components with helpful actions</li>
              <li>• Toast notification system with animations</li>
              <li>• Confirmation dialogs with focus management</li>
              <li>• Accessible form fields with ARIA labels</li>
              <li>• TypeScript error types and interfaces</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              🎨 UX Enhancements
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Smooth animations and transitions</li>
              <li>• Visual feedback for user actions</li>
              <li>• Consistent design language</li>
              <li>• Dark mode support</li>
              <li>• Responsive layouts</li>
              <li>• Character counters and progress indicators</li>
              <li>• Keyboard navigation support</li>
              <li>• Screen reader compatibility</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {ConfirmationDialog}
    </div>
  );
} 