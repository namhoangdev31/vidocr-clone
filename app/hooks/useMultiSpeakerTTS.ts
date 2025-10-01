import { useState, useEffect } from 'react'
import { 
  videoTranslationService, 
  VoiceProfile, 
  MultiSpeakerTTSRequest 
} from '@/app/lib/api/videoTranslationService'

export interface UseMultiSpeakerTTSReturn {
  voiceProfiles: VoiceProfile[]
  isLoading: boolean
  error: string | null
  fetchVoiceProfiles: () => Promise<void>
  generateTTS: (request: MultiSpeakerTTSRequest) => Promise<{ success: boolean; audioKey?: string } | null>
  isGenerating: boolean
}

export function useMultiSpeakerTTS(): UseMultiSpeakerTTSReturn {
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchVoiceProfiles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await videoTranslationService.getVoiceProfiles()
      setVoiceProfiles(response.profiles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch voice profiles')
    } finally {
      setIsLoading(false)
    }
  }

  const generateTTS = async (request: MultiSpeakerTTSRequest): Promise<{ success: boolean; audioKey?: string } | null> => {
    try {
      setIsGenerating(true)
      setError(null)
      const response = await videoTranslationService.generateMultiSpeakerTTS(request)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate TTS')
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    fetchVoiceProfiles()
  }, [])

  return {
    voiceProfiles,
    isLoading,
    error,
    fetchVoiceProfiles,
    generateTTS,
    isGenerating
  }
}
