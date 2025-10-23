'use client'

import { useState, useCallback } from 'react'
import { apiClient } from '@/app/lib/api'
import { VideoEditorState } from '@/app/components/video-editor/types'

export function useEditorState(ntsRequestId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveState = useCallback(async (state: VideoEditorState) => {
    if (!ntsRequestId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      await apiClient.post('/video-editor/state', {
        ntsRequestId,
        editorState: state
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save state')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [ntsRequestId])

  const loadState = useCallback(async (): Promise<VideoEditorState | null> => {
    if (!ntsRequestId) return null
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.get(`/video-editor/state/${ntsRequestId}`)
      return response.data?.editorState || null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load state')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [ntsRequestId])

  return { 
    saveState, 
    loadState, 
    isLoading, 
    error 
  }
}
