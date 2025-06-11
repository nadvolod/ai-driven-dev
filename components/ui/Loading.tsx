import { cn } from '@/lib/utils';
import React from 'react';

/**
 * Loading component props
 */
interface LoadingProps {
  /** Loading variant */
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  /** Size of the loading indicator */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional text to display */
  text?: string;
  /** Whether to center the loading indicator */
  center?: boolean;
  /** Custom className */
  className?: string;
  /** Whether to show a backdrop */
  backdrop?: boolean;
}

/**
 * Loading Component
 * 
 * A versatile loading indicator with multiple variants and sizes.
 * Supports accessibility features and consistent styling.
 */
export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  center = false,
  className = '',
  backdrop = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  /**
   * Spinner loading indicator
   */
  const renderSpinner = () => (
    <svg
      className={cn('animate-spin text-blue-600', sizeClasses[size])}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  /**
   * Dots loading indicator
   */
  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-blue-600 animate-bounce',
            size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );

  /**
   * Pulse loading indicator
   */
  const renderPulse = () => (
    <div
      className={cn(
        'rounded-full bg-blue-600 animate-pulse',
        sizeClasses[size]
      )}
    />
  );

  /**
   * Skeleton loading indicator
   */
  const renderSkeleton = () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  );

  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div
      className={cn(
        'flex items-center gap-3',
        center && 'justify-center',
        variant === 'skeleton' ? 'w-full' : 'w-auto',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={text || 'Loading'}
    >
      {renderLoadingIndicator()}
      {text && variant !== 'skeleton' && (
        <span className={cn('text-gray-600 dark:text-gray-300', textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  );

  if (backdrop) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

/**
 * Button Loading Component
 * 
 * Loading indicator specifically designed for buttons
 */
interface ButtonLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <svg
      className={cn('animate-spin text-current', sizeClasses[size], className)}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}; 