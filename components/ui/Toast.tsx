'use client';

import { cn } from '@/lib/utils';
import { Toast } from '@/types/ui';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Toast context type
 */
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

/**
 * Toast context
 */
const ToastContext = createContext<ToastContextType | null>(null);

/**
 * Toast hook
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Toast provider component
 */
interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    // Auto-remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

/**
 * Toast container component
 */
const ToastContainer: React.FC = () => {
  const { toasts } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
        />
      ))}
    </div>,
    document.body
  );
};

/**
 * Individual toast item component
 */
interface ToastItemProps {
  toast: Toast;
  index: number;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, index }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 200);
  }, [toast.id, removeToast]);

  const getToastIcon = () => {
    const iconClasses = "w-5 h-5 flex-shrink-0";
    
    switch (toast.type) {
      case 'success':
        return (
          <svg className={cn(iconClasses, "text-green-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className={cn(iconClasses, "text-red-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={cn(iconClasses, "text-yellow-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className={cn(iconClasses, "text-blue-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getToastColors = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div
      className={cn(
        'pointer-events-auto relative overflow-hidden rounded-lg border shadow-lg transition-all duration-300 ease-out',
        'max-w-sm w-full',
        getToastColors(),
        isVisible && !isRemoving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      )}
      style={{
        transform: `translateY(${index * -8}px)`,
        zIndex: 1000 - index
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {getToastIcon()}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {toast.title}
            </h3>
            {toast.message && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {toast.message}
              </p>
            )}
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                {toast.action.label}
              </button>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper functions for common toast types
 */
export const toast = {
  success: (title: string, message?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast();
    addToast({
      type: 'success',
      title,
      ...(message && { message }),
      ...options
    });
  },
  error: (title: string, message?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast();
    addToast({
      type: 'error',
      title,
      duration: options?.duration ?? 8000, // Longer duration for errors
      ...(message && { message }),
      ...options
    });
  },
  warning: (title: string, message?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast();
    addToast({
      type: 'warning',
      title,
      ...(message && { message }),
      ...options
    });
  },
  info: (title: string, message?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast();
    addToast({
      type: 'info',
      title,
      ...(message && { message }),
      ...options
    });
  }
}; 