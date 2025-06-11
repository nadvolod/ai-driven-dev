/**
 * UI and Error Handling Types
 */

/**
 * Generic API error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  statusCode?: number;
}

/**
 * Form validation error
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Loading state types
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Toast notification types
 */
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Confirmation dialog props
 */
export interface ConfirmationDialog {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Empty state configuration
 */
export interface EmptyStateConfig {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Form field state
 */
export interface FormFieldState {
  value: string;
  error: string | null;
  touched: boolean;
  isValidating?: boolean;
}

/**
 * Form state management
 */
export interface FormState<T = Record<string, any>> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
} 