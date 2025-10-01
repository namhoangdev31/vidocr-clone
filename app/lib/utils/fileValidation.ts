import { config } from '../config/environment';
// ValidationResult interface moved here to avoid circular dependencies
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateVideoFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  
  // Check file size
  if (file.size > config.maxFileSize) {
    errors.push(`File size exceeds ${config.maxFileSize / (1024 * 1024 * 1024)}GB limit`);
  }
  
  // Check file type
  if (!config.allowedVideoTypes.includes(file.type)) {
    errors.push(`Unsupported file format. Allowed formats: ${config.allowedVideoTypes.join(', ')}`);
  }
  
  // Check file name
  if (!file.name || file.name.trim() === '') {
    errors.push('File name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateJobData = (data: any): ValidationResult => {
  const errors: string[] = [];
  
  // Required fields
  if (!data.fileKey) {
    errors.push('File key is required');
  }
  
  if (!data.sourceLang) {
    errors.push('Source language is required');
  }
  
  if (!data.targetLang) {
    errors.push('Target language is required');
  }
  
  // Language validation
  if (data.sourceLang && !Object.keys(config.supportedLanguages).includes(data.sourceLang)) {
    errors.push('Invalid source language');
  }
  
  if (data.targetLang && !Object.keys(config.supportedLanguages).includes(data.targetLang)) {
    errors.push('Invalid target language');
  }
  
  // Subtitle format validation
  if (data.subtitleFormat && !config.subtitleFormats.includes(data.subtitleFormat)) {
    errors.push(`Invalid subtitle format. Allowed formats: ${config.subtitleFormats.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getFileSizeDisplay = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isVideoFile = (filename: string): boolean => {
  const extension = getFileExtension(filename);
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'qt'];
  return videoExtensions.includes(extension);
};
