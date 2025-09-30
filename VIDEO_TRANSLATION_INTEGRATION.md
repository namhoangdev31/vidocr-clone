# Video Translation API Integration

## Tổng quan

Dự án này đã được tích hợp hoàn chỉnh với Video Translation API để hỗ trợ:
- Upload video files với multipart support
- Real-time progress tracking qua WebSocket
- Job management và monitoring
- Download kết quả (SRT, ASS, VTT, MP4, Audio)
- Error handling và retry logic

## Cấu trúc dự án

### API Services
- `app/lib/api/videoTranslationService.ts` - Main API service
- `app/lib/websocket/socketService.ts` - WebSocket service
- `app/lib/config/environment.ts` - Configuration và constants

### Custom Hooks
- `app/hooks/useFileUpload.ts` - File upload logic
- `app/hooks/useJobManagement.ts` - Job management
- `app/hooks/useWebSocket.ts` - WebSocket integration

### Components
- `app/components/CreatePage.tsx` - Upload và tạo job
- `app/components/ProgressPage.tsx` - Danh sách jobs
- `app/components/ProgressDetailPage.tsx` - Chi tiết job và download
- `app/components/common/ErrorBoundary.tsx` - Error handling
- `app/components/common/Toast.tsx` - Notifications

### Utilities
- `app/lib/utils/errorHandler.ts` - Error handling và retry logic

## Tính năng đã triển khai

### 1. File Upload
- ✅ Drag & drop upload
- ✅ Multipart upload cho files lớn (>100MB)
- ✅ Progress tracking
- ✅ File validation (format, size)
- ✅ Error handling

### 2. Job Management
- ✅ Tạo translation job
- ✅ Real-time progress tracking
- ✅ Job status monitoring
- ✅ Cancel job
- ✅ Job history

### 3. WebSocket Integration
- ✅ Real-time connection status
- ✅ Upload progress events
- ✅ Job stage change events
- ✅ Job completion events
- ✅ Error events
- ✅ Auto-reconnection

### 4. Download & Export
- ✅ Download SRT subtitles
- ✅ Download ASS subtitles
- ✅ Download VTT subtitles
- ✅ Download MP4 video
- ✅ Download Audio
- ✅ Export với FFmpeg (soft subtitles)

### 5. Error Handling
- ✅ Comprehensive error codes
- ✅ User-friendly error messages
- ✅ Retry logic với exponential backoff
- ✅ Error boundaries
- ✅ Toast notifications

## Cách sử dụng

### 1. Environment Setup
```bash
# Thêm vào .env.local
NEXT_PUBLIC_API_BASE_URL=https://dichtudong-clone-api.onrender.com
```

### 2. Authentication
```typescript
// Set token sau khi login
videoTranslationService.setToken(accessToken)
```

### 3. Upload Video
```typescript
import { useFileUpload } from '@/app/hooks/useFileUpload'

const { uploadFile, isUploading, uploadProgress, error } = useFileUpload({
  onProgress: (progress) => console.log('Upload progress:', progress),
  onSuccess: (fileKey) => console.log('Upload successful:', fileKey),
  onError: (error) => console.error('Upload error:', error)
})

// Upload file
const fileKey = await uploadFile(file)
```

### 4. Create Translation Job
```typescript
import { useJobManagement } from '@/app/hooks/useJobManagement'

const { createJob, currentJob, isLoading } = useJobManagement()

const job = await createJob({
  fileKey: 'inputs/video123.mp4',
  sourceLang: 'en',
  targetLang: 'vi',
  burnSub: false,
  subtitleFormat: 'srt',
  model: 'gpt-4o-mini',
  aiProvider: 'openai',
  advanced: {
    removeOriginalText: false,
    removeBgm: false,
    mergeCaption: false,
    mergeOpenCaption: false
  }
})
```

### 5. Real-time Progress Tracking
```typescript
import { useWebSocket } from '@/app/hooks/useWebSocket'

const { onJobStageChange, onJobCompleted, onJobFailed } = useWebSocket()

onJobStageChange((data) => {
  console.log('Job stage changed:', data.stage, data.progress)
})

onJobCompleted((data) => {
  console.log('Job completed:', data.outputs)
})

onJobFailed((data) => {
  console.log('Job failed:', data.error)
})
```

### 6. Download Results
```typescript
import { videoTranslationService } from '@/app/lib/api/videoTranslationService'

// Get download URL
const response = await videoTranslationService.getDownloadUrl(outputKey)
const downloadUrl = response.url

// Download file
const link = document.createElement('a')
link.href = downloadUrl
link.download = 'filename.mp4'
link.click()
```

## API Endpoints

### File Upload
- `POST /uploads/presigned` - Get presigned URL
- `POST /uploads/multipart/initiate` - Initiate multipart upload
- `POST /uploads/multipart/sign-part` - Sign part for upload
- `POST /uploads/multipart/complete` - Complete multipart upload

### Job Management
- `POST /videos` - Create translation job
- `GET /jobs` - Get all jobs
- `GET /jobs/{id}/status` - Get job status
- `POST /videos/{id}/cancel` - Cancel job

### Downloads
- `GET /outputs/presigned?key={key}` - Get download URL

## WebSocket Events

### Client → Server
- `join-upload-session` - Join upload session
- `client-upload-progress` - Report upload progress

### Server → Client
- `upload-progress` - Upload progress update
- `upload-completed` - Upload completed
- `upload-cancelled` - Upload cancelled
- `job-stage-change` - Job stage changed
- `job-completed` - Job completed
- `job-failed` - Job failed

## Error Codes

### Client Errors (4xx)
- `40001` - Invalid language code
- `40002` - File not found
- `40003` - File size exceeded limit
- `40004` - Video duration exceeded limit
- `40005` - Invalid input parameters
- `40006` - Unsupported file format
- `40007` - Video validation failed
- `40901` - Job with same parameters already exists

### Server Errors (5xx)
- `50010` - ASR (Speech Recognition) failed
- `50020` - MT (Machine Translation) failed
- `50030` - Subtitle generation failed
- `50040` - Video burning failed
- `50050` - TTS (Text-to-Speech) failed
- `50060` - General processing error
- `50070` - AI provider unavailable

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## Performance Optimization

### 1. Lazy Loading
```typescript
const LazyProgressDetail = React.lazy(() => import('./ProgressDetailPage'))

<Suspense fallback={<div>Loading...</div>}>
  <LazyProgressDetail jobId={jobId} />
</Suspense>
```

### 2. Debounced API Calls
```typescript
import { debounce } from 'lodash'

const debouncedSearch = debounce(async (query) => {
  const results = await searchJobs(query)
  setSearchResults(results)
}, 300)
```

### 3. Error Boundaries
```typescript
import { ErrorBoundary } from '@/app/components/common/ErrorBoundary'

<ErrorBoundary>
  <VideoTranslationApp />
</ErrorBoundary>
```

## Security Considerations

### 1. Input Validation
- File type validation
- File size limits
- Language code validation
- Parameter sanitization

### 2. Token Security
- JWT token storage
- Token refresh handling
- Secure API calls

### 3. Error Handling
- No sensitive data in error messages
- Proper error logging
- User-friendly error display

## Monitoring & Analytics

### 1. Error Tracking
```typescript
import { logError } from '@/app/lib/utils/errorHandler'

try {
  await apiCall()
} catch (error) {
  logError(error, 'API_CALL_CONTEXT')
}
```

### 2. Performance Monitoring
- Upload progress tracking
- Job processing time
- WebSocket connection status
- Error rates

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check network connectivity
   - Verify API base URL
   - Check authentication token

2. **Upload Failed**
   - Check file size limits
   - Verify file format
   - Check network stability

3. **Job Creation Failed**
   - Verify all required parameters
   - Check language codes
   - Verify model availability

4. **Download Failed**
   - Check if job is completed
   - Verify output keys
   - Check download URL expiration

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('debug', 'video-translation:*')
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Update documentation
5. Submit pull request

## License

MIT License - see LICENSE file for details
