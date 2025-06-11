import { cn } from '@/lib/utils';
import { ApiError } from '@/types/ui';
import React from 'react';

/**
 * Error message component props
 */
interface ErrorMessageProps {
  /** Error object or message string */
  error: ApiError | string | Error;
  /** Visual variant */
  variant?: 'inline' | 'banner' | 'card' | 'toast';
  /** Size of the error message */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show retry button */
  showRetry?: boolean;
  /** Retry function */
  onRetry?: () => void;
  /** Dismiss function */
  onDismiss?: () => void;
  /** Custom className */
  className?: string;
  /** Whether to show error details */
  showDetails?: boolean;
}

/**
 * Error Message Component
 * 
 * A comprehensive error display component with multiple variants,
 * retry functionality, and user-friendly error formatting.
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  variant = 'inline',
  size = 'md',
  showRetry = false,
  onRetry,
  onDismiss,
  className = '',
  showDetails = false
}) => {
  /**
   * Format error into consistent structure
   */
  const formatError = (err: ApiError | string | Error): ApiError => {
    if (typeof err === 'string') {
      return { message: err };
    }
    
    if (err instanceof Error) {
      return { 
        message: err.message || 'An error occurred',
        code: err.name
      };
    }
    
    return { 
      ...err,
      message: err.message || 'An unexpected error occurred'
    };
  };

  const formattedError = formatError(error);

  /**
   * Get user-friendly error message
   */
  const getUserFriendlyMessage = (error: ApiError): string => {
    // Common error mappings
    const errorMappings: Record<string, string> = {
      'NETWORK_ERROR': 'Unable to connect to the server. Please check your internet connection.',
      'TIMEOUT_ERROR': 'The request took too long. Please try again.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'UNAUTHORIZED': 'You are not authorized to perform this action.',
      'FORBIDDEN': 'Access denied. You do not have permission for this action.',
      'NOT_FOUND': 'The requested resource was not found.',
      'SERVER_ERROR': 'A server error occurred. Please try again later.',
      'SERVICE_UNAVAILABLE': 'The service is temporarily unavailable. Please try again later.'
    };

    if (error.code && errorMappings[error.code]) {
      return errorMappings[error.code];
    }

    // HTTP status code mappings
    if (error.statusCode) {
      switch (error.statusCode) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Authentication required. Please log in.';
        case 403:
          return 'Access denied. You do not have permission.';
        case 404:
          return 'Resource not found.';
        case 429:
          return 'Too many requests. Please wait and try again.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service temporarily unavailable.';
        default:
          break;
      }
    }

    return error.message || 'An unexpected error occurred.';
  };

  const message = getUserFriendlyMessage(formattedError);

  const sizeClasses = {
    sm: {
      text: 'text-sm',
      icon: 'w-4 h-4',
      padding: 'p-2'
    },
    md: {
      text: 'text-base',
      icon: 'w-5 h-5',
      padding: 'p-3'
    },
    lg: {
      text: 'text-lg',
      icon: 'w-6 h-6',
      padding: 'p-4'
    }
  };

  const classes = sizeClasses[size];

  /**
   * Error icon
   */
  const errorIcon = (
    <svg
      className={cn('text-red-500 flex-shrink-0', classes.icon)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  );

  /**
   * Retry button
   */
  const retryButton = showRetry && onRetry && (
    <button
      onClick={onRetry}
      className="ml-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
    >
      Try again
    </button>
  );

  /**
   * Dismiss button
   */
  const dismissButton = onDismiss && (
    <button
      onClick={onDismiss}
      className="ml-auto text-red-400 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
      aria-label="Dismiss error"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );

  /**
   * Error details
   */
  const errorDetails = showDetails && (formattedError.code || formattedError.statusCode) && (
    <div className="mt-2 text-xs text-red-500 dark:text-red-400 opacity-75">
      {formattedError.code && <span>Error Code: {formattedError.code}</span>}
      {formattedError.statusCode && (
        <span className={formattedError.code ? 'ml-3' : ''}>
          Status: {formattedError.statusCode}
        </span>
      )}
    </div>
  );

  const baseClasses = cn(
    'flex items-start gap-3',
    classes.text,
    className
  );

  switch (variant) {
    case 'banner':
      return (
        <div className={cn(
          baseClasses,
          'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg',
          classes.padding
        )}>
          {errorIcon}
          <div className="flex-1 min-w-0">
            <p className="text-red-800 dark:text-red-200 font-medium">
              {message}
            </p>
            {errorDetails}
          </div>
          <div className="flex items-center">
            {retryButton}
            {dismissButton}
          </div>
        </div>
      );

    case 'card':
      return (
        <div className={cn(
          'bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg shadow-sm',
          classes.padding,
          className
        )}>
          <div className={baseClasses}>
            {errorIcon}
            <div className="flex-1 min-w-0">
              <h3 className="text-red-800 dark:text-red-200 font-semibold mb-1">
                Error Occurred
              </h3>
              <p className="text-red-700 dark:text-red-300">
                {message}
              </p>
              {errorDetails}
            </div>
            {dismissButton}
          </div>
          {retryButton && (
            <div className="mt-4 pt-3 border-t border-red-200 dark:border-red-800">
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      );

    case 'toast':
      return (
        <div className={cn(
          baseClasses,
          'bg-red-600 text-white rounded-lg shadow-lg',
          classes.padding
        )}>
          <svg className={cn('text-white flex-shrink-0', classes.icon)} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{message}</p>
          </div>
          {dismissButton && (
            <button
              onClick={onDismiss}
              className="ml-3 text-white hover:text-red-200 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      );

    default: // inline
      return (
        <div className={baseClasses}>
          {errorIcon}
          <div className="flex-1 min-w-0">
            <p className="text-red-600 dark:text-red-400">
              {message}
            </p>
            {errorDetails}
          </div>
          {retryButton}
          {dismissButton}
        </div>
      );
  }
}; 