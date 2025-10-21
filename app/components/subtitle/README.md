# Phụ đề (Subtitle) Components

## Tổng quan

Bộ component phụ đề cung cấp chức năng xuất và nhập phụ đề cho ứng dụng vidocr-clone.

## Components

### 1. SubtitlePanel
Component chính hiển thị trong sidebar, cung cấp giao diện để:
- Xuất phụ đề với các định dạng khác nhau (SRT, ASS, SRT cân bằng)
- Nhập phụ đề từ file

**Props:**
- `jobId?: string` - ID của job cần xử lý phụ đề
- `onSubtitleImported?: (success: boolean) => void` - Callback khi import thành công
- `onSubtitleExported?: (format: string) => void` - Callback khi export thành công

### 2. SubtitleManager
Modal component cung cấp giao diện chi tiết để:
- Chọn file phụ đề để import
- Validate file phụ đề
- Import phụ đề vào job

**Props:**
- `isOpen: boolean` - Trạng thái hiển thị modal
- `onClose: () => void` - Callback đóng modal
- `jobId?: string` - ID của job
- `onSubtitleImported?: (success: boolean) => void` - Callback khi import thành công
- `onSubtitleExported?: (format: string) => void` - Callback khi export thành công

## API Service

### subtitleService
Service cung cấp các API để:
- `exportSubtitle(request: SubtitleExportRequest)` - Xuất phụ đề
- `importSubtitle(request: SubtitleImportRequest)` - Nhập phụ đề
- `validateSubtitle(file: File)` - Validate file phụ đề
- `downloadSubtitle(downloadUrl: string)` - Tải xuống file phụ đề

## Cách sử dụng

### 1. Trong Sidebar
```tsx
import { SubtitlePanel } from '@/app/components/subtitle'

<SubtitlePanel 
  jobId="your-job-id"
  onSubtitleImported={(success) => {
    if (success) {
      console.log('Import phụ đề thành công')
    }
  }}
  onSubtitleExported={(format) => {
    console.log(`Export phụ đề ${format} thành công`)
  }}
/>
```

### 2. Modal Manager
```tsx
import { SubtitleManager } from '@/app/components/subtitle'

<SubtitleManager
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  jobId="your-job-id"
  onSubtitleImported={(success) => {
    // Handle import result
  }}
  onSubtitleExported={(format) => {
    // Handle export result
  }}
/>
```

## Định dạng hỗ trợ

- **SRT**: SubRip Subtitle format (chuẩn)
- **ASS**: Advanced SubStation Alpha format (hỗ trợ styling)
- **VTT**: WebVTT format (cho web)

## Tính năng

### Xuất phụ đề
- Xuất phụ đề SRT chuẩn
- Xuất phụ đề ASS với styling
- Xuất phụ đề SRT cân bằng (tự động cân bằng độ dài dòng)

### Nhập phụ đề
- Upload file phụ đề từ máy tính
- Validate file phụ đề trước khi import
- Hỗ trợ nhiều định dạng file
- Import phụ đề vào job để sử dụng

## Lưu ý

- Cần có `jobId` để thực hiện export/import phụ đề
- File phụ đề cần đúng định dạng và cú pháp
- Component sử dụng API service để giao tiếp với backend
- Hỗ trợ download tự động sau khi export thành công
