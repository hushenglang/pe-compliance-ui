import { useState, useCallback } from 'react'

interface ErrorState {
  hasError: boolean
  message: string
  timestamp?: Date
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorState>({ hasError: false, message: '' })

  const handleError = useCallback((errorMessage: string) => {
    setError({
      hasError: true,
      message: errorMessage,
      timestamp: new Date()
    })
    console.error('Application Error:', errorMessage)
  }, [])

  const clearError = useCallback(() => {
    setError({ hasError: false, message: '' })
  }, [])

  const withErrorHandling = useCallback(
    <TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn) => {
      return (...args: TArgs): TReturn | undefined => {
        try {
          return fn(...args)
        } catch (err) {
          const message = err instanceof Error ? err.message : 'An unexpected error occurred'
          handleError(message)
          return undefined
        }
      }
    },
    [handleError]
  )

  return {
    error,
    handleError,
    clearError,
    withErrorHandling
  }
} 