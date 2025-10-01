# 📁 Lib Directory Structure

## 📋 Tổng quan

Thư mục `lib` chứa tất cả các utilities, services, và configurations cho ứng dụng video translation.

## 🗂️ Cấu trúc thư mục

```
app/lib/
├── api/                          # API Services
│   ├── videoService.ts          # Legacy video service (deprecated)
│   └── videoTranslationService.ts # Main video translation API service
├── config/                       # Configuration files
│   └── environment.ts           # Environment variables và constants
├── types/                        # Type definitions (legacy)
│   └── api.ts                   # Legacy API types (deprecated)
├── utils/                        # Utility functions
│   ├── errorHandler.ts          # Error handling utilities
│   └── fileValidation.ts         # File validation utilities
├── websocket/                    # WebSocket services
│   └── socketService.ts         # WebSocket connection service
├── api.ts                        # Main API client và auth
├── firebase.ts                   # Firebase configuration
└── README.md                     # This file
```

## 🔧 API Services

### 1. **videoTranslationService.ts** (Main Service)
- **Mục đích**: Service chính cho Video Translation API
- **Tính năng**:
  - File upload (presigned URLs, multipart)
  - Job management (create, status, cancel)
  - AI Models API (list, recommend, estimate cost)
  - Language Detection API
  - Video Preview API
  - Multi-Speaker TTS API
  - Glossary Management API
  - Subtitle Management API
- **Types**: Chứa tất cả type definitions mới
- **Usage**: `import { videoTranslationService } from '@/app/lib/api/videoTranslationService'`

### 2. **videoService.ts** (Legacy Service)
- **Mục đích**: Service cũ cho video operations
- **Status**: Deprecated - sử dụng `videoTranslationService.ts` thay thế
- **Usage**: Chỉ sử dụng cho backward compatibility

### 3. **api.ts** (Main API Client)
- **Mục đích**: Axios client chính và authentication APIs
- **Tính năng**:
  - Authentication (Google OAuth, email/password)
  - Token management
  - Axios interceptors
  - Legacy translation API
- **Usage**: `import { apiClient, authAPI } from '@/app/lib/api'`

## 📝 Type Definitions

### Current (Recommended)
- **Location**: `videoTranslationService.ts`
- **Types**: Tất cả types mới cho Video Translation API
- **Usage**: `import { CreateJobRequest, JobResponse } from '@/app/lib/api/videoTranslationService'`

### Legacy (Deprecated)
- **Location**: `types/api.ts`
- **Status**: Deprecated - chỉ để backward compatibility
- **Usage**: Không nên sử dụng cho code mới

## ⚙️ Configuration

### environment.ts
- **API_BASE_URL**: Base URL cho API calls
- **FILE_LIMITS**: File size limits và supported formats
- **SUPPORTED_LANGUAGES**: Danh sách ngôn ngữ hỗ trợ
- **AI_MODELS**: Danh sách AI models
- **ERROR_CODES**: Error code mappings
- **WEBSOCKET_EVENTS**: WebSocket event constants
- **JOB_STAGES**: Job processing stages

## 🔌 WebSocket Services

### socketService.ts
- **Mục đích**: WebSocket connection management
- **Tính năng**:
  - Real-time job progress
  - Upload progress tracking
  - Auto-reconnection
  - Event handling

## 🛠️ Utilities

### errorHandler.ts
- **Mục đích**: Centralized error handling
- **Tính năng**:
  - API error processing
  - Retry logic với exponential backoff
  - Error logging

### fileValidation.ts
- **Mục đích**: File validation utilities
- **Tính năng**:
  - Video file validation
  - File size checking
  - Format validation

## 🔥 Firebase

### firebase.ts
- **Mục đích**: Firebase configuration
- **Tính năng**:
  - Firebase app initialization
  - Authentication setup

## 📚 Usage Examples

### 1. Sử dụng Video Translation Service
```typescript
import { videoTranslationService } from '@/app/lib/api/videoTranslationService'

// Upload file
const fileKey = await videoTranslationService.uploadFile(file)

// Create job
const job = await videoTranslationService.createJob({
  fileKey,
  sourceLang: 'en',
  targetLang: 'vi',
  model: 'gpt-4o',
  // ... other options
})

// Get AI models
const models = await videoTranslationService.getAIModels()
```

### 2. Sử dụng Authentication
```typescript
import { authAPI, tokenManager } from '@/app/lib/api'

// Login
const response = await authAPI.loginWithEmail(email, password)
tokenManager.setTokens(response.data.access_token, response.data.refresh_token)

// Check token
const token = tokenManager.getAccessToken()
```

### 3. Sử dụng WebSocket
```typescript
import { socketService } from '@/app/lib/websocket/socketService'

// Connect
socketService.connect()

// Listen for events
socketService.onJobProgress((data) => {
  console.log('Job progress:', data.progress)
})
```

### 4. Sử dụng Configuration
```typescript
import { API_BASE_URL, SUPPORTED_LANGUAGES, AI_MODELS } from '@/app/lib/config/environment'

console.log('API URL:', API_BASE_URL)
console.log('Languages:', SUPPORTED_LANGUAGES)
console.log('Models:', AI_MODELS)
```

## 🚨 Migration Guide

### Từ Legacy API sang New API

**Old (Deprecated):**
```typescript
import { CreateJobData, Job } from '@/app/lib/types/api'
import { VideoService } from '@/app/lib/api/videoService'
```

**New (Recommended):**
```typescript
import { CreateJobRequest, JobResponse } from '@/app/lib/api/videoTranslationService'
import { videoTranslationService } from '@/app/lib/api/videoTranslationService'
```

### Type Mapping
- `CreateJobData` → `CreateJobRequest`
- `Job` → `JobResponse`
- `JobOutputs` → `JobResponse['outputs']`
- `ApiError` → `ErrorResponse`

## 🔒 Security Considerations

### Token Management
- Tokens được lưu trong localStorage
- Auto-refresh khi token hết hạn
- Automatic logout khi refresh token hết hạn

### API Security
- Tất cả API calls đều có JWT authentication
- Input validation cho tất cả parameters
- Error handling không expose sensitive data

## 🧪 Testing

### Unit Tests
```bash
npm test -- lib/
```

### Integration Tests
```bash
npm run test:integration -- lib/
```

## 📈 Performance

### Caching
- API responses được cache khi có thể
- Token được cache trong localStorage
- WebSocket connections được reuse

### Optimization
- Lazy loading cho large files
- Multipart upload cho files > 100MB
- Debounced API calls

## 🐛 Troubleshooting

### Common Issues

1. **Import Errors**
   - Đảm bảo import từ đúng file
   - Sử dụng `videoTranslationService.ts` cho code mới

2. **Type Errors**
   - Sử dụng types từ `videoTranslationService.ts`
   - Không sử dụng legacy types từ `types/api.ts`

3. **API Connection**
   - Kiểm tra `API_BASE_URL` trong environment
   - Verify authentication token

4. **WebSocket Issues**
   - Check network connectivity
   - Verify WebSocket URL configuration

## 🔄 Future Plans

### Planned Improvements
- [ ] Remove legacy `types/api.ts`
- [ ] Remove legacy `videoService.ts`
- [ ] Add more comprehensive error handling
- [ ] Implement request/response caching
- [ ] Add API rate limiting
- [ ] Improve WebSocket reconnection logic

---

*Tài liệu này được cập nhật để phản ánh cấu trúc hiện tại của thư mục lib.*
