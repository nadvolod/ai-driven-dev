'use client';

import { cn } from '@/lib/utils';
import { FormFieldState } from '@/types/ui';
import React, { useCallback, useEffect, useState } from 'react';

/**
 * Form field component props
 */
interface FormFieldProps {
  /** Field name/id */
  name: string;
  /** Field label */
  label: string;
  /** Field type */
  type?: 'text' | 'email' | 'password' | 'textarea' | 'date' | 'select';
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Validation function */
  validate?: (value: string) => string | null;
  /** Placeholder text */
  placeholder?: string;
  /** Help text */
  helpText?: string;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Select options (for select type) */
  options?: { value: string; label: string }[];
  /** Maximum length */
  maxLength?: number;
  /** Minimum length */
  minLength?: number;
  /** Custom className */
  className?: string;
  /** Whether to show character count */
  showCharacterCount?: boolean;
  /** Debounce delay for validation (ms) */
  validationDelay?: number;
}

/**
 * Form Field Component
 * 
 * A comprehensive form field with real-time validation, error handling,
 * and accessibility features.
 */
export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  validate,
  placeholder,
  helpText,
  required = false,
  disabled = false,
  options = [],
  maxLength,
  minLength,
  className = '',
  showCharacterCount = false,
  validationDelay = 300
}) => {
  const [fieldState, setFieldState] = useState<FormFieldState>({
    value,
    touched: false,
    isValidating: false
  });

  const [validationTimeout, setValidationTimeout] = useState<NodeJS.Timeout | null>(null);

  // Update field value when prop changes
  useEffect(() => {
    setFieldState(prev => ({ ...prev, value }));
  }, [value]);

  /**
   * Validate field value
   */
  const validateField = useCallback(async (val: string): Promise<string | null> => {
    if (!validate) return null;

    try {
      return validate(val);
    } catch (error) {
      return 'Validation error occurred';
    }
  }, [validate]);

  /**
   * Handle input change with debounced validation
   */
  const handleChange = useCallback((newValue: string) => {
    // Clear existing timeout
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }

    // Update value immediately
    onChange(newValue);
    setFieldState(prev => ({
      ...prev,
      value: newValue,
      error: undefined
    }));

    // Debounced validation
    if (validate && fieldState.touched) {
      setFieldState(prev => ({ ...prev, isValidating: true }));
      
      const timeout = setTimeout(async () => {
        const error = await validateField(newValue);
        setFieldState(prev => ({
          ...prev,
          error: error || undefined,
          isValidating: false
        }));
      }, validationDelay);

      setValidationTimeout(timeout);
    }
  }, [onChange, validate, fieldState.touched, validateField, validationTimeout, validationDelay]);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(async () => {
    setFieldState(prev => ({ ...prev, touched: true }));
    
    if (validate) {
      setFieldState(prev => ({ ...prev, isValidating: true }));
      const error = await validateField(value);
      setFieldState(prev => ({
        ...prev,
        error: error || undefined,
        isValidating: false
      }));
    }

    onBlur?.();
  }, [validate, value, validateField, onBlur]);

  /**
   * Built-in validation rules
   */
  const getBuiltInValidation = useCallback(() => {
    const rules: Array<(val: string) => string | null> = [];

    if (required) {
      rules.push((val) => !val.trim() ? `${label} is required` : null);
    }

    if (type === 'email') {
      rules.push((val) => {
        if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          return 'Please enter a valid email address';
        }
        return null;
      });
    }

    if (minLength) {
      rules.push((val) => {
        if (val && val.length < minLength) {
          return `${label} must be at least ${minLength} characters`;
        }
        return null;
      });
    }

    if (maxLength) {
      rules.push((val) => {
        if (val && val.length > maxLength) {
          return `${label} must be no more than ${maxLength} characters`;
        }
        return null;
      });
    }

    return (val: string) => {
      for (const rule of rules) {
        const error = rule(val);
        if (error) return error;
      }
      return null;
    };
  }, [required, type, minLength, maxLength, label]);

  // Combine built-in and custom validation
  const combinedValidation = useCallback((val: string) => {
    const builtInError = getBuiltInValidation()(val);
    if (builtInError) return builtInError;
    
    return validate ? validate(val) : null;
  }, [getBuiltInValidation, validate]);

  const hasError = fieldState.touched && fieldState.error;
  const isValid = fieldState.touched && !fieldState.error && !fieldState.isValidating;

  /**
   * Render input based on type
   */
  const renderInput = () => {
    const inputClasses = cn(
      'block w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      hasError
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
        : isValid
        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500',
      'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
      'placeholder-gray-500 dark:placeholder-gray-400'
    );

    const commonProps = {
      id: name,
      name,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handleChange(e.target.value),
      onBlur: handleBlur,
      placeholder,
      required,
      disabled,
      maxLength,
      'aria-invalid': hasError ? 'true' as const : 'false' as const,
      'aria-describedby': `${name}-error ${name}-help`
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            className={cn(inputClasses, 'min-h-20 resize-y')}
            rows={3}
          />
        );

      case 'select':
        return (
          <select {...commonProps} className={inputClasses}>
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            {...commonProps}
            type={type}
            className={inputClasses}
          />
        );
    }
  };

  return (
    <div className={cn('space-y-1', className)}>
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input container */}
      <div className="relative">
        {renderInput()}
        
        {/* Validation indicator */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {fieldState.isValidating && (
            <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {isValid && (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {hasError && (
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
      </div>

      {/* Character count */}
      {showCharacterCount && maxLength && (
        <div className="flex justify-end">
          <span className={cn(
            'text-xs',
            value.length > maxLength ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
          )}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <p id={`${name}-error`} className="text-sm text-red-600 dark:text-red-400" role="alert">
          {fieldState.error}
        </p>
      )}

      {/* Help text */}
      {helpText && !hasError && (
        <p id={`${name}-help`} className="text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

/**
 * Form field validation utilities
 */
export const validators = {
  required: (fieldName: string) => (value: string) => 
    !value.trim() ? `${fieldName} is required` : null,
    
  email: (value: string) => 
    value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : null,
    
  minLength: (min: number, fieldName: string) => (value: string) =>
    value && value.length < min ? `${fieldName} must be at least ${min} characters` : null,
    
  maxLength: (max: number, fieldName: string) => (value: string) =>
    value && value.length > max ? `${fieldName} must be no more than ${max} characters` : null,
    
  pattern: (regex: RegExp, message: string) => (value: string) =>
    value && !regex.test(value) ? message : null,
    
  custom: (fn: (value: string) => boolean, message: string) => (value: string) =>
    value && !fn(value) ? message : null,
    
  combine: (...validators: Array<(value: string) => string | null>) => (value: string) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  }
}; 