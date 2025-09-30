import { ERROR_CODES } from '@/app/lib/config/environment'

export interface ApiError {
  errorCode: string
  message: string
  details?: any
  timestamp: string
  path: string
}

export interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  backoffFactor?: number
  retryCondition?: (error: any) => boolean
}

export class ApiErrorHandler {
  static parseError(error: any): ApiError {
    if (error.response?.data) {
      return {
        errorCode: error.response.data.errorCode || 'UNKNOWN',
        message: error.response.data.message || error.message || 'Unknown error',
        details: error.response.data.details,
        timestamp: error.response.data.timestamp || new Date().toISOString(),
        path: error.response.data.path || 'Unknown'
      }
    }

    if (error.message) {
      return {
        errorCode: 'NETWORK_ERROR',
        message: error.message,
        timestamp: new Date().toISOString(),
        path: 'Unknown'
      }
    }

    return {
      errorCode: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      timestamp: new Date().toISOString(),
      path: 'Unknown'
    }
  }

  static getUserFriendlyMessage(error: ApiError): string {
    // Check if we have a specific error code mapping
    if (ERROR_CODES[error.errorCode as keyof typeof ERROR_CODES]) {
      return ERROR_CODES[error.errorCode as keyof typeof ERROR_CODES]
    }

    // Return the original message if no mapping found
    return error.message
  }

  static shouldRetry(error: any, attempt: number, maxRetries: number): boolean {
    if (attempt >= maxRetries) return false

    // Don't retry client errors (4xx) except for specific cases
    if (error.response?.status >= 400 && error.response?.status < 500) {
      // Retry on rate limiting or temporary client errors
      return error.response.status === 429 || error.response.status === 408
    }

    // Retry on server errors (5xx)
    if (error.response?.status >= 500) return true

    // Retry on network errors
    if (!error.response) return true

    return false
  }

  static calculateDelay(attempt: number, baseDelay: number, maxDelay: number, backoffFactor: number): number {
    const delay = baseDelay * Math.pow(backoffFactor, attempt - 1)
    return Math.min(delay, maxDelay)
  }
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = ApiErrorHandler.shouldRetry
  } = options

  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === maxRetries || !retryCondition(error, attempt, maxRetries)) {
        throw error
      }

      const delay = ApiErrorHandler.calculateDelay(attempt, baseDelay, maxDelay, backoffFactor)
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

export function createErrorBoundary(error: ApiError): {
  title: string
  message: string
  action?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
} {
  const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
    // Client errors - medium severity
    '40001': 'medium',
    '40002': 'medium',
    '40003': 'medium',
    '40004': 'medium',
    '40005': 'medium',
    '40006': 'medium',
    '40007': 'medium',
    '40901': 'medium',
    
    // Server errors - high severity
    '50010': 'high',
    '50020': 'high',
    '50030': 'high',
    '50040': 'high',
    '50050': 'high',
    '50060': 'high',
    '50070': 'high',
    
    // Network errors - critical
    'NETWORK_ERROR': 'critical',
    'UNKNOWN_ERROR': 'critical'
  }

  const severity = severityMap[error.errorCode] || 'medium'

  const actionMap: Record<string, string> = {
    '40001': 'Please check your language selection',
    '40002': 'Please upload a valid file',
    '40003': 'Please choose a smaller file',
    '40004': 'Please choose a shorter video',
    '40005': 'Please check your input parameters',
    '40006': 'Please use a supported video format',
    '40007': 'Please check your video file',
    '40901': 'A similar job is already running',
    '50010': 'Please try again later',
    '50020': 'Please try again later',
    '50030': 'Please try again later',
    '50040': 'Please try again later',
    '50050': 'Please try again later',
    '50060': 'Please try again later',
    '50070': 'Please try again later',
    'NETWORK_ERROR': 'Please check your internet connection',
    'UNKNOWN_ERROR': 'Please refresh the page and try again'
  }

  return {
    title: severity === 'critical' ? 'Connection Error' : 
           severity === 'high' ? 'Processing Error' : 
           severity === 'medium' ? 'Input Error' : 'Warning',
    message: ApiErrorHandler.getUserFriendlyMessage(error),
    action: actionMap[error.errorCode],
    severity
  }
}

export function logError(error: ApiError, context?: string) {
  const errorInfo = {
    errorCode: error.errorCode,
    message: error.message,
    details: error.details,
    timestamp: error.timestamp,
    path: error.path,
    context,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
    url: typeof window !== 'undefined' ? window.location.href : 'Server'
  }

  console.error('API Error:', errorInfo)
  
  // In production, you would send this to your error tracking service
  // Example: Sentry.captureException(error, { extra: errorInfo })
}

export function handleApiError(error: any, context?: string): ApiError {
  const apiError = ApiErrorHandler.parseError(error)
  logError(apiError, context)
  return apiError
}