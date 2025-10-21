import { apiClient } from '../api'

export interface SubtitleExportRequest {
  jobId: string
  format: 'srt' | 'ass' | 'vtt'
  balanced?: boolean
}

export interface SubtitleImportRequest {
  jobId: string
  file: File
  format: 'srt' | 'ass' | 'vtt'
}

export interface SubtitleExportResponse {
  success: boolean
  downloadUrl?: string
  message?: string
}

export interface SubtitleImportResponse {
  success: boolean
  message?: string
  subtitleId?: string
}

class SubtitleService {
  private baseUrl = '/subtitles'

  // Export subtitle
  async exportSubtitle(request: SubtitleExportRequest): Promise<SubtitleExportResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/export`, {
        jobId: request.jobId,
        format: request.format,
        balanced: request.balanced || false,
      })

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Export phụ đề thất bại')
    }
  }

  // Import subtitle
  async importSubtitle(request: SubtitleImportRequest): Promise<SubtitleImportResponse> {
    try {
      const formData = new FormData()
      formData.append('file', request.file)
      formData.append('jobId', request.jobId)
      formData.append('format', request.format)

      const response = await apiClient.post(`${this.baseUrl}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Import phụ đề thất bại')
    }
  }

  // Validate subtitle file
  async validateSubtitle(file: File): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await apiClient.post(`${this.baseUrl}/validate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Validate phụ đề thất bại')
    }
  }

  // Get subtitle formats
  getSupportedFormats(): string[] {
    return ['srt', 'ass', 'vtt']
  }

  // Download subtitle file
  async downloadSubtitle(downloadUrl: string): Promise<void> {
    try {
      const response = await fetch(downloadUrl)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `subtitle.${downloadUrl.split('.').pop()}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      throw new Error('Tải xuống phụ đề thất bại')
    }
  }
}

export const subtitleService = new SubtitleService()
