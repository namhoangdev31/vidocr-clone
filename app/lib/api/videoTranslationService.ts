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
  async getPresignedUrl(fileName: string, fileType: string, category: string = 'input'): Promise<PresignedUrlResponse> {
    const response = await fetch(`${this.baseUrl}/upload/presign/put`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        fileName,
        fileType,
        category
      })
    })

    return this.handleResponse<PresignedUrlResponse>(response)
  }

  async initiateMultipartUpload(
    fileName: string, 
    fileType: string, 
    fileSize: number, 
    category: string = 'input'
  ): Promise<MultipartInitiateResponse> {
    const response = await fetch(`${this.baseUrl}/upload/presign/multipart/initiate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        fileName,
        fileType,
        fileSize,
        category
      })
    })

    return this.handleResponse<MultipartInitiateResponse>(response)
  }

  async signMultipartPart(
    key: string, 
    uploadId: string, 
    partNumber: number
  ): Promise<MultipartSignPartResponse> {
    const response = await fetch(`${this.baseUrl}/upload/presign/multipart/sign-part`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        key,
        uploadId,
        partNumber
      })
    })

    return this.handleResponse<MultipartSignPartResponse>(response)
  }

  async completeMultipartUpload(
    key: string, 
    uploadId: string, 
    parts: Array<{ PartNumber: number; ETag: string }>
  ): Promise<{ key: string }> {
    const response = await fetch(`${this.baseUrl}/upload/presign/multipart/complete`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        key,
        uploadId,
        parts
      })
    })

    return this.handleResponse<{ key: string }>(response)
  }

  // Job Management Methods
  async createJob(jobData: CreateJobRequest): Promise<JobResponse> {
    const response = await fetch(`${this.baseUrl}/videos`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(jobData)
    })

    return this.handleResponse<JobResponse>(response)
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
    const form = new FormData()
    if (params.file) {
      form.append('file', params.file)
    }
    if (params.fileKey) {
      form.append('fileKey', params.fileKey)
    } else if (params.file) {
      const inferredKey = `inputs/${params.file.name}`
      form.append('fileKey', inferredKey)
    }
    form.append('sourceLang', params.sourceLang)
    form.append('targetLang', params.targetLang)
    form.append('model', params.model)
    form.append('aiProvider', params.aiProvider)
    form.append('subtitleFormat', params.subtitleFormat)
    form.append('burnSub', String(!!params.burnSub))
    if (typeof params.hardSub !== 'undefined') form.append('hardSub', String(!!params.hardSub))
    if (typeof params.softSub !== 'undefined') form.append('softSub', String(!!params.softSub))
    if (typeof params.voiceover !== 'undefined') form.append('voiceover', String(!!params.voiceover))
    if (typeof params.audioDubbing !== 'undefined') form.append('audioDubbing', String(!!params.audioDubbing))
    if (typeof params.audioDubbingV2 !== 'undefined') form.append('audioDubbingV2', String(!!params.audioDubbingV2))
    if (typeof params.textOnly !== 'undefined') form.append('textOnly', String(!!params.textOnly))
    if (params.voiceProfile) form.append('voiceProfile', params.voiceProfile)
    if (params.glossaryId) form.append('glossaryId', params.glossaryId)
    if (params.webhookUrl) form.append('webhookUrl', params.webhookUrl)
    if (params.advanced) form.append('advanced', JSON.stringify(params.advanced))

    const response = await fetch(`${this.baseUrl}/videos/upload`, {
      method: 'POST',
      headers: this.getMultipartHeaders(),
      body: form
    })

    return this.handleResponse<JobResponse>(response)
  }

  async getJobStatus(jobId: string): Promise<JobResponse> {
    const response = await fetch(`${this.baseUrl}/jobs/${jobId}/status`, {
      method: 'GET',
      headers: this.getHeaders()
    })

    return this.handleResponse<JobResponse>(response)
  }

  async getJobs(): Promise<JobResponse[]> {
    const response = await fetch(`${this.baseUrl}/jobs`, {
      method: 'GET',
      headers: this.getHeaders()
    })

    return this.handleResponse<JobResponse[]>(response)
  }

  async cancelJob(jobId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/videos/${jobId}/cancel`, {
      method: 'POST',
      headers: this.getHeaders()
    })

    return this.handleResponse<{ success: boolean }>(response)
  }

  // Download Methods
  async getDownloadUrl(outputKey: string): Promise<DownloadUrlResponse> {
    const response = await fetch(`${this.baseUrl}/outputs/presigned?key=${outputKey}`, {
      method: 'GET',
      headers: this.getHeaders()
    })

    return this.handleResponse<DownloadUrlResponse>(response)
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
    const response = await fetch(`${this.baseUrl}/ai-models`, {
      method: 'GET',
      headers: this.getHeaders()
    })

    return this.handleResponse<AIModelsResponse>(response)
  }

  async getRecommendedModels(params: {
    maxCost?: number
    minQuality?: number
    requiredFeatures?: string[]
  } = {}): Promise<AIModelsResponse> {
    const searchParams = new URLSearchParams()
    if (params.maxCost) searchParams.append('maxCost', params.maxCost.toString())
    if (params.minQuality) searchParams.append('minQuality', params.minQuality.toString())
    if (params.requiredFeatures) searchParams.append('requiredFeatures', params.requiredFeatures.join(','))

    const response = await fetch(`${this.baseUrl}/ai-models/recommended?${searchParams}`, {
      method: 'GET',
      headers: this.getHeaders()
    })

    return this.handleResponse<AIModelsResponse>(response)
  }

  async estimateCost(modelId: string, tokens: number): Promise<CostEstimateResponse> {
    const response = await fetch(`${this.baseUrl}/ai-models/${modelId}/estimate-cost?tokens=${tokens}`, {
      method: 'GET',
      headers: this.getHeaders()
    })

    return this.handleResponse<CostEstimateResponse>(response)
  }

  // Language Detection API Methods
  async detectLanguage(request: LanguageDetectionRequest): Promise<LanguageDetectionResponse> {
    const response = await fetch(`${this.baseUrl}/language-detection/detect`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    })

    return this.handleResponse<LanguageDetectionResponse>(response)
  }

  async getSupportedLanguages(): Promise<SupportedLanguage[]> {
    const response = await fetch(`${this.baseUrl}/language-detection/supported-languages`, {
      method: 'GET',
      headers: this.getHeaders()
    })

    return this.handleResponse<SupportedLanguage[]>(response)
  }

  // Video Preview API Methods
  async generateVideoPreview(request: VideoPreviewRequest): Promise<VideoPreviewResponse> {
    const response = await fetch(`${this.baseUrl}/video-preview/generate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    })

    return this.handleResponse<VideoPreviewResponse>(response)
  }

  // Multi-Speaker TTS API Methods
  async getVoiceProfiles(): Promise<VoiceProfilesResponse> {
    const response = await fetch(`${this.baseUrl}/multi-speaker-tts/voice-profiles`, {
      method: 'GET',
      headers: this.getHeaders()
    })

    return this.handleResponse<VoiceProfilesResponse>(response)
  }

  async generateMultiSpeakerTTS(request: MultiSpeakerTTSRequest): Promise<{ success: boolean; audioKey?: string }> {
    const response = await fetch(`${this.baseUrl}/multi-speaker-tts/generate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    })

    return this.handleResponse<{ success: boolean; audioKey?: string }>(response)
  }

  // Glossary API Methods
  async createGlossary(request: CreateGlossaryRequest): Promise<Glossary> {
    const response = await fetch(`${this.baseUrl}/glossary`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    })

    return this.handleResponse<Glossary>(response)
  }

  async getGlossaries(): Promise<Glossary[]> {
    const response = await fetch(`${this.baseUrl}/glossary`, {
      method: 'GET',
      headers: this.getHeaders()
    })

    return this.handleResponse<Glossary[]>(response)
  }

  async searchGlossary(request: GlossarySearchRequest): Promise<GlossarySearchResponse> {
    const response = await fetch(`${this.baseUrl}/glossary/search`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    })

    return this.handleResponse<GlossarySearchResponse>(response)
  }

  // Subtitle Management API Methods
  async importSubtitle(jobId: string, request: ImportSubtitleRequest): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/videos/${jobId}/import-subtitle`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    })

    return this.handleResponse<{ success: boolean }>(response)
  }

  async validateSubtitle(jobId: string, request: ValidateSubtitleRequest): Promise<{ valid: boolean; errors?: string[] }> {
    const response = await fetch(`${this.baseUrl}/videos/${jobId}/validate-subtitle`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    })

    return this.handleResponse<{ valid: boolean; errors?: string[] }>(response)
  }

  // File Upload Helper
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<string> {
    const maxSize = 100 * 1024 * 1024 // 100MB threshold for multipart

    if (file.size < maxSize) {
      return this.uploadSmallFile(file, onProgress)
    } else {
      return this.uploadLargeFile(file, onProgress)
    }
  }

  private async uploadSmallFile(file: File, onProgress?: (progress: number) => void): Promise<string> {
    // Get presigned URL
    const presignResponse = await this.getPresignedUrl(file.name, file.type, 'input')
    
    // Upload to S3
    const uploadResponse = await fetch(presignResponse.url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    })

    if (!uploadResponse.ok) {
      throw new Error('Upload failed')
    }

    onProgress?.(100)
    return presignResponse.key
  }

  private async uploadLargeFile(file: File, onProgress?: (progress: number) => void): Promise<string> {
    const chunkSize = 5 * 1024 * 1024 // 5MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize)

    // Initiate multipart upload
    const initiateResponse = await this.initiateMultipartUpload(
      file.name, 
      file.type, 
      file.size, 
      'input'
    )

    const { key, uploadId } = initiateResponse
    const parts: Array<{ PartNumber: number; ETag: string }> = []

    // Upload chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)

      // Get presigned URL for chunk
      const signResponse = await this.signMultipartPart(key, uploadId, i + 1)

      // Upload chunk
      const uploadResponse = await fetch(signResponse.url, {
        method: 'PUT',
        body: chunk
      })

      if (!uploadResponse.ok) {
        throw new Error(`Chunk ${i + 1} upload failed`)
      }

      const etag = uploadResponse.headers.get('ETag')
      if (!etag) {
        throw new Error(`No ETag received for chunk ${i + 1}`)
      }

      parts.push({
        PartNumber: i + 1,
        ETag: etag
      })

      // Update progress
      const progress = ((i + 1) / totalChunks) * 100
      onProgress?.(progress)
    }

    // Complete multipart upload
    await this.completeMultipartUpload(key, uploadId, parts)
    return key
  }
}

export const videoTranslationService = new VideoTranslationService()
