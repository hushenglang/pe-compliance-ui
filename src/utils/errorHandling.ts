import { ApiError } from '../services/api'
import type { AppError, ErrorType } from '../types'

/**
 * Maps different error types to user-friendly messages
 */
const ERROR_MESSAGES: Record<ErrorType, string> = {
  network: 'Network connection failed. Please check your internet connection.',
  api: 'Server error occurred. Please try again later.',
  validation: 'Please check your input and try again.',
  permission: 'You do not have permission to perform this action.',
  unknown: 'An unexpected error occurred. Please try again.'
}

/**
 * Determines the error type based on the error instance
 */
export function getErrorType(error: unknown): ErrorType {
  if (error instanceof ApiError) {
    if (error.status === 403 || error.status === 401) {
      return 'permission'
    }
    if (error.status && error.status >= 500) {
      return 'api'
    }
    if (error.status === 400) {
      return 'validation'
    }
    return 'api'
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'network'
  }

  return 'unknown'
}

/**
 * Creates a standardized AppError from any error
 */
export function createAppError(error: unknown, context?: string): AppError {
  const errorType = getErrorType(error)
  
  let message = ERROR_MESSAGES[errorType]
  let details: string | undefined

  if (error instanceof ApiError) {
    // Try to extract more specific message from API error
    details = error.message
    if (error.response) {
      try {
        // This would be parsed from response if available
        message = error.message || message
      } catch {
        // Use default message if parsing fails
      }
    }
  } else if (error instanceof Error) {
    details = error.message
  }

  return {
    code: errorType,
    message: context ? `${context}: ${message}` : message,
    details,
    timestamp: new Date()
  }
}

/**
 * Formats error for display to users
 */
export function formatErrorMessage(appError: AppError): string {
  return appError.message
}

/**
 * Logs error with appropriate level based on type
 */
export function logError(error: AppError, context?: string): void {
  const logData = {
    ...error,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: error.timestamp.toISOString()
  }

  if (error.code === 'network' || error.code === 'api') {
    console.error('Application Error:', logData)
  } else {
    console.warn('Application Warning:', logData)
  }

  // In production, you might send this to an error tracking service
  // Example: sendToErrorTracking(logData)
}

/**
 * Higher-order function for consistent error handling in async operations
 */
export function withErrorHandling<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  context?: string
) {
  return async (...args: TArgs): Promise<{ data?: TReturn; error?: AppError }> => {
    try {
      const data = await fn(...args)
      return { data }
    } catch (error) {
      const appError = createAppError(error, context)
      logError(appError, context)
      return { error: appError }
    }
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        throw error
      }

      // Exponential backoff: delay = baseDelay * 2^attempt
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
} 