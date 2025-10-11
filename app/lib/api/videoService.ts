import { config } from '../config/environment';
import {
  CreateJobRequest as CreateJobData,
  JobResponse as Job,
  PresignedUrlResponse,
  DownloadUrlResponse,
  ErrorResponse as ApiError
} from './videoTranslationService';
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
    throw new Error('Endpoint /v1/uploads/presigned is not available. See api-inventory.md');
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
    throw new Error('Multipart upload endpoints under /v1/uploads/multipart are not available. See api-inventory.md');
  }

  async createJob(jobData: CreateJobData): Promise<Job> {
    throw new Error('Endpoint /v1/videos is not available. See api-inventory.md');
  }

  async getJobStatus(jobId: string): Promise<Job> {
    throw new Error('Endpoint /v1/jobs/:jobId/status is not available. See api-inventory.md');
  }

  async cancelJob(jobId: string): Promise<void> {
    throw new Error('Endpoint /v1/videos/:jobId/cancel is not available. See api-inventory.md');
  }

  async getDownloadUrl(outputKey: string): Promise<DownloadUrlResponse> {
    throw new Error('Endpoint /v1/outputs/presigned is not available. See api-inventory.md');
  }

  async getJobs(): Promise<Job[]> {
    throw new Error('Endpoint /v1/jobs is not available. See api-inventory.md');
  }
}
