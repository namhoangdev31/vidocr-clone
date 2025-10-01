import { useState, useEffect } from 'react'
import { videoTranslationService } from '@/app/lib/api/videoTranslationService'
import { AIModel, VoiceProfile, Glossary } from '@/app/lib/api/videoTranslationService'

export interface UseCreatePageDataReturn {
  // AI Models
  aiModels: AIModel[]
  estimateCost: (modelId: string, tokens: number) => Promise<number | null>
  isEstimating: boolean
  
  // Voice Profiles
  voiceProfiles: VoiceProfile[]
  
  // Glossaries
  glossaries: Glossary[]
  
  // Language Detection
  detectLanguage: (audioS3Key: string) => Promise<string | null>
  
  // Loading states
  isLoading: boolean
  error: string | null
}

export function useCreatePageData(): UseCreatePageDataReturn {
  const [aiModels, setAiModels] = useState<AIModel[]>([])
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([])
  const [glossaries, setGlossaries] = useState<Glossary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEstimating, setIsEstimating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load AI models, voice profiles, and glossaries in parallel
        const [modelsResponse, voiceResponse, glossariesResponse] = await Promise.all([
          videoTranslationService.getAIModels(),
          videoTranslationService.getVoiceProfiles(),
          videoTranslationService.getGlossaries()
        ])

        setAiModels(modelsResponse.models)
        setVoiceProfiles(voiceResponse.profiles)
        setGlossaries(glossariesResponse)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
        console.error('Failed to load initial data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Estimate cost function
  const estimateCost = async (modelId: string, tokens: number): Promise<number | null> => {
    try {
      setIsEstimating(true)
      setError(null)
      const result = await videoTranslationService.estimateCost(modelId, tokens)
      return result.estimatedCost
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to estimate cost')
      return null
    } finally {
      setIsEstimating(false)
    }
  }

  // Detect language function
  const detectLanguage = async (audioS3Key: string): Promise<string | null> => {
    try {
      const result = await videoTranslationService.detectLanguage({
        audioS3Key,
        model: 'gpt-4o-mini'
      })
      return result.result.language
    } catch (err) {
      console.error('Language detection failed:', err)
      return null
    }
  }

  return {
    aiModels,
    estimateCost,
    isEstimating,
    voiceProfiles,
    glossaries,
    detectLanguage,
    isLoading,
    error
  }
}
