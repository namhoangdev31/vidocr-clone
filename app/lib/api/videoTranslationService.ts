import { API_BASE_URL } from '@/app/lib/config/environment'

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
  advanced?: {
    removeOriginalText?: boolean
    removeBgm?: boolean
    mergeCaption?: boolean
    mergeOpenCaption?: boolean
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

class VideoTranslationService {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = API_BASE_URL
    this.token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // File Upload Methods
  async getPresignedUrl(fileName: string, fileType: string, category: string = 'video'): Promise<PresignedUrlResponse> {
    const response = await fetch(`${this.baseUrl}/uploads/presigned`, {
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
    category: string = 'video'
  ): Promise<MultipartInitiateResponse> {
    const response = await fetch(`${this.baseUrl}/uploads/multipart/initiate`, {
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
    const response = await fetch(`${this.baseUrl}/uploads/multipart/sign-part`, {
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
    const response = await fetch(`${this.baseUrl}/uploads/multipart/complete`, {
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
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
    }
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
    const presignResponse = await this.getPresignedUrl(file.name, file.type, 'video')
    
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
      'video'
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
