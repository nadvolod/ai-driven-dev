import { cn } from '@/lib/utils';
import React from 'react';

/**
 * Empty state component props
 */
interface EmptyStateProps {
  /** Icon or illustration to display */
  icon?: React.ReactNode;
  /** Main title text */
  title: string;
  /** Description text */
  description: string;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  /** Secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
}

/**
 * Empty State Component
 * 
 * A reusable component for displaying empty states with optional
 * illustrations, actions, and customizable content.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: {
      container: 'p-6',
      icon: 'w-12 h-12 mb-3',
      title: 'text-lg font-semibold',
      description: 'text-sm',
      spacing: 'space-y-2'
    },
    md: {
      container: 'p-8',
      icon: 'w-16 h-16 mb-4',
      title: 'text-xl font-semibold',
      description: 'text-base',
      spacing: 'space-y-3'
    },
    lg: {
      container: 'p-12',
      icon: 'w-20 h-20 mb-6',
      title: 'text-2xl font-semibold',
      description: 'text-lg',
      spacing: 'space-y-4'
    }
  };

  const classes = sizeClasses[size];

  /**
   * Default task-related icon
   */
  const defaultIcon = (
    <svg
      className={cn('text-gray-400 dark:text-gray-500', classes.icon)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );

  return (
    <div
      className={cn(
        'text-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
        classes.container,
        className
      )}
    >
      <div className={cn('flex flex-col items-center', classes.spacing)}>
        {/* Icon */}
        <div className="flex justify-center">
          {icon || defaultIcon}
        </div>

        {/* Content */}
        <div className={classes.spacing}>
          <h3 className={cn('text-gray-900 dark:text-white', classes.title)}>
            {title}
          </h3>
          <p className={cn('text-gray-600 dark:text-gray-300 max-w-sm mx-auto', classes.description)}>
            {description}
          </p>
        </div>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {action && (
              <button
                onClick={action.onClick}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  action.variant === 'secondary'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                )}
              >
                {action.label}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Predefined empty state configurations
 */
export const EmptyStatePresets = {
  noTasks: {
    title: 'No tasks yet',
    description: 'Create your first task to get started with managing your workflow.',
    icon: (
      <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  },
  noResults: {
    title: 'No matching tasks found',
    description: 'Try adjusting your filters to see more tasks.',
    icon: (
      <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  allCompleted: {
    title: 'All tasks completed!',
    description: 'Great job! You can show completed tasks using the toggle above.',
    icon: (
      <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  error: {
    title: 'Something went wrong',
    description: 'We encountered an error while loading your tasks. Please try again.',
    icon: (
      <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    )
  }
}; 