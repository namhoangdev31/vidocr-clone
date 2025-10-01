import { useState, useEffect } from 'react'
import { 
  videoTranslationService, 
  Glossary, 
  CreateGlossaryRequest, 
  GlossarySearchRequest, 
  GlossarySearchResponse 
} from '@/app/lib/api/videoTranslationService'

export interface UseGlossaryReturn {
  glossaries: Glossary[]
  isLoading: boolean
  error: string | null
  fetchGlossaries: () => Promise<void>
  createGlossary: (request: CreateGlossaryRequest) => Promise<Glossary | null>
  searchGlossary: (request: GlossarySearchRequest) => Promise<GlossarySearchResponse | null>
  isCreating: boolean
  isSearching: boolean
}

export function useGlossary(): UseGlossaryReturn {
  const [glossaries, setGlossaries] = useState<Glossary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const fetchGlossaries = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await videoTranslationService.getGlossaries()
      setGlossaries(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch glossaries')
    } finally {
      setIsLoading(false)
    }
  }

  const createGlossary = async (request: CreateGlossaryRequest): Promise<Glossary | null> => {
    try {
      setIsCreating(true)
      setError(null)
      const response = await videoTranslationService.createGlossary(request)
      setGlossaries(prev => [...prev, response])
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create glossary')
      return null
    } finally {
      setIsCreating(false)
    }
  }

  const searchGlossary = async (request: GlossarySearchRequest): Promise<GlossarySearchResponse | null> => {
    try {
      setIsSearching(true)
      setError(null)
      const response = await videoTranslationService.searchGlossary(request)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search glossary')
      return null
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    fetchGlossaries()
  }, [])

  return {
    glossaries,
    isLoading,
    error,
    fetchGlossaries,
    createGlossary,
    searchGlossary,
    isCreating,
    isSearching
  }
}
