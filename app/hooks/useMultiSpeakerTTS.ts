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
  isGenerating: boolean
  ttsProgress: number
  resultAudioUrl: string | null
  fetchVoiceProfiles: () => Promise<void>
  generateTTS: (request: MultiSpeakerTTSRequest) => Promise<{ success: boolean; audioKey?: string } | null>
}

export function useMultiSpeakerTTS(): UseMultiSpeakerTTSReturn {
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [ttsProgress, setTtsProgress] = useState(0)
  const [resultAudioUrl, setResultAudioUrl] = useState<string | null>(null)

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
      setTtsProgress(0)
      setResultAudioUrl(null)
      
      const response = await videoTranslationService.generateMultiSpeakerTTS(request)
      
      if (response.success && response.audioKey) {
        // Start polling for TTS completion
        const pollTTS = async () => {
          try {
            const checkResponse = await videoTranslationService.checkTTSTask(response.audioKey!)
            setTtsProgress(checkResponse.data.progress || 0)
            
            if (checkResponse.data.status === 'finished' || checkResponse.data.progress === 100) {
              const audioUrl = await videoTranslationService.downloadTTSAudio(response.audioKey!)
              setResultAudioUrl(audioUrl)
              setIsGenerating(false)
            } else if (checkResponse.data.status === 'failed') {
              setError('TTS generation failed')
              setIsGenerating(false)
            } else {
              // Continue polling
              setTimeout(pollTTS, 2000)
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to check TTS status')
            setIsGenerating(false)
          }
        }
        
        // Start polling after a short delay
        setTimeout(pollTTS, 1000)
      }
      
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate TTS')
      return null
    } finally {
      // Don't set isGenerating to false here as we're polling
    }
  }

  useEffect(() => {
    fetchVoiceProfiles()
  }, [])

  return {
    voiceProfiles,
    isLoading,
    error,
    isGenerating,
    ttsProgress,
    resultAudioUrl,
    fetchVoiceProfiles,
    generateTTS
  }
}
