'use client';

import { cn } from '@/lib/utils';
import { ConfirmationDialog as ConfirmationDialogType } from '@/types/ui';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ButtonLoading } from './Loading';

/**
 * Confirmation Dialog Component Props
 */
interface ConfirmationDialogProps extends ConfirmationDialogType {
  /** Whether the dialog is currently loading */
  loading?: boolean;
}

/**
 * Confirmation Dialog Component
 * 
 * A modal dialog for confirming destructive or important actions.
 * Includes proper focus management, keyboard navigation, and accessibility.
 */
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button by default for safety
      setTimeout(() => {
        if (variant === 'danger') {
          cancelButtonRef.current?.focus();
        } else {
          confirmButtonRef.current?.focus();
        }
      }, 100);
    }
  }, [isOpen, variant]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onCancel();
          break;
        case 'Enter':
          event.preventDefault();
          if (document.activeElement === cancelButtonRef.current) {
            onCancel();
          } else {
            onConfirm();
          }
          break;
        case 'Tab':
          // Keep focus within dialog
          event.preventDefault();
          const focusableElements = [cancelButtonRef.current, confirmButtonRef.current].filter(Boolean);
          const currentIndex = focusableElements.indexOf(document.activeElement as HTMLButtonElement);
          const nextIndex = event.shiftKey 
            ? (currentIndex - 1 + focusableElements.length) % focusableElements.length
            : (currentIndex + 1) % focusableElements.length;
          focusableElements[nextIndex]?.focus();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onConfirm, onCancel]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          iconBg: 'bg-red-100 dark:bg-red-900/20',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
          cancelButton: 'bg-white hover:bg-gray-50 focus:ring-gray-500 text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white',
          cancelButton: 'bg-white hover:bg-gray-50 focus:ring-gray-500 text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
        };
      case 'info':
        return {
          icon: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          iconBg: 'bg-blue-100 dark:bg-blue-900/20',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
          cancelButton: 'bg-white hover:bg-gray-50 focus:ring-gray-500 text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
        };
      default:
        return {
          icon: null,
          iconBg: '',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
          cancelButton: 'bg-white hover:bg-gray-50 focus:ring-gray-500 text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
        };
    }
  };

  const styles = getVariantStyles();

  if (!isOpen || typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="dialog-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          ref={dialogRef}
          className={cn(
            'relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all duration-300 sm:my-8 sm:w-full sm:max-w-lg sm:p-6',
            'animate-in zoom-in-95 slide-in-from-bottom-2 duration-300'
          )}
        >
          <div className="sm:flex sm:items-start">
            {/* Icon */}
            {styles.icon && (
              <div className={cn(
                'mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10',
                styles.iconBg
              )}>
                {styles.icon}
              </div>
            )}

            {/* Content */}
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
              <h3
                className="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                id="dialog-title"
              >
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
            <button
              ref={confirmButtonRef}
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className={cn(
                'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-colors duration-200 sm:w-auto',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                styles.confirmButton
              )}
            >
              {loading ? (
                <>
                  <ButtonLoading size="sm" className="mr-2" />
                  Loading...
                </>
              ) : (
                confirmLabel
              )}
            </button>
            <button
              ref={cancelButtonRef}
              type="button"
              disabled={loading}
              onClick={onCancel}
              className={cn(
                'mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-colors duration-200 sm:mt-0 sm:w-auto',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                styles.cancelButton
              )}
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * Hook for managing confirmation dialogs
 */
export const useConfirmationDialog = () => {
  const [dialog, setDialog] = React.useState<ConfirmationDialogType | null>(null);
  const [loading, setLoading] = React.useState(false);

  const showDialog = (config: Omit<ConfirmationDialogType, 'isOpen'>) => {
    setDialog({
      ...config,
      isOpen: true
    });
  };

  const hideDialog = () => {
    setDialog(null);
    setLoading(false);
  };

  const confirm = async (config: Omit<ConfirmationDialogType, 'isOpen' | 'onConfirm' | 'onCancel'>) => {
    return new Promise<boolean>((resolve) => {
      showDialog({
        ...config,
        onConfirm: async () => {
          setLoading(true);
          resolve(true);
          hideDialog();
        },
        onCancel: () => {
          resolve(false);
          hideDialog();
        }
      });
    });
  };

  return {
    dialog,
    loading,
    showDialog,
    hideDialog,
    confirm,
    ConfirmationDialog: dialog ? (
      <ConfirmationDialog {...dialog} loading={loading} />
    ) : null
  };
}; 