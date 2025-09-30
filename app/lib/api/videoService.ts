import { config } from '../config/environment';
import {
  CreateJobData,
  Job,
  PresignedUrlResponse,
  DownloadUrlResponse,
  ApiError
} from '../types/api';
import { handleApiError, retryWithBackoff } from '../utils/errorHandler';

export class VideoService {
  private baseUrl: string;
  private token: string;

  constructor(token: string) {
    this.baseUrl = config.API_BASE_URL;
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json'
    };
  }

  async getPresignedUrl(fileName: string, fileType: string): Promise<PresignedUrlResponse> {
    const response = await fetch(`${this.baseUrl}/uploads/presigned`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        fileName,
        fileType,
        category: 'video'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(handleApiError({ response, data: error }).message);
    }

    return await response.json();
  }

  async uploadVideo(file: File): Promise<string> {
    try {
      // Get presigned URL
      const presignResponse = await this.getPresignedUrl(file.name, file.type);
      
      // Upload file to S3
      const uploadResponse = await fetch(presignResponse.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }
      
      return presignResponse.key;
    } catch (error) {
      console.error('Video upload error:', error);
      throw error;
    }
  }

  async uploadLargeVideo(file: File, sessionId: string, onProgress?: (progress: number) => void): Promise<string> {
    const chunkSize = config.FILE_LIMITS.CHUNK_SIZE;
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    try {
      // Initiate multipart upload
      const initiateResponse = await fetch(`${this.baseUrl}/uploads/multipart/initiate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          category: 'video'
        })
      });

      if (!initiateResponse.ok) {
        const error = await initiateResponse.json();
        throw new Error(handleApiError({ response: initiateResponse, data: error }).message);
      }

      const { key, uploadId } = await initiateResponse.json();
      const parts = [];

      // Upload chunks
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        
        // Get presigned URL for chunk
        const signResponse = await fetch(`${this.baseUrl}/uploads/multipart/sign-part`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            key,
            uploadId,
            partNumber: i + 1
          })
        });

        if (!signResponse.ok) {
          const error = await signResponse.json();
          throw new Error(handleApiError({ response: signResponse, data: error }).message);
        }

        const { url } = await signResponse.json();
        
        // Upload chunk
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          body: chunk
        });
        
        if (!uploadResponse.ok) {
          throw new Error(`Chunk ${i + 1} upload failed`);
        }
        
        parts.push({
          PartNumber: i + 1,
          ETag: uploadResponse.headers.get('ETag')
        });
        
        // Update progress
        const progress = ((i + 1) / totalChunks) * 100;
        onProgress?.(progress);
      }
      
      // Complete multipart upload
      const completeResponse = await fetch(`${this.baseUrl}/uploads/multipart/complete`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          key,
          uploadId,
          parts
        })
      });

      if (!completeResponse.ok) {
        const error = await completeResponse.json();
        throw new Error(handleApiError({ response: completeResponse, data: error }).message);
      }

      const result = await completeResponse.json();
      return result.key;
    } catch (error) {
      console.error('Large video upload error:', error);
      throw error;
    }
  }

  async createJob(jobData: CreateJobData): Promise<Job> {
    try {
      const response = await retryWithBackoff(async () => {
        return await fetch(`${this.baseUrl}/videos`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(jobData)
        });
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(handleApiError({ response, data: error }).message);
      }

      return await response.json();
    } catch (error) {
      console.error('Create job error:', error);
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<Job> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${jobId}/status`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(handleApiError({ response, data: error }).message);
      }

      return await response.json();
    } catch (error) {
      console.error('Get job status error:', error);
      throw error;
    }
  }

  async cancelJob(jobId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/videos/${jobId}/cancel`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(handleApiError({ response, data: error }).message);
      }
    } catch (error) {
      console.error('Cancel job error:', error);
      throw error;
    }
  }

  async getDownloadUrl(outputKey: string): Promise<DownloadUrlResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/outputs/presigned?key=${outputKey}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(handleApiError({ response, data: error }).message);
      }

      return await response.json();
    } catch (error) {
      console.error('Get download URL error:', error);
      throw error;
    }
  }

  async getJobs(): Promise<Job[]> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(handleApiError({ response, data: error }).message);
      }

      const data = await response.json();
      return data.jobs || [];
    } catch (error) {
      console.error('Get jobs error:', error);
      throw error;
    }
  }
}
