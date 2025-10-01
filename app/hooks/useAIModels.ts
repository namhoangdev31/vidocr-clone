import { useState, useEffect } from 'react'
import { videoTranslationService, AIModel, CostEstimateResponse } from '@/app/lib/api/videoTranslationService'

export interface UseAIModelsOptions {
  autoFetch?: boolean
  maxCost?: number
  minQuality?: number
  requiredFeatures?: string[]
}

export interface UseAIModelsReturn {
  models: AIModel[]
  recommendedModels: AIModel[]
  isLoading: boolean
  error: string | null
  fetchModels: () => Promise<void>
  fetchRecommended: (params?: {
    maxCost?: number
    minQuality?: number
    requiredFeatures?: string[]
  }) => Promise<void>
  estimateCost: (modelId: string, tokens: number) => Promise<CostEstimateResponse | null>
  isEstimating: boolean
}

export function useAIModels(options: UseAIModelsOptions = {}): UseAIModelsReturn {
  const { autoFetch = true, maxCost, minQuality, requiredFeatures } = options
  
  const [models, setModels] = useState<AIModel[]>([])
  const [recommendedModels, setRecommendedModels] = useState<AIModel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEstimating, setIsEstimating] = useState(false)

  const fetchModels = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await videoTranslationService.getAIModels()
      setModels(response.models)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AI models')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRecommended = async (params?: {
    maxCost?: number
    minQuality?: number
    requiredFeatures?: string[]
  }) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await videoTranslationService.getRecommendedModels(params)
      setRecommendedModels(response.models)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommended models')
    } finally {
      setIsLoading(false)
    }
  }

  const estimateCost = async (modelId: string, tokens: number): Promise<CostEstimateResponse | null> => {
    try {
      setIsEstimating(true)
      setError(null)
      const response = await videoTranslationService.estimateCost(modelId, tokens)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to estimate cost')
      return null
    } finally {
      setIsEstimating(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchModels()
      if (maxCost || minQuality || requiredFeatures) {
        fetchRecommended({ maxCost, minQuality, requiredFeatures })
      }
    }
  }, [autoFetch, maxCost, minQuality, requiredFeatures])

  return {
    models,
    recommendedModels,
    isLoading,
    error,
    fetchModels,
    fetchRecommended,
    estimateCost,
    isEstimating
  }
}
