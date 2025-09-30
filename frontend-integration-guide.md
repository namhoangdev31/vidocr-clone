# Frontend Integration Guide - Video Translation API

## Overview

This document provides comprehensive integration guidelines for frontend developers to implement video translation features using the Dichtudong API. The API supports video processing with subtitling, dubbing, and advanced features.

## Table of Contents

1. [API Base Configuration](#api-base-configuration)
2. [Authentication](#authentication)
3. [WebSocket Integration](#websocket-integration)
4. [REST API Endpoints](#rest-api-endpoints)
5. [Job Processing Flow](#job-processing-flow)
6. [Error Handling](#error-handling)
7. [File Upload Process](#file-upload-process)
8. [Real-time Progress Tracking](#real-time-progress-tracking)
9. [Download Results](#download-results)
10. [Advanced Features](#advanced-features)
11. [Code Examples](#code-examples)
12. [Testing Guidelines](#testing-guidelines)

## API Base Configuration

### Base URL
```
Production: https://dichtudong-clone-api.onrender.com
Development: http://localhost:3000
```

### Required Headers
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`,
  'Accept': 'application/json'
};
```

## Authentication

### JWT Token Management
```javascript
// Store token after login
localStorage.setItem('accessToken', response.data.accessToken);

// Include in API calls
const token = localStorage.getItem('accessToken');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### Token Refresh
```javascript
// Handle token expiration
const handleApiError = (error) => {
  if (error.response?.status === 401) {
    // Redirect to login or refresh token
    window.location.href = '/login';
  }
};
```

## WebSocket Integration

### Connection Setup
```javascript
import io from 'socket.io-client';

// Connect to WebSocket
const socket = io(`${API_BASE_URL}`, {
  auth: {
    token: localStorage.getItem('accessToken')
  }
});

// Join upload session
const joinUploadSession = (sessionId, userId) => {
  socket.emit('join-upload-session', { sessionId, userId });
};

// Listen for upload status
socket.on('upload-status', (data) => {
  console.log('Upload status:', data);
  // Handle upload status updates
});
```

### Upload Progress Events
```javascript
// File upload progress
socket.on('upload-progress', (data) => {
  const { sessionId, progress } = data;
  updateUploadProgress(sessionId, progress);
});

// Upload completion
socket.on('upload-completed', (data) => {
  const { sessionId, key } = data;
  handleUploadComplete(sessionId, key);
});

// Upload cancellation
socket.on('upload-cancelled', (data) => {
  const { sessionId, message } = data;
  handleUploadCancel(sessionId, message);
});
```

### Job Progress Events
```javascript
// Job stage changes
socket.on('job-stage-change', (data) => {
  const { jobId, stage, progress } = data;
  updateJobProgress(jobId, stage, progress);
});

// Job completion
socket.on('job-completed', (data) => {
  const { jobId, outputs } = data;
  handleJobComplete(jobId, outputs);
});

// Job failure
socket.on('job-failed', (data) => {
  const { jobId, error } = data;
  handleJobError(jobId, error);
});
```

## REST API Endpoints

### 1. Create Video Job
```javascript
const createVideoJob = async (jobData) => {
  const response = await fetch(`${API_BASE_URL}/videos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobData)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

// Job data structure
const jobData = {
  fileKey: "inputs/video123.mp4",
  sourceLang: "en",
  targetLang: "vi",
  burnSub: true,
  subtitleFormat: "srt",
  voiceover: false,
  voiceProfile: null,
  glossaryId: null,
  webhookUrl: null,
  model: "gpt-4o-mini",
  aiProvider: "openai",
  advanced: {
    removeOriginalText: false,
    removeBgm: false,
    mergeCaption: false,
    mergeOpenCaption: false
  }
};
```

### 2. Get Job Status
```javascript
const getJobStatus = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/status`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

### 3. Get Download URL
```javascript
const getDownloadUrl = async (outputKey) => {
  const response = await fetch(`${API_BASE_URL}/outputs/presigned?key=${outputKey}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

### 4. Cancel Job
```javascript
const cancelJob = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/videos/${jobId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

## Job Processing Flow

### Complete Workflow
```javascript
class VideoTranslationService {
  constructor(apiBaseUrl, token) {
    this.apiBaseUrl = apiBaseUrl;
    this.token = token;
    this.socket = null;
  }

  // 1. Upload video file
  async uploadVideo(file, sessionId) {
    // Get presigned URL for upload
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
  }

  // 2. Create processing job
  async createJob(fileKey, options) {
    const jobData = {
      fileKey,
      sourceLang: options.sourceLang,
      targetLang: options.targetLang,
      burnSub: options.burnSub || false,
      subtitleFormat: options.subtitleFormat || 'srt',
      voiceover: options.voiceover || false,
      voiceProfile: options.voiceProfile,
      glossaryId: options.glossaryId,
      webhookUrl: options.webhookUrl,
      model: options.model || 'gpt-4o-mini',
      aiProvider: options.aiProvider || 'openai',
      advanced: options.advanced || {}
    };
    
    return await this.createVideoJob(jobData);
  }

  // 3. Track job progress
  trackJobProgress(jobId, onProgress, onComplete, onError) {
    this.socket.on('job-stage-change', (data) => {
      if (data.jobId === jobId) {
        onProgress(data);
      }
    });
    
    this.socket.on('job-completed', (data) => {
      if (data.jobId === jobId) {
        onComplete(data);
      }
    });
    
    this.socket.on('job-failed', (data) => {
      if (data.jobId === jobId) {
        onError(data);
      }
    });
  }

  // 4. Download results
  async downloadResults(outputs) {
    const downloadUrls = {};
    
    for (const [type, key] of Object.entries(outputs)) {
      if (key) {
        const response = await this.getDownloadUrl(key);
        downloadUrls[type] = response.url;
      }
    }
    
    return downloadUrls;
  }
}
```

## Error Handling

### Error Codes
```javascript
const ERROR_CODES = {
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
};

const handleError = (error) => {
  const errorCode = error.response?.data?.errorCode;
  const message = ERROR_CODES[errorCode] || error.message;
  
  console.error('API Error:', message);
  // Show user-friendly error message
  showErrorMessage(message);
};
```

### Retry Logic
```javascript
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

## File Upload Process

### Small Files (< 100MB)
```javascript
const uploadSmallFile = async (file, sessionId) => {
  // 1. Request presigned URL
  const presignResponse = await socket.emitWithAck('presign-put', {
    fileName: file.name,
    fileType: file.type,
    category: 'video'
  });
  
  // 2. Upload to S3
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
};
```

### Large Files (≥ 100MB)
```javascript
const uploadLargeFile = async (file, sessionId) => {
  const chunkSize = 5 * 1024 * 1024; // 5MB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);
  
  // 1. Initiate multipart upload
  const initiateResponse = await socket.emitWithAck('multipart-initiate', {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    category: 'video'
  });
  
  const { key, uploadId } = initiateResponse;
  const parts = [];
  
  // 2. Upload chunks
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    // Get presigned URL for chunk
    const signResponse = await socket.emitWithAck('multipart-sign-part', {
      key,
      uploadId,
      partNumber: i + 1
    });
    
    // Upload chunk
    const uploadResponse = await fetch(signResponse.url, {
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
    socket.emit('client-upload-progress', {
      sessionId,
      progress: { percentage: progress, chunk: i + 1, total: totalChunks }
    });
  }
  
  // 3. Complete multipart upload
  const completeResponse = await socket.emitWithAck('multipart-complete', {
    key,
    uploadId,
    parts
  });
  
  return completeResponse.key;
};
```

## Real-time Progress Tracking

### Progress UI Component
```javascript
const JobProgress = ({ jobId }) => {
  const [progress, setProgress] = useState({
    stage: 'queued',
    progress: 0,
    message: 'Job queued for processing'
  });
  
  useEffect(() => {
    const handleStageChange = (data) => {
      if (data.jobId === jobId) {
        setProgress(prev => ({
          ...prev,
          stage: data.stage,
          progress: data.progress,
          message: data.message
        }));
      }
    };
    
    socket.on('job-stage-change', handleStageChange);
    
    return () => {
      socket.off('job-stage-change', handleStageChange);
    };
  }, [jobId]);
  
  const getStageDisplayName = (stage) => {
    const stageNames = {
      'queued': 'Queued',
      'preparing': 'Preparing',
      'transcribing': 'Transcribing',
      'translating': 'Translating',
      'subbuilding': 'Building Subtitles',
      'dubbing': 'Generating Voice',
      'mixing': 'Mixing Audio',
      'rendering': 'Rendering Video',
      'muxing': 'Finalizing',
      'uploading': 'Uploading Results',
      'completed': 'Completed',
      'failed': 'Failed',
      'canceled': 'Canceled'
    };
    
    return stageNames[stage] || stage;
  };
  
  return (
    <div className="job-progress">
      <div className="progress-header">
        <h3>Processing Video</h3>
        <span className="stage">{getStageDisplayName(progress.stage)}</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress.progress}%` }}
        />
      </div>
      
      <div className="progress-info">
        <span className="percentage">{progress.progress}%</span>
        <span className="message">{progress.message}</span>
      </div>
    </div>
  );
};
```

## Download Results

### Download Manager
```javascript
const DownloadManager = ({ outputs }) => {
  const [downloadUrls, setDownloadUrls] = useState({});
  
  useEffect(() => {
    const fetchDownloadUrls = async () => {
      const urls = {};
      
      for (const [type, key] of Object.entries(outputs)) {
        if (key) {
          try {
            const response = await getDownloadUrl(key);
            urls[type] = response.url;
          } catch (error) {
            console.error(`Failed to get download URL for ${type}:`, error);
          }
        }
      }
      
      setDownloadUrls(urls);
    };
    
    fetchDownloadUrls();
  }, [outputs]);
  
  const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="download-results">
      <h3>Download Results</h3>
      
      {downloadUrls.srtKey && (
        <button 
          onClick={() => downloadFile(downloadUrls.srtKey, 'subtitles.srt')}
          className="download-btn"
        >
          Download SRT Subtitles
        </button>
      )}
      
      {downloadUrls.assKey && (
        <button 
          onClick={() => downloadFile(downloadUrls.assKey, 'subtitles.ass')}
          className="download-btn"
        >
          Download ASS Subtitles
        </button>
      )}
      
      {downloadUrls.vttKey && (
        <button 
          onClick={() => downloadFile(downloadUrls.vttKey, 'subtitles.vtt')}
          className="download-btn"
        >
          Download VTT Subtitles
        </button>
      )}
      
      {downloadUrls.mp4Key && (
        <button 
          onClick={() => downloadFile(downloadUrls.mp4Key, 'video.mp4')}
          className="download-btn"
        >
          Download Video
        </button>
      )}
      
      {downloadUrls.voiceKey && (
        <button 
          onClick={() => downloadFile(downloadUrls.voiceKey, 'audio.mp3')}
          className="download-btn"
        >
          Download Audio
        </button>
      )}
    </div>
  );
};
```

## Advanced Features

### Glossary Management
```javascript
const GlossaryManager = () => {
  const [glossaries, setGlossaries] = useState([]);
  const [selectedGlossary, setSelectedGlossary] = useState(null);
  
  useEffect(() => {
    fetchGlossaries();
  }, []);
  
  const fetchGlossaries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/glossary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setGlossaries(data.glossaries);
    } catch (error) {
      console.error('Failed to fetch glossaries:', error);
    }
  };
  
  const createGlossary = async (glossaryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/glossary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(glossaryData)
      });
      
      if (response.ok) {
        fetchGlossaries(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to create glossary:', error);
    }
  };
  
  return (
    <div className="glossary-manager">
      <h3>Glossary Management</h3>
      
      <select 
        value={selectedGlossary} 
        onChange={(e) => setSelectedGlossary(e.target.value)}
      >
        <option value="">Select Glossary</option>
        {glossaries.map(glossary => (
          <option key={glossary.id} value={glossary.id}>
            {glossary.name} ({glossary.sourceLang} → {glossary.targetLang})
          </option>
        ))}
      </select>
      
      <button onClick={() => setShowCreateForm(true)}>
        Create New Glossary
      </button>
    </div>
  );
};
```

### Multi-speaker TTS
```javascript
const MultiSpeakerTTS = () => {
  const [voiceProfiles, setVoiceProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState({});
  
  useEffect(() => {
    fetchVoiceProfiles();
  }, []);
  
  const fetchVoiceProfiles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/multi-speaker-tts/voice-profiles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setVoiceProfiles(data.profiles);
    } catch (error) {
      console.error('Failed to fetch voice profiles:', error);
    }
  };
  
  const assignSpeakerVoice = (speakerId, voiceProfileId) => {
    setSelectedProfiles(prev => ({
      ...prev,
      [speakerId]: voiceProfileId
    }));
  };
  
  return (
    <div className="multi-speaker-tts">
      <h3>Multi-speaker TTS</h3>
      
      {speakers.map(speaker => (
        <div key={speaker.id} className="speaker-voice-selection">
          <label>Speaker {speaker.id}:</label>
          <select 
            value={selectedProfiles[speaker.id] || ''}
            onChange={(e) => assignSpeakerVoice(speaker.id, e.target.value)}
          >
            <option value="">Select Voice</option>
            {voiceProfiles.map(profile => (
              <option key={profile.id} value={profile.id}>
                {profile.name} ({profile.gender}, {profile.age})
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
```

## Code Examples

### Complete React Component
```javascript
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const VideoTranslationApp = () => {
  const [socket, setSocket] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  
  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(API_BASE_URL, {
      auth: { token: localStorage.getItem('accessToken') }
    });
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    
    // Listen for job updates
    newSocket.on('job-stage-change', handleJobUpdate);
    newSocket.on('job-completed', handleJobComplete);
    newSocket.on('job-failed', handleJobError);
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, []);
  
  const handleJobUpdate = (data) => {
    setJobs(prev => prev.map(job => 
      job.id === data.jobId 
        ? { ...job, stage: data.stage, progress: data.progress }
        : job
    ));
  };
  
  const handleJobComplete = (data) => {
    setJobs(prev => prev.map(job => 
      job.id === data.jobId 
        ? { ...job, status: 'completed', outputs: data.outputs }
        : job
    ));
  };
  
  const handleJobError = (data) => {
    setJobs(prev => prev.map(job => 
      job.id === data.jobId 
        ? { ...job, status: 'failed', error: data.error }
        : job
    ));
  };
  
  const uploadAndProcessVideo = async (file, options) => {
    try {
      // 1. Upload file
      const fileKey = await uploadVideo(file);
      
      // 2. Create job
      const job = await createVideoJob(fileKey, options);
      
      // 3. Add to jobs list
      setJobs(prev => [...prev, job]);
      setCurrentJob(job);
      
    } catch (error) {
      console.error('Failed to process video:', error);
      showErrorMessage('Failed to process video. Please try again.');
    }
  };
  
  return (
    <div className="video-translation-app">
      <h1>Video Translation</h1>
      
      <FileUpload onUpload={uploadAndProcessVideo} />
      
      {currentJob && (
        <JobProgress jobId={currentJob.id} />
      )}
      
      <JobsList jobs={jobs} />
      
      {currentJob?.status === 'completed' && (
        <DownloadResults outputs={currentJob.outputs} />
      )}
    </div>
  );
};

export default VideoTranslationApp;
```

## Testing Guidelines

### Unit Tests
```javascript
// Test API service
describe('VideoTranslationService', () => {
  it('should create job with valid data', async () => {
    const mockJob = { id: '123', status: 'queued' };
    const mockResponse = { data: mockJob };
    
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });
    
    const result = await videoService.createJob(validJobData);
    
    expect(result).toEqual(mockJob);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/videos'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Bearer')
        })
      })
    );
  });
  
  it('should handle API errors gracefully', async () => {
    const mockError = { errorCode: '40001', message: 'Invalid language code' };
    
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve(mockError)
    });
    
    await expect(videoService.createJob(invalidJobData))
      .rejects.toThrow('Invalid language code');
  });
});
```

### Integration Tests
```javascript
// Test WebSocket integration
describe('WebSocket Integration', () => {
  let socket;
  
  beforeEach(() => {
    socket = io(API_BASE_URL, { autoConnect: false });
  });
  
  afterEach(() => {
    socket.close();
  });
  
  it('should receive job progress updates', (done) => {
    socket.on('job-stage-change', (data) => {
      expect(data.jobId).toBe('test-job-id');
      expect(data.stage).toBe('transcribing');
      expect(data.progress).toBe(50);
      done();
    });
    
    socket.connect();
    // Simulate server sending progress update
  });
});
```

### E2E Tests
```javascript
// Test complete user flow
describe('Video Translation E2E', () => {
  it('should process video from upload to download', async () => {
    // 1. Upload video file
    await page.setInputFiles('#file-input', 'test-video.mp4');
    await page.click('#upload-btn');
    
    // 2. Fill job options
    await page.selectOption('#source-lang', 'en');
    await page.selectOption('#target-lang', 'vi');
    await page.check('#burn-sub');
    
    // 3. Submit job
    await page.click('#submit-job');
    
    // 4. Wait for job completion
    await page.waitForSelector('.job-completed', { timeout: 60000 });
    
    // 5. Download results
    await page.click('#download-video');
    
    // Verify download started
    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('video.mp4');
  });
});
```

## Performance Optimization

### Lazy Loading
```javascript
const LazyJobProgress = React.lazy(() => import('./JobProgress'));
const LazyDownloadResults = React.lazy(() => import('./DownloadResults'));

const VideoTranslationApp = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyJobProgress jobId={currentJob?.id} />
      </Suspense>
      
      <Suspense fallback={<div>Loading...</div>}>
        <LazyDownloadResults outputs={currentJob?.outputs} />
      </Suspense>
    </div>
  );
};
```

### Debounced API Calls
```javascript
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
  const results = await searchGlossaries(query);
  setSearchResults(results);
}, 300);

const handleSearchChange = (event) => {
  debouncedSearch(event.target.value);
};
```

### Error Boundaries
```javascript
class VideoTranslationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Video Translation Error:', error, errorInfo);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong with video processing</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

## Security Considerations

### Input Validation
```javascript
const validateFile = (file) => {
  const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
  const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv'];
  
  if (file.size > maxSize) {
    throw new Error('File size exceeds 5GB limit');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Unsupported file format');
  }
  
  return true;
};
```

### Token Security
```javascript
// Store token securely
const storeToken = (token) => {
  // Use httpOnly cookies in production
  if (process.env.NODE_ENV === 'production') {
    // Set httpOnly cookie via API
    document.cookie = `accessToken=${token}; httpOnly; secure; sameSite=strict`;
  } else {
    // Use localStorage in development
    localStorage.setItem('accessToken', token);
  }
};
```

## Conclusion

This integration guide provides comprehensive instructions for implementing video translation features in your frontend application. The API supports all major video processing operations with real-time progress tracking and robust error handling.

For additional support or questions, please refer to the API documentation or contact the development team.
