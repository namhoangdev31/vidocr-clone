// Environment configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhos:3000/v1'
// 103.82.36.67
// Export config object for backward compatibility
export const config = {
  API_BASE_URL,
  FILE_LIMITS: {
    MAX_SIZE: 5 * 1024 * 1024 * 1024, // 5GB
    MULTIPART_THRESHOLD: 100 * 1024 * 1024, // 100MB
    CHUNK_SIZE: 5 * 1024 * 1024, // 5MB
    SUPPORTED_FORMATS: [
      'video/mp4',
      'video/mp4v-es',
      'video/x-m4v',
      'application/mp4',
      'video/avi', 
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/webm',
      'video/mkv',
      'video/m4v'
    ]
  },
  supportedLanguages: {
    'english': 'English',
    'Vietnamese': 'Vietnamese',
    'Chinese': 'Chinese',
    'Japanese': 'Japanese',
    'Korean': 'Korean',
    'Thai': 'Thai',
    'Indonesian': 'Indonesian',
    'Malaysia': 'Malaysia',
    'Filipino': 'Filipino',
    'Spanish': 'Spanish',
    'fFrenchr': 'French'
  } as Record<string, string>,
  subtitleFormats: ['srt', 'ass', 'vtt'],
  maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
  allowedVideoTypes: [
    'video/mp4',
    'video/mp4v-es',
    'video/x-m4v',
    'application/mp4',
    'video/avi', 
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/mkv',
    'video/m4v'
  ]
}

// File upload limits
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024 * 1024, // 5GB
  MULTIPART_THRESHOLD: 100 * 1024 * 1024, // 100MB
  CHUNK_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FORMATS: [
    'video/mp4',
    'video/mp4v-es',
    'video/x-m4v',
    'application/mp4',
    'video/avi', 
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/mkv',
    'video/m4v'
  ]
}

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'tl', name: 'Filipino' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' }
]

// AI Models
export const AI_MODELS = [
  { id: 'gpt-4o-mini', name: 'ChatGPT 4.1 Giá Rẻ (1 ký tự trên dưới 1 token)', provider: 'openai' },
  { id: 'gpt-4o', name: 'ChatGPT 4o Giá Rẻ (1 ký tự trên dưới 1 token)', provider: 'openai' },
  { id: 'gpt-5', name: 'ChatGPT 5 Giá Rẻ (1 ký tự trên dưới 1 token)', provider: 'openai' },
  { id: 'gpt-4', name: 'ChatGPT 4 Giá Rẻ (1 ký tự trên dưới 8 token)', provider: 'openai' },
  { id: 'gpt-4o-mini-context', name: 'Dịch Theo Ngữ Cảnh Dài (1 ký tự dịch bằng 20 token)', provider: 'openai' },
  { id: 'o1-mini', name: 'ChatGPT o1 Mini (1 ký tự trên dưới 8 token)', provider: 'openai' },
  { id: 'o3-mini', name: 'ChatGPT o3 Mini (1 ký tự trên dưới 6 token)', provider: 'openai' },
  { id: 'gpt-4o-premium', name: 'ChatGPT 4o (1 ký tự trên dưới 12 token)', provider: 'openai' },
  { id: 'gpt-4.1-premium', name: 'ChatGPT 4.1 (1 ký tự trên dưới 12 token)', provider: 'openai' },
  { id: 'gpt-5-premium', name: 'ChatGPT 5 (1 ký tự trên dưới 12 token)', provider: 'openai' }
]

// Error codes mapping
export const ERROR_CODES = {
  // 4xx Client Errors
  '40001': 'Invalid language code',
  '40002': 'File not found',
  '40003': 'File size exceeded limit',
  '40004': 'Video duration exceeded limit',
  '40005': 'Invalid input parameters',
  '40006': 'Unsupported file format',
  '40007': 'Video validation failed',
  
  // 409 Conflict
  '40901': 'Job with same parameters already exists',
  
  // 5xx Server Errors
  '50010': 'ASR (Speech Recognition) failed',
  '50020': 'MT (Machine Translation) failed',
  '50030': 'Subtitle generation failed',
  '50040': 'Video burning failed',
  '50050': 'TTS (Text-to-Speech) failed',
  '50060': 'General processing error',
  '50070': 'AI provider unavailable'
}

// WebSocket events
export const WEBSOCKET_EVENTS = {
  // Upload events
  UPLOAD_PROGRESS: 'upload-progress',
  UPLOAD_COMPLETED: 'upload-completed',
  UPLOAD_CANCELLED: 'upload-cancelled',
  
  // Job events
  JOB_STAGE_CHANGE: 'job-stage-change',
  JOB_COMPLETED: 'job-completed',
  JOB_FAILED: 'job-failed',
  
  // Client events
  JOIN_UPLOAD_SESSION: 'join-upload-session',
  CLIENT_UPLOAD_PROGRESS: 'client-upload-progress',
  PRESIGN_PUT: 'presign-put',
  MULTIPART_INITIATE: 'multipart-initiate',
  MULTIPART_SIGN_PART: 'multipart-sign-part',
  MULTIPART_COMPLETE: 'multipart-complete'
}

// Job stages
export const JOB_STAGES = {
  QUEUED: 'queued',
  PREPARING: 'preparing',
  TRANSCRIBING: 'transcribing',
  TRANSLATING: 'translating',
  SUBBUILDING: 'subbuilding',
  DUBBING: 'dubbing',
  MIXING: 'mixing',
  RENDERING: 'rendering',
  MUXING: 'muxing',
  UPLOADING: 'uploading',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELED: 'canceled'
}

// Stage display names
export const STAGE_DISPLAY_NAMES = {
  [JOB_STAGES.QUEUED]: 'Queued',
  [JOB_STAGES.PREPARING]: 'Preparing',
  [JOB_STAGES.TRANSCRIBING]: 'Transcribing',
  [JOB_STAGES.TRANSLATING]: 'Translating',
  [JOB_STAGES.SUBBUILDING]: 'Building Subtitles',
  [JOB_STAGES.DUBBING]: 'Generating Voice',
  [JOB_STAGES.MIXING]: 'Mixing Audio',
  [JOB_STAGES.RENDERING]: 'Rendering Video',
  [JOB_STAGES.MUXING]: 'Finalizing',
  [JOB_STAGES.UPLOADING]: 'Uploading Results',
  [JOB_STAGES.COMPLETED]: 'Completed',
  [JOB_STAGES.FAILED]: 'Failed',
  [JOB_STAGES.CANCELED]: 'Canceled'
}