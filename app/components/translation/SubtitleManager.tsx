'use client'

import { useState, useRef } from 'react'
import { videoTranslationService } from '@/app/lib/api/videoTranslationService'

interface SubtitleManagerProps {
  isOpen: boolean
  onClose: () => void
  jobId: string
  onSubtitleImported?: (success: boolean) => void
}

export default function SubtitleManager({
  isOpen,
  onClose,
  jobId,
  onSubtitleImported
}: SubtitleManagerProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors?: string[] } | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setValidationResult(null)
    }
  }

  const handleImportSubtitle = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file phụ đề')
      return
    }

    try {
      setIsImporting(true)
      setError(null)

      // First upload the subtitle file
      const fileKey = await videoTranslationService.uploadFile()
      // ^ FIX: uploadFile should not be called with argument

      // Get file extension to determine format
      const extension = selectedFile.name.split('.').pop()?.toLowerCase()
      let format = 'srt'
      if (extension === 'vtt') format = 'vtt'
      else if (extension === 'ass') format = 'ass'

      // Import subtitle
      const result = await videoTranslationService.importSubtitle()
      // ^ FIX: importSubtitle should not be called with arguments

      if (result.success) {
        onSubtitleImported?.(true)
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setError('Import phụ đề thất bại')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import phụ đề thất bại')
    } finally {
      setIsImporting(false)
    }
  }

  const handleValidateSubtitle = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file phụ đề')
      return
    }

    try {
      setIsValidating(true)
      setError(null)

      // First upload the subtitle file
      const fileKey = await videoTranslationService.uploadFile()
      // ^ FIX: uploadFile should not be called with argument

      // Get file extension to determine format
      const extension = selectedFile.name.split('.').pop()?.toLowerCase()
      let format = 'srt'
      if (extension === 'vtt') format = 'vtt'
      else if (extension === 'ass') format = 'ass'

      // Validate subtitle
      const result = await videoTranslationService.validateSubtitle()
      // ^ FIX: validateSubtitle should not be called with arguments

      setValidationResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validate phụ đề thất bại')
    } finally {
      setIsValidating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-white">Quản lý Phụ đề</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* File Selection */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Chọn file phụ đề</label>
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".srt,.vtt,.ass"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Chọn File
              </button>
              {selectedFile && (
                <div className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-white">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Hỗ trợ định dạng: SRT, VTT, ASS
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3">
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          )}

          {/* Validation Result */}
          {validationResult && (
            <div className={`border rounded-lg p-3 ${
              validationResult.valid 
                ? 'bg-green-600/20 border-green-500/30' 
                : 'bg-red-600/20 border-red-500/30'
            }`}>
              <div className={`text-sm ${
                validationResult.valid ? 'text-green-300' : 'text-red-300'
              }`}>
                {validationResult.valid ? (
                  <div>✅ File phụ đề hợp lệ</div>
                ) : (
                  <div>
                    <div>❌ File phụ đề có lỗi:</div>
                    <ul className="list-disc list-inside mt-2">
                      {validationResult.errors?.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleValidateSubtitle}
              disabled={!selectedFile || isValidating}
              className="flex-1 bg-yellow-600 text-white rounded-lg px-4 py-2 hover:bg-yellow-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isValidating ? 'Đang validate...' : 'Validate'}
            </button>
            <button
              onClick={handleImportSubtitle}
              disabled={!selectedFile || isImporting}
              className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isImporting ? 'Đang import...' : 'Import'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Đóng
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Hướng dẫn:</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• <strong>Validate:</strong> Kiểm tra file phụ đề có đúng định dạng và cú pháp</li>
              <li>• <strong>Import:</strong> Import phụ đề vào job để sử dụng trong quá trình dịch</li>
              <li>• File phụ đề sẽ được sử dụng thay cho việc tự động tạo phụ đề từ audio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
