import { useState } from 'react'
import { 
  videoTranslationService, 
  VideoPreviewRequest, 
  VideoPreviewResponse 
} from '@/app/lib/api/videoTranslationService'

export interface UseVideoPreviewReturn {
  generatePreview: (request: VideoPreviewRequest) => Promise<VideoPreviewResponse | null>
  isLoading: boolean
  error: string | null
  previewUrl: string | null
  previewInfo: VideoPreviewResponse | null
}

export function useVideoPreview(): UseVideoPreviewReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewInfo, setPreviewInfo] = useState<VideoPreviewResponse | null>(null)

  const generatePreview = async (request: VideoPreviewRequest): Promise<VideoPreviewResponse | null> => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await videoTranslationService.generateVideoPreview(request)
      setPreviewUrl(response.previewUrl)
      setPreviewInfo(response)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video preview')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generatePreview,
    isLoading,
    error,
    previewUrl,
    previewInfo
  }
}
