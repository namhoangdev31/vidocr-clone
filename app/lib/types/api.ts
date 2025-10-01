// API Types for Video Translation (Legacy - use videoTranslationService.ts instead)
export interface CreateJobData {
  fileKey: string;
  sourceLang: string;
  targetLang: string;
  burnSub: boolean;
  subtitleFormat: 'srt' | 'ass' | 'vtt';
  voiceover: boolean;
  voiceProfile?: string;
  glossaryId?: string;
  webhookUrl?: string;
  model: string;
  aiProvider: string;
  advanced: {
    removeOriginalText: boolean;
    removeBgm: boolean;
    mergeCaption: boolean;
    mergeOpenCaption: boolean;
  };
}

export interface Job {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'canceled';
  stage: string;
  progress: number;
  message: string;
  createdAt: string;
  updatedAt: string;
  outputs?: JobOutputs;
  error?: string;
}

export interface JobOutputs {
  srtKey?: string;
  assKey?: string;
  vttKey?: string;
  mp4Key?: string;
  voiceKey?: string;
}

export interface JobProgress {
  jobId: string;
  stage: string;
  progress: number;
  message: string;
}

export interface JobComplete {
  jobId: string;
  outputs: JobOutputs;
}

export interface JobError {
  jobId: string;
  error: string;
}

export interface UploadProgress {
  sessionId: string;
  progress: {
    percentage: number;
    chunk: number;
    total: number;
  };
}

export interface UploadComplete {
  sessionId: string;
  key: string;
}

export interface UploadCancel {
  sessionId: string;
  message: string;
}

export interface PresignedUrlResponse {
  url: string;
  key: string;
}

export interface DownloadUrlResponse {
  url: string;
}

export interface Glossary {
  id: string;
  name: string;
  sourceLang: string;
  targetLang: string;
  entries: GlossaryEntry[];
}

export interface GlossaryEntry {
  source: string;
  target: string;
}

export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: 'young' | 'middle' | 'old';
  language: string;
}

export interface Speaker {
  id: string;
  name: string;
  voiceProfileId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ApiError {
  errorCode: string;
  message: string;
  status: number;
}
