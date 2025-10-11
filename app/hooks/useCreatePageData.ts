import { useState, useEffect } from 'react'
// Temporarily avoid backend calls until endpoints are documented in api-inventory.md
// import { videoTranslationService } from '@/app/lib/api/videoTranslationService'
import type { AIModel, VoiceProfile, Glossary } from '@/app/lib/api/videoTranslationService'
import { AI_MODELS } from '@/app/lib/config/environment'

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
    // Use local defaults only; skip calling backend until documented endpoints exist
    setIsLoading(true)
    setAiModels(AI_MODELS as unknown as AIModel[])
    setVoiceProfiles([])
    setGlossaries([])
    setIsLoading(false)
  }, [])

  // Estimate cost function
  const estimateCost = async (): Promise<number | null> => {
    // API not available; return null without errors
    return null
  }

  // Detect language function
  const detectLanguage = async (): Promise<string | null> => {
    // API not available; return null without errors
    return null
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
