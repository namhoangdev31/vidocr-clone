# Next.js Frontend Integration Guide - Video Translation API

## 📋 Tổng quan

Tài liệu này hướng dẫn chi tiết cách tích hợp Video Translation API với Next.js frontend, bao gồm API endpoints, WebSocket integration, file upload process và real-time progress tracking.

## 🚀 Cấu hình cơ bản

### Base URL
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dichtudong-clone-api.onrender.com';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://dichtudong-clone-api.onrender.com';
```

### Headers mặc định
```javascript
const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
});
```

## 🔐 Authentication

### JWT Token Management
```javascript
// utils/auth.js
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
};
```

## 📤 S3-Upload Service Integration

### 1. Presigned URL Generation

#### POST `/upload/presign/put` - Lấy presigned URL cho upload
```javascript
const getPresignedUrl = async (file) => {
  const response = await fetch(`${API_BASE_URL}/upload/presign/put`, {
    method: 'POST',
    headers: getHeaders(getAuthToken()),
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      category: 'videos'
    })
  });
  return response.json();
};

// Response
{
  "success": true,
  "data": {
    "url": "https://s3.amazonaws.com/bucket/inputs/video123.mp4?signature=...",
    "key": "inputs/video123.mp4",
    "expiresIn": 3600
  }
}
```

#### POST `/upload/presign/multipart/initiate` - Khởi tạo multipart upload
```javascript
const initiateMultipartUpload = async (file) => {
  const response = await fetch(`${API_BASE_URL}/upload/presign/multipart/initiate`, {
    method: 'POST',
    headers: getHeaders(getAuthToken()),
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      category: 'videos'
    })
  });
  return response.json();
};

// Response
{
  "success": true,
  "data": {
    "key": "inputs/video123.mp4",
    "uploadId": "upload_abc123",
    "expiresIn": 3600
  }
}
```

#### POST `/upload/presign/multipart/sign-part` - Lấy presigned URL cho chunk
```javascript
const getPresignedPartUrl = async (key, uploadId, partNumber) => {
  const response = await fetch(`${API_BASE_URL}/upload/presign/multipart/sign-part`, {
    method: 'POST',
    headers: getHeaders(getAuthToken()),
    body: JSON.stringify({
      key,
      uploadId,
      partNumber
    })
  });
  return response.json();
};
```

#### POST `/upload/presign/multipart/complete` - Hoàn tất multipart upload
```javascript
const completeMultipartUpload = async (key, uploadId, parts) => {
  const response = await fetch(`${API_BASE_URL}/upload/presign/multipart/complete`, {
    method: 'POST',
    headers: getHeaders(getAuthToken()),
    body: JSON.stringify({
      key,
      uploadId,
      parts
    })
  });
  return response.json();
};
```

### 2. File Upload với S3-Upload Service

```javascript
// utils/s3Upload.js
export const uploadFileToS3 = async (file, onProgress) => {
  try {
    // 1. Lấy presigned URL
    const presignResponse = await getPresignedUrl(file);
    const { url, key } = presignResponse.data;

    // 2. Upload file lên S3
    const uploadResponse = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }

    return { key, success: true };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

export const uploadLargeFileToS3 = async (file, onProgress) => {
  try {
    // 1. Khởi tạo multipart upload
    const initiateResponse = await initiateMultipartUpload(file);
    const { key, uploadId } = initiateResponse.data;

    // 2. Chia file thành chunks
    const chunkSize = 5 * 1024 * 1024; // 5MB
    const chunks = Math.ceil(file.size / chunkSize);
    const parts = [];

    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      // 3. Lấy presigned URL cho chunk
      const signResponse = await getPresignedPartUrl(key, uploadId, i + 1);
      const { url } = signResponse.data;

      // 4. Upload chunk
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: chunk
      });

      const etag = uploadResponse.headers.get('ETag');
      parts.push({ PartNumber: i + 1, ETag: etag });

      // 5. Update progress
      onProgress(Math.round(((i + 1) / chunks) * 100));
    }

    // 6. Hoàn tất multipart upload
    const completeResponse = await completeMultipartUpload(key, uploadId, parts);
    return { key, success: true };
  } catch (error) {
    console.error('Multipart upload error:', error);
    throw error;
  }
};
```

## ⚙️ Advanced Job Options

### 1. Audio Processing Options

```javascript
const audioOptions = {
  removeOriginalVoice: true,    // Xóa giọng gốc
  removeBgm: false,            // Xóa nhạc nền
  audioDubbing: true,          // Lồng tiếng
  audioDubbingV2: false        // Lồng tiếng V2 (nâng cao)
};
```

### 2. Subtitle Processing Options

```javascript
const subtitleOptions = {
  softSub: true,               // Subtitle mềm
  hardSub: false,              // Burn subtitle vào video
  textOnly: false,             // Chỉ tạo subtitle
  subtitleFormat: 'srt',       // Format: srt, ass, vtt
  mergeCaption: true,          // Gộp caption
  mergeOpenCaption: false      // Gộp open caption
};
```

### 3. Complete Job Options

```javascript
const completeJobOptions = {
  // Basic options
  targetLang: 'vi',            // Required
  sourceLang: 'en',            // Optional
  
  // Processing options
  softSub: true,               // Subtitle mềm
  hardSub: false,              // Burn subtitle vào video
  textOnly: false,             // Chỉ tạo subtitle
  audioDubbing: true,          // Lồng tiếng
  audioDubbingV2: false,       // Lồng tiếng V2
  
  // Format options
  subtitleFormat: 'srt',       // srt, ass, vtt
  voiceover: false,            // Legacy voiceover
  voiceProfile: 'female_1',    // Voice profile
  
  // Advanced options
  advanced: {
    removeOriginalVoice: true,  // Xóa giọng gốc
    removeBgm: false,          // Xóa nhạc nền
    mergeCaption: true,        // Gộp caption
    mergeOpenCaption: false    // Gộp open caption
  },
  
  // AI options
  model: 'gpt-4o-mini',        // AI model
  aiProvider: 'openai',        // openai | gemini
  
  // Integration options
  glossaryId: 'glossary_123',  // Custom glossary
  webhookUrl: 'https://webhook.site/xxx' // Webhook URL
};
```

## 📝 Subtitle Processing Options

### 1. Subtitle Formats

```javascript
const subtitleFormats = {
  srt: {
    name: 'SubRip',
    description: 'Format phổ biến nhất, tương thích với hầu hết player',
    extension: '.srt',
    features: ['Basic styling', 'Timing precision']
  },
  ass: {
    name: 'Advanced SubStation Alpha',
    description: 'Format nâng cao với styling phong phú',
    extension: '.ass',
    features: ['Advanced styling', 'Font customization', 'Effects']
  },
  vtt: {
    name: 'WebVTT',
    description: 'Format cho web, tương thích với HTML5 video',
    extension: '.vtt',
    features: ['Web compatibility', 'Metadata support']
  }
};
```

### 2. Subtitle Processing Logic

```javascript
const processSubtitles = async (jobOptions) => {
  const { softSub, hardSub, textOnly, subtitleFormat } = jobOptions;
  
  if (textOnly) {
    // Chỉ tạo subtitle file, không xuất video
    return {
      outputs: {
        subtitle: `outputs/${jobId}.${subtitleFormat}`
      }
    };
  }
  
  if (softSub) {
    // Tạo subtitle file riêng biệt
    return {
      outputs: {
        subtitle: `outputs/${jobId}.${subtitleFormat}`,
        video: `outputs/${jobId}.mp4`
      }
    };
  }
  
  if (hardSub) {
    // Burn subtitle vào video
    return {
      outputs: {
        video: `outputs/${jobId}_burned.mp4`
      }
    };
  }
  
  return { outputs: {} };
};
```

## 🎤 Voice Profiles & TTS

### 1. Available Voice Profiles

```javascript
const voiceProfiles = {
  female_1: {
    name: 'Giọng nữ 1',
    description: 'Giọng nữ trẻ trung, rõ ràng',
    language: 'vi',
    gender: 'female',
    age: 'young'
  },
  female_2: {
    name: 'Giọng nữ 2',
    description: 'Giọng nữ trưởng thành, chuyên nghiệp',
    language: 'vi',
    gender: 'female',
    age: 'adult'
  },
  male_1: {
    name: 'Giọng nam 1',
    description: 'Giọng nam trẻ trung, năng động',
    language: 'vi',
    gender: 'male',
    age: 'young'
  },
  male_2: {
    name: 'Giọng nam 2',
    description: 'Giọng nam trưởng thành, ấm áp',
    language: 'vi',
    gender: 'male',
    age: 'adult'
  }
};
```

### 2. TTS Configuration

```javascript
const ttsConfig = {
  // Basic TTS
  audioDubbing: {
    enabled: true,
    voiceProfile: 'female_1',
    speed: 1.0,
    pitch: 1.0
  },
  
  // Advanced TTS V2
  audioDubbingV2: {
    enabled: false,
    voiceProfile: 'female_1',
    speed: 1.0,
    pitch: 1.0,
    advancedFeatures: {
      emotion: 'neutral',
      emphasis: 'normal',
      pause: 'normal'
    }
  }
};
```

### 3. Voice Processing Logic

```javascript
const processVoiceover = async (jobOptions) => {
  const { audioDubbing, audioDubbingV2, voiceProfile } = jobOptions;
  
  if (audioDubbingV2) {
    // Advanced TTS với nhiều tính năng
    return {
      outputs: {
        audio: `outputs/${jobId}_voiceover_v2.mp3`,
        video: `outputs/${jobId}_dubbed_v2.mp4`
      }
    };
  }
  
  if (audioDubbing) {
    // Basic TTS
    return {
      outputs: {
        audio: `outputs/${jobId}_voiceover.mp3`,
        video: `outputs/${jobId}_dubbed.mp4`
      }
    };
  }
  
  return { outputs: {} };
};
```

## 📚 Glossary Integration

### 1. Create Glossary

```javascript
const createGlossary = async (glossaryData) => {
  const response = await fetch(`${API_BASE_URL}/glossary`, {
    method: 'POST',
    headers: getHeaders(getAuthToken()),
    body: JSON.stringify(glossaryData)
  });
  return response.json();
};

// Usage
const glossaryData = {
  name: 'My Custom Glossary',
  description: 'Glossary for technical terms',
  terms: [
    {
      source: 'API',
      target: 'Giao diện lập trình ứng dụng',
      priority: 'high'
    },
    {
      source: 'Database',
      target: 'Cơ sở dữ liệu',
      priority: 'medium'
    }
  ]
};

const result = await createGlossary(glossaryData);
```

### 2. Get Glossary List

```javascript
const getGlossaries = async () => {
  const response = await fetch(`${API_BASE_URL}/glossary`, {
    headers: getHeaders(getAuthToken())
  });
  return response.json();
};
```

### 3. Use Glossary in Job

```javascript
const createJobWithGlossary = async (jobData) => {
  const response = await fetch(`${API_BASE_URL}/videos`, {
    method: 'POST',
    headers: getHeaders(getAuthToken()),
    body: JSON.stringify({
      ...jobData,
      glossaryId: 'glossary_123' // Sử dụng glossary
    })
  });
  return response.json();
};
```

## 🚨 Error Handling & Validation

### 1. Error Codes

```javascript
const errorCodes = {
  '40001': 'Invalid file format - File không được hỗ trợ',
  '40002': 'File too large - File quá lớn (>500MB)',
  '40003': 'Unsupported language - Ngôn ngữ không được hỗ trợ',
  '40004': 'Invalid job options - Tùy chọn job không hợp lệ',
  '40005': 'Invalid input parameters - Tham số đầu vào không hợp lệ',
  '40006': 'File too small - File quá nhỏ (<1MB)',
  '40007': 'Invalid subtitle format - Format subtitle không hợp lệ',
  '40008': 'Invalid voice profile - Voice profile không hợp lệ',
  '40009': 'Glossary not found - Không tìm thấy glossary',
  '40010': 'Webhook URL invalid - Webhook URL không hợp lệ'
};
```

### 2. Error Handling Utility

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  const errorCode = error.response?.data?.errorCode;
  const errorMessage = errorCodes[errorCode] || error.message || 'Có lỗi xảy ra';
  
  if (errorCode === '40001') {
    return 'File không được hỗ trợ. Vui lòng chọn file video (mp4, avi, mov, mkv)';
  } else if (errorCode === '40002') {
    return 'File quá lớn. Vui lòng chọn file nhỏ hơn 500MB';
  } else if (errorCode === '40003') {
    return 'Ngôn ngữ không được hỗ trợ. Vui lòng chọn ngôn ngữ khác';
  } else if (errorCode === '40004') {
    return 'Tùy chọn job không hợp lệ. Vui lòng kiểm tra lại cấu hình';
  } else if (errorCode === '40005') {
    return 'Tham số đầu vào không hợp lệ. Vui lòng kiểm tra lại thông tin';
  }
  
  return errorMessage;
};
```

### 3. Validation Functions

```javascript
// utils/validation.js
export const validateFile = (file) => {
  const errors = [];
  
  // Check file size
  if (file.size > 500 * 1024 * 1024) { // 500MB
    errors.push('File quá lớn (>500MB)');
  }
  
  if (file.size < 1024 * 1024) { // 1MB
    errors.push('File quá nhỏ (<1MB)');
  }
  
  // Check file type
  const supportedTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo'];
  if (!supportedTypes.includes(file.type)) {
    errors.push('File không được hỗ trợ. Vui lòng chọn file video');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateJobOptions = (options) => {
  const errors = [];
  
  // Check required fields
  if (!options.targetLang) {
    errors.push('targetLang là bắt buộc');
  }
  
  // Check at least one processing option
  const hasProcessing = options.softSub || options.hardSub || options.textOnly || 
                       options.audioDubbing || options.audioDubbingV2;
  if (!hasProcessing) {
    errors.push('Phải chọn ít nhất một tùy chọn xử lý');
  }
  
  // Check conflicting options
  if (options.hardSub && options.textOnly) {
    errors.push('Không thể chọn cả hardSub và textOnly');
  }
  
  if (options.audioDubbing && options.audioDubbingV2) {
    errors.push('Không thể chọn cả audioDubbing và audioDubbingV2');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## 📏 File Constraints

### 1. Supported Formats

```javascript
const fileConstraints = {
  maxSize: '500MB',
  minSize: '1MB',
  supportedFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm'],
  maxDuration: '2 hours',
  minDuration: '1 second',
  maxResolution: '4K (3840x2160)',
  minResolution: '240p (426x240)',
  supportedCodecs: ['H.264', 'H.265', 'VP9', 'AV1'],
  supportedAudioCodecs: ['AAC', 'MP3', 'AC-3', 'E-AC-3']
};
```

### 2. File Validation Component

```javascript
// components/FileValidator.jsx
import { validateFile } from '../utils/validation';

const FileValidator = ({ file, onValidation }) => {
  const [validation, setValidation] = useState(null);
  
  useEffect(() => {
    if (file) {
      const result = validateFile(file);
      setValidation(result);
      onValidation(result);
    }
  }, [file, onValidation]);
  
  if (!validation) return null;
  
  return (
    <div className="file-validator">
      {validation.isValid ? (
        <div className="validation-success">
          ✅ File hợp lệ
        </div>
      ) : (
        <div className="validation-errors">
          {validation.errors.map((error, index) => (
            <div key={index} className="error">
              ❌ {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## 📡 REST API Endpoints

### 1. Video Upload & Job Creation

#### POST `/videos/upload` - Upload file và tạo job
```javascript
// components/VideoUpload.jsx
import { useState } from 'react';

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadVideo = async (file, jobOptions) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Thêm các options vào formData
    Object.keys(jobOptions).forEach(key => {
      if (jobOptions[key] !== undefined) {
        formData.append(key, jobOptions[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/videos/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData
    });

    return response.json();
  };

  return (
    <div>
      <input 
        type="file" 
        accept="video/*" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button 
        onClick={() => uploadVideo(file, {
          targetLang: 'vi',
          softSub: true,
          subtitleFormat: 'srt'
        })}
        disabled={!file || uploading}
      >
        Upload & Process
      </button>
    </div>
  );
};
```

**Request Body (FormData):**
```javascript
{
  file: File, // Video file
  targetLang: "vi", // Required
  sourceLang: "en", // Optional
  softSub: true, // Optional
  hardSub: false, // Optional
  textOnly: false, // Optional
  audioDubbing: false, // Optional
  audioDubbingV2: false, // Optional
  subtitleFormat: "srt", // Optional: "srt" | "ass" | "vtt"
  voiceover: false, // Optional
  voiceProfile: "female_1", // Optional
  glossaryId: "glossary_123", // Optional
  webhookUrl: "https://webhook.site/xxx", // Optional
  model: "gpt-4o-mini", // Optional
  aiProvider: "openai", // Optional: "openai" | "gemini"
  advanced: { // Optional
    removeOriginalVoice: false,
    removeBgm: false,
    mergeCaption: false,
    mergeOpenCaption: false
  }
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "jobId": "job_abc123",
    "status": "queued",
    "message": "Video uploaded and job created successfully"
  }
}
```

#### POST `/videos` - Tạo job từ file S3 có sẵn
```javascript
const createJobFromS3 = async (jobData) => {
  const response = await fetch(`${API_BASE_URL}/videos`, {
    method: 'POST',
    headers: getHeaders(getAuthToken()),
    body: JSON.stringify(jobData)
  });

  return response.json();
};

// Usage
const jobData = {
  fileKey: "inputs/video123.mp4", // Required: S3 key
  targetLang: "vi", // Required
  sourceLang: "en", // Optional
  softSub: true,
  subtitleFormat: "srt",
  // ... other options
};

const result = await createJobFromS3(jobData);
```

### 2. Job Status & Management

#### GET `/videos/:id/status` - Lấy trạng thái job
```javascript
const getJobStatus = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/videos/${jobId}/status`, {
    headers: getHeaders(getAuthToken())
  });

  return response.json();
};

// Response
{
  "success": true,
  "data": {
    "jobId": "job_abc123",
    "status": "processing", // "queued" | "processing" | "completed" | "failed" | "cancelled"
    "progress": 45,
    "currentStage": "subtitle",
    "stages": {
      "asr": "completed",
      "translate": "completed", 
      "subtitle": "processing",
      "burn": "pending",
      "voiceover": "pending"
    },
    "outputs": {
      "subtitle": "outputs/job_abc123.srt",
      "video": "outputs/job_abc123.mp4"
    },
    "error": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:05:00Z"
  }
}
```

#### POST `/videos/:id/cancel` - Hủy job
```javascript
const cancelJob = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/videos/${jobId}/cancel`, {
    method: 'POST',
    headers: getHeaders(getAuthToken())
  });

  return response.json();
};
```

### 3. Output Management

#### GET `/outputs/:key` - Lấy presigned URL để download
```javascript
const getDownloadUrl = async (outputKey) => {
  const response = await fetch(`${API_BASE_URL}/outputs/${outputKey}`, {
    headers: getHeaders(getAuthToken())
  });

  return response.json();
};

// Response
{
  "success": true,
  "data": {
    "url": "https://s3.amazonaws.com/bucket/outputs/job_abc123.mp4?signature=...",
    "expiresIn": 3600
  }
}
```

## 🔌 WebSocket Integration

### 1. Job Progress Tracking

```javascript
// hooks/useJobProgress.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useJobProgress = (jobId) => {
  const [progress, setProgress] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    const newSocket = io(`${WS_BASE_URL}/jobs`, {
      auth: {
        token: getAuthToken()
      }
    });

    newSocket.emit('join-job', { jobId });

    newSocket.on('joined', (data) => {
      console.log('Joined job room:', data);
    });

    newSocket.on('job-progress', (data) => {
      setProgress(data);
    });

    newSocket.on('job-stage-change', (data) => {
      setProgress(prev => ({ ...prev, currentStage: data.stage }));
    });

    newSocket.on('job-completed', (data) => {
      setProgress(prev => ({ ...prev, status: 'completed', outputs: data.outputs }));
    });

    newSocket.on('job-failed', (data) => {
      setProgress(prev => ({ ...prev, status: 'failed', error: data.error }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [jobId]);

  return { progress, socket };
};
```

### 2. File Upload WebSocket

```javascript
// hooks/useFileUpload.js
import { useState, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [socket, setSocket] = useState(null);

  const connectUploadSocket = useCallback((sessionId, userId) => {
    const newSocket = io(`${WS_BASE_URL}/upload`, {
      auth: {
        token: getAuthToken()
      }
    });

    newSocket.emit('join-upload-session', { sessionId, userId });

    newSocket.on('upload-status', (data) => {
      console.log('Upload status:', data);
    });

    newSocket.on('upload-progress', (data) => {
      setUploadProgress(data.progress || 0);
    });

    newSocket.on('upload-completed', (data) => {
      setUploadStatus('completed');
      setUploadProgress(100);
    });

    newSocket.on('upload-failed', (data) => {
      setUploadStatus('failed');
      console.error('Upload failed:', data.error);
    });

    setSocket(newSocket);
    return newSocket;
  }, []);

  const uploadFile = useCallback(async (file, sessionId) => {
    if (!socket) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      // 1. Lấy presigned URL
      const presignResult = await new Promise((resolve, reject) => {
        socket.emit('presign-put', {
          fileName: file.name,
          fileType: file.type,
          category: 'inputs'
        });

        socket.once('presign-put-result', resolve);
        socket.once('error', reject);
      });

      // 2. Upload file lên S3
      const uploadResponse = await fetch(presignResult.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      // 3. Thông báo upload hoàn thành
      socket.emit('upload-completed', {
        sessionId,
        key: presignResult.key
      });

      return presignResult.key;
    } catch (error) {
      setUploadStatus('failed');
      throw error;
    }
  }, [socket]);

  return {
    uploadProgress,
    uploadStatus,
    connectUploadSocket,
    uploadFile
  };
};
```

## 🎯 Complete Flow Implementation

### 1. Video Upload Component

```javascript
// components/VideoProcessor.jsx
import { useState } from 'react';
import { useFileUpload } from '../hooks/useFileUpload';
import { useJobProgress } from '../hooks/useJobProgress';

const VideoProcessor = () => {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [userId] = useState(() => localStorage.getItem('userId'));

  const { uploadProgress, uploadStatus, connectUploadSocket, uploadFile } = useFileUpload();
  const { progress: jobProgress } = useJobProgress(jobId);

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadAndProcess = async () => {
    try {
      // 1. Kết nối WebSocket
      const socket = connectUploadSocket(sessionId, userId);

      // 2. Upload file
      const fileKey = await uploadFile(file, sessionId);

      // 3. Tạo job processing
      const jobResponse = await fetch(`${API_BASE_URL}/videos`, {
        method: 'POST',
        headers: getHeaders(getAuthToken()),
        body: JSON.stringify({
          fileKey,
          targetLang: 'vi',
          softSub: true,
          subtitleFormat: 'srt',
          audioDubbing: false
        })
      });

      const jobData = await jobResponse.json();
      setJobId(jobData.data.jobId);

      // 4. Disconnect upload socket
      socket.disconnect();

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="video-processor">
      <div className="upload-section">
        <input 
          type="file" 
          accept="video/*" 
          onChange={handleFileSelect} 
        />
        
        {uploadStatus === 'uploading' && (
          <div className="upload-progress">
            <p>Uploading: {uploadProgress}%</p>
            <progress value={uploadProgress} max="100" />
          </div>
        )}

        <button 
          onClick={handleUploadAndProcess}
          disabled={!file || uploadStatus === 'uploading'}
        >
          Upload & Process
        </button>
      </div>

      {jobId && (
        <div className="job-progress">
          <h3>Processing Job: {jobId}</h3>
          
          {jobProgress && (
            <div>
              <p>Status: {jobProgress.status}</p>
              <p>Progress: {jobProgress.progress}%</p>
              <p>Current Stage: {jobProgress.currentStage}</p>
              
              {jobProgress.outputs && (
                <div className="outputs">
                  <h4>Outputs:</h4>
                  {Object.entries(jobProgress.outputs).map(([type, key]) => (
                    <div key={type}>
                      <span>{type}: </span>
                      <a 
                        href="#" 
                        onClick={async (e) => {
                          e.preventDefault();
                          const urlData = await getDownloadUrl(key);
                          window.open(urlData.data.url, '_blank');
                        }}
                      >
                        Download {type}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

### 2. Job Status Component

```javascript
// components/JobStatus.jsx
import { useEffect, useState } from 'react';
import { useJobProgress } from '../hooks/useJobProgress';

const JobStatus = ({ jobId }) => {
  const { progress } = useJobProgress(jobId);
  const [pollingStatus, setPollingStatus] = useState(null);

  // Fallback polling nếu WebSocket không hoạt động
  useEffect(() => {
    if (!jobId) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/videos/${jobId}/status`, {
          headers: getHeaders(getAuthToken())
        });
        const data = await response.json();
        setPollingStatus(data.data);
      } catch (error) {
        console.error('Error polling status:', error);
      }
    };

    const interval = setInterval(pollStatus, 2000);
    pollStatus(); // Initial call

    return () => clearInterval(interval);
  }, [jobId]);

  const currentStatus = progress || pollingStatus;

  if (!currentStatus) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-status">
      <h3>Job Status</h3>
      <div className="status-info">
        <p><strong>Status:</strong> {currentStatus.status}</p>
        <p><strong>Progress:</strong> {currentStatus.progress}%</p>
        <p><strong>Current Stage:</strong> {currentStatus.currentStage}</p>
      </div>

      <div className="stages">
        <h4>Processing Stages:</h4>
        {currentStatus.stages && Object.entries(currentStatus.stages).map(([stage, status]) => (
          <div key={stage} className={`stage ${status}`}>
            <span>{stage}: {status}</span>
          </div>
        ))}
      </div>

      {currentStatus.status === 'failed' && (
        <div className="error">
          <p><strong>Error:</strong> {currentStatus.error}</p>
        </div>
      )}

      {currentStatus.status === 'completed' && currentStatus.outputs && (
        <div className="downloads">
          <h4>Download Results:</h4>
          {Object.entries(currentStatus.outputs).map(([type, key]) => (
            <div key={type}>
              <button 
                onClick={async () => {
                  const urlData = await getDownloadUrl(key);
                  window.open(urlData.data.url, '_blank');
                }}
              >
                Download {type}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## 🛠️ Utility Functions

```javascript
// utils/api.js
export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: getHeaders(getAuthToken()),
      ...options
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Video operations
  async uploadVideo(file, jobOptions) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(jobOptions).forEach(key => {
      if (jobOptions[key] !== undefined) {
        formData.append(key, jobOptions[key]);
      }
    });

    return this.request('/videos/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData
    });
  },

  async createJob(jobData) {
    return this.request('/videos', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  },

  async getJobStatus(jobId) {
    return this.request(`/videos/${jobId}/status`);
  },

  async cancelJob(jobId) {
    return this.request(`/videos/${jobId}/cancel`, {
      method: 'POST'
    });
  },

  async getDownloadUrl(outputKey) {
    return this.request(`/outputs/${outputKey}`);
  }
};
```

## 🎨 Styling Example

```css
/* styles/VideoProcessor.css */
.video-processor {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.upload-section {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
}

.upload-progress {
  margin: 10px 0;
}

.job-progress {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.stages {
  margin: 15px 0;
}

.stage {
  padding: 5px 10px;
  margin: 5px 0;
  border-radius: 4px;
}

.stage.completed {
  background: #d4edda;
  color: #155724;
}

.stage.processing {
  background: #fff3cd;
  color: #856404;
}

.stage.pending {
  background: #e2e3e5;
  color: #383d41;
}

.outputs, .downloads {
  margin-top: 15px;
}

.outputs a, .downloads button {
  display: inline-block;
  margin: 5px 10px 5px 0;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.outputs a:hover, .downloads button:hover {
  background: #0056b3;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}
```

## 📱 Next.js App Router Integration

```javascript
// app/video-processor/page.js
'use client';

import { VideoProcessor } from '../../components/VideoProcessor';
import { JobStatus } from '../../components/JobStatus';
import { useState } from 'react';

export default function VideoProcessorPage() {
  const [activeJobId, setActiveJobId] = useState(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Video Translation Processor</h1>
      
      <VideoProcessor onJobCreated={setActiveJobId} />
      
      {activeJobId && (
        <div className="mt-8">
          <JobStatus jobId={activeJobId} />
        </div>
      )}
    </div>
  );
}
```

## 🔧 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://dichtudong-clone-api.onrender.com
NEXT_PUBLIC_WS_URL=wss://dichtudong-clone-api.onrender.com
NEXT_PUBLIC_APP_NAME=Video Translation App
```

## 🚨 Error Handling

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.message.includes('401')) {
    // Unauthorized - redirect to login
    removeAuthToken();
    window.location.href = '/login';
  } else if (error.message.includes('403')) {
    // Forbidden
    return 'Bạn không có quyền thực hiện hành động này';
  } else if (error.message.includes('429')) {
    // Rate limited
    return 'Quá nhiều yêu cầu, vui lòng thử lại sau';
  } else if (error.message.includes('500')) {
    // Server error
    return 'Lỗi máy chủ, vui lòng thử lại sau';
  } else {
    return error.message || 'Có lỗi xảy ra';
  }
};
```

## 📊 Performance Tips

1. **Lazy Loading**: Chỉ load WebSocket khi cần thiết
2. **Debouncing**: Debounce status polling requests
3. **Caching**: Cache job status trong localStorage
4. **Error Boundaries**: Wrap components với error boundaries
5. **Loading States**: Hiển thị loading states cho UX tốt hơn

Tài liệu này cung cấp đầy đủ thông tin để tích hợp Video Translation API với Next.js frontend một cách hiệu quả và professional.
