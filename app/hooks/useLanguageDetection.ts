import { useState } from 'react'
import { 
  videoTranslationService, 
  LanguageDetectionRequest, 
  LanguageDetectionResponse,
  SupportedLanguage 
} from '@/app/lib/api/videoTranslationService'

export interface UseLanguageDetectionReturn {
  detectLanguage: (request: LanguageDetectionRequest) => Promise<LanguageDetectionResponse | null>
  getSupportedLanguages: () => Promise<SupportedLanguage[]>
  isLoading: boolean
  error: string | null
  supportedLanguages: SupportedLanguage[]
}

export function useLanguageDetection(): UseLanguageDetectionReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supportedLanguages, setSupportedLanguages] = useState<SupportedLanguage[]>([])

  const detectLanguage = async (request: LanguageDetectionRequest): Promise<LanguageDetectionResponse | null> => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await videoTranslationService.detectLanguage(request)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to detect language')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getSupportedLanguages = async (): Promise<SupportedLanguage[]> => {
    try {
      setIsLoading(true)
      setError(null)
      const languages = await videoTranslationService.getSupportedLanguages()
      setSupportedLanguages(languages)
      return languages
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch supported languages')
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return {
    detectLanguage,
    getSupportedLanguages,
    isLoading,
    error,
    supportedLanguages
  }
}
