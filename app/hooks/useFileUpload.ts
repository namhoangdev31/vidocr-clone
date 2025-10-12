import { useState, useCallback } from 'react'
import { videoTranslationService } from '@/app/lib/api/videoTranslationService'
import { FILE_LIMITS } from '@/app/lib/config/environment'

export interface UseFileUploadOptions {
  onProgress?: (progress: number) => void
  onSuccess?: (fileKey: string) => void
  onError?: (error: Error) => void
}

export interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<string>
  isUploading: boolean
  uploadProgress: number
  error: string | null
  reset: () => void
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const { onProgress, onSuccess, onError } = options
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback((file: File): boolean => {
    // Check file type
    if (!FILE_LIMITS.SUPPORTED_FORMATS.includes(file.type)) {
      const errorMsg = 'Định dạng file không được hỗ trợ. Vui lòng chọn file video hợp lệ.'
      setError(errorMsg)
      onError?.(new Error(errorMsg))
      return false
    }

    // Check file size
    if (file.size > FILE_LIMITS.MAX_SIZE) {
      const errorMsg = `Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn ${Math.round(FILE_LIMITS.MAX_SIZE / (1024 * 1024 * 1024))}GB.`
      setError(errorMsg)
      onError?.(new Error(errorMsg))
      return false
    }

    return true
  }, [onError])

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    if (!validateFile(file)) {
      throw new Error(error || 'File validation failed')
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const fileKey = await videoTranslationService.uploadFile()

      onSuccess?.(fileKey)
      return fileKey
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
      throw err
    } finally {
      setIsUploading(false)
    }
  }, [validateFile, error, onProgress, onSuccess, onError])

  const reset = useCallback(() => {
    setIsUploading(false)
    setUploadProgress(0)
    setError(null)
  }, [])

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    error,
    reset
  }
}