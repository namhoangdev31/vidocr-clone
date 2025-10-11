import { API_BASE_URL } from '@/app/lib/config/environment'
import { tokenManager } from '@/app/lib/api'

export interface CreateJobRequest {
  fileKey: string
  sourceLang: string
  targetLang: string
  burnSub: boolean
  subtitleFormat: 'srt' | 'ass' | 'vtt'
  voiceover?: boolean
  voiceProfile?: string
  glossaryId?: string
  webhookUrl?: string
  model: string
  aiProvider: 'openai' | 'anthropic'
  softSub?: boolean
  hardSub?: boolean
  audioDubbing?: boolean
  advanced?: {
    removeOriginalText?: boolean
    removeBgm?: boolean
    mergeCaption?: boolean
    mergeOpenCaption?: boolean
    brightness?: number
    contrast?: number
  }
}

export interface JobResponse {
  id: string
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled'
  stage: string
  progress: number
  message: string
  createdAt: string
  outputs?: {
    srtKey?: string
    assKey?: string
    vttKey?: string
    mp4Key?: string
    voiceKey?: string
  }
}

export interface PresignedUrlResponse {
  url: string
  key: string
}

export interface MultipartInitiateResponse {
  key: string
  uploadId: string
}

export interface MultipartSignPartResponse {
  url: string
}

export interface DownloadUrlResponse {
  url: string
}

export interface ErrorResponse {
  errorCode: string
  message: string
  details?: any
  timestamp: string
  path: string
}

// AI Models API Types
export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  pricePer1KTokens: number
  speed: number
  quality: number
  features: string[]
  available: boolean
  estimatedProcessingTime: number
}

export interface AIModelsResponse {
  models: AIModel[]
  lastUpdated: string
}

export interface CostEstimateResponse {
  modelId: string
  estimatedTokens: number
  estimatedCost: number
  currency: string
}

// Language Detection API Types
export interface LanguageDetectionRequest {
  audioS3Key: string
  model?: string
}

export interface LanguageAlternative {
  language: string
  confidence: number
}

export interface LanguageDetectionResult {
  language: string
  languageName: string
  confidence: number
  alternatives: LanguageAlternative[]
}

export interface LanguageDetectionResponse {
  result: LanguageDetectionResult
  processingTime: number
  modelUsed: string
}

export interface SupportedLanguage {
  code: string
  name: string
  nativeName: string
}

// Video Preview API Types
export interface VideoPreviewRequest {
  videoS3Key: string
  subtitleS3Key: string
  startTime: number
  duration: number
  showSubtitles: boolean
  brightness?: number
  contrast?: number
  quality?: number
}

export interface VideoInfo {
  width: number
  height: number
  fps: number
  bitrate: string
}

export interface VideoPreviewResponse {
  previewS3Key: string
  previewUrl: string
  processingTime: number
  fileSize: number
  actualDuration: number
  videoInfo: VideoInfo
}

// Multi-Speaker TTS API Types
export interface VoiceProfile {
  id: string
  name: string
  gender: string
  language: string
  accent: string
  age: string
}

export interface VoiceProfilesResponse {
  profiles: VoiceProfile[]
}

export interface TTSSegment {
  startMs: number
  endMs: number
  text: string
  speakerId: string
}

export interface MultiSpeakerTTSRequest {
  segments: TTSSegment[]
  jobId: string
}

// Glossary API Types
export interface GlossaryEntry {
  source: string
  target: string
  priority: number
}

export interface CreateGlossaryRequest {
  name: string
  description: string
  sourceLang: string
  targetLang: string
  entries: GlossaryEntry[]
  isPublic: boolean
}

export interface Glossary {
  id: string
  name: string
  description: string
  sourceLang: string
  targetLang: string
  entries: GlossaryEntry[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface GlossarySearchRequest {
  sourceText: string
  sourceLang: string
  targetLang: string
  glossaryId: string
}

export interface GlossarySearchResponse {
  matches: GlossaryEntry[]
  confidence: number
}

// Subtitle Management API Types
export interface ImportSubtitleRequest {
  subtitleS3Key: string
  format: string
}

export interface ValidateSubtitleRequest {
  subtitleS3Key: string
  format: string
}

class VideoTranslationService {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_BASE_URL
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    const token = tokenManager.getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  private getMultipartHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json'
    }
    const token = tokenManager.getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Handle 401 Unauthorized - token expired
      if (response.status === 401) {
        // Clear tokens and redirect to login
        tokenManager.clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        throw new Error('Authentication failed. Please login again.')
      }
      
      const errorData: ErrorResponse = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // File Upload Methods
  async getPresignedUrl(): Promise<PresignedUrlResponse> {
    throw new Error('Endpoint /v1/upload/presign/put is not available. See dichtudong-clone-api/docs/api-inventory.md')
  }

  async initiateMultipartUpload(): Promise<MultipartInitiateResponse> {
    throw new Error('Endpoint /v1/upload/presign/multipart/initiate is not available. See api-inventory.md')
  }

  async signMultipartPart(): Promise<MultipartSignPartResponse> {
    throw new Error('Endpoint /v1/upload/presign/multipart/sign-part is not available. See api-inventory.md')
  }

  async completeMultipartUpload(): Promise<{ key: string }> {
    throw new Error('Endpoint /v1/upload/presign/multipart/complete is not available. See api-inventory.md')
  }

  // Job Management Methods
  async createJob(): Promise<JobResponse> {
    throw new Error('Endpoint /v1/videos is not available. See api-inventory.md')
  }

  async uploadVideoAndCreateJob(params: {
    file?: File
    fileKey?: string
    sourceLang: string
    targetLang: string
    model: string
    aiProvider: 'openai' | 'anthropic'
    subtitleFormat: 'srt' | 'ass' | 'vtt'
    burnSub: boolean
    hardSub?: boolean
    softSub?: boolean
    voiceover?: boolean
    voiceProfile?: string
    audioDubbing?: boolean
    audioDubbingV2?: boolean
    textOnly?: boolean
    glossaryId?: string
    webhookUrl?: string
    advanced?: {
      removeOriginalVoice?: boolean
      removeBgm?: boolean
      mergeCaption?: boolean
      mergeOpenCaption?: boolean
      brightness?: number
      contrast?: number
    }
  }): Promise<JobResponse> {
    throw new Error('Endpoint /v1/videos/upload is not available. See api-inventory.md')
  }

  async getJobStatus(): Promise<JobResponse> {
    throw new Error('Endpoint /v1/jobs/:jobId/status is not available. See api-inventory.md')
  }

  async getJobs(): Promise<JobResponse[]> {
    throw new Error('Endpoint /v1/jobs is not available. See api-inventory.md')
  }

  async cancelJob(): Promise<{ success: boolean }> {
    throw new Error('Endpoint /v1/videos/:jobId/cancel is not available. See api-inventory.md')
  }

  // Download Methods
  async getDownloadUrl(): Promise<DownloadUrlResponse> {
    throw new Error('Endpoint /v1/outputs/presigned is not available. See api-inventory.md')
  }

  // Utility Methods
  setToken(token: string) {
    tokenManager.setTokens(token, tokenManager.getRefreshToken() || '')
  }

  clearToken() {
    tokenManager.clearTokens()
  }

  // AI Models API Methods
  async getAIModels(): Promise<AIModelsResponse> {
    throw new Error('Endpoint /v1/ai-models is not available. See api-inventory.md')
  }

  async getRecommendedModels(params: {
    maxCost?: number
    minQuality?: number
    requiredFeatures?: string[]
  } = {}): Promise<AIModelsResponse> {
    throw new Error('Endpoint /v1/ai-models/recommended is not available. See api-inventory.md')
  }

  async estimateCost(): Promise<CostEstimateResponse> {
    throw new Error('Endpoint /v1/ai-models/:modelId/estimate-cost is not available. See api-inventory.md')
  }

  // Language Detection API Methods
  async detectLanguage(): Promise<LanguageDetectionResponse> {
    throw new Error('Endpoint /v1/language-detection/detect is not available. See api-inventory.md')
  }

  async getSupportedLanguages(): Promise<SupportedLanguage[]> {
    throw new Error('Endpoint /v1/language-detection/supported-languages is not available. See api-inventory.md')
  }

  // Video Preview API Methods
  async generateVideoPreview(): Promise<VideoPreviewResponse> {
    throw new Error('Endpoint /v1/video-preview/generate is not available. See api-inventory.md')
  }

  // Multi-Speaker TTS API Methods
  async getVoiceProfiles(): Promise<VoiceProfilesResponse> {
    throw new Error('Endpoint /v1/multi-speaker-tts/voice-profiles is not available. See api-inventory.md')
  }

  async generateMultiSpeakerTTS(): Promise<{ success: boolean; audioKey?: string }> {
    throw new Error('Endpoint /v1/multi-speaker-tts/generate is not available. See api-inventory.md')
  }

  // Glossary API Methods
  async createGlossary(): Promise<Glossary> {
    throw new Error('Endpoint /v1/glossary (POST) is not available. See api-inventory.md')
  }

  async getGlossaries(): Promise<Glossary[]> {
    throw new Error('Endpoint /v1/glossary (GET) is not available. See api-inventory.md')
  }

  async searchGlossary(): Promise<GlossarySearchResponse> {
    throw new Error('Endpoint /v1/glossary/search is not available. See api-inventory.md')
  }

  // Subtitle Management API Methods
  async importSubtitle(): Promise<{ success: boolean }> {
    throw new Error('Endpoint /v1/videos/:jobId/import-subtitle is not available. See api-inventory.md')
  }

  async validateSubtitle(): Promise<{ valid: boolean; errors?: string[] }> {
    throw new Error('Endpoint /v1/videos/:jobId/validate-subtitle is not available. See api-inventory.md')
  }

  // File Upload Helper
  async uploadFile(): Promise<string> {
    const maxSize = 100 * 1024 * 1024 // 100MB threshold for multipart
    throw new Error('Upload endpoints are not available. See api-inventory.md')
  }

  private async uploadSmallFile(): Promise<string> { throw new Error('Not available') }

  private async uploadLargeFile(): Promise<string> { throw new Error('Not available') }
}

export const videoTranslationService = new VideoTranslationService()
