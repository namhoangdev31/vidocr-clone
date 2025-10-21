'use client'

import { useState, useRef } from 'react'
import { subtitleService } from '@/app/lib/api/subtitleService'

interface SubtitleManagerProps {
  isOpen: boolean
  onClose: () => void
  jobId?: string
  onSubtitleImported?: (success: boolean) => void
  onSubtitleExported?: (format: string) => void
}

export default function SubtitleManager({
  isOpen,
  onClose,
  jobId,
  onSubtitleImported,
  onSubtitleExported
}: SubtitleManagerProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleImportSubtitle = async () => {
    if (!selectedFile || !jobId) {
      setError('Vui lòng chọn file phụ đề và đảm bảo có job ID')
      return
    }

    try {
      setIsImporting(true)
      setError(null)

      // Get file extension to determine format
      const extension = selectedFile.name.split('.').pop()?.toLowerCase()
      const format = extension === 'vtt' ? 'vtt' : extension === 'ass' ? 'ass' : 'srt'

      const result = await subtitleService.importSubtitle({
        jobId,
        file: selectedFile,
        format: format as 'srt' | 'ass' | 'vtt'
      })

      if (result.success) {
        onSubtitleImported?.(true)
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setError(result.message || 'Import phụ đề thất bại')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import phụ đề thất bại')
    } finally {
      setIsImporting(false)
    }
  }

  const handleExportSubtitle = async (format: string) => {
    if (!jobId) {
      setError('Cần có job ID để export phụ đề')
      return
    }

    try {
      setIsExporting(true)
      setError(null)

      const isBalanced = format === 'srt-balanced'
      const exportFormat = isBalanced ? 'srt' : format

      const result = await subtitleService.exportSubtitle({
        jobId,
        format: exportFormat as 'srt' | 'ass' | 'vtt',
        balanced: isBalanced
      })

      if (result.success && result.downloadUrl) {
        await subtitleService.downloadSubtitle(result.downloadUrl)
        onSubtitleExported?.(format)
      } else {
        setError(result.message || `Export phụ đề ${format} thất bại`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Export phụ đề ${format} thất bại`)
    } finally {
      setIsExporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🐝</div>
            <h2 className="text-2xl font-semibold text-white">
              Xuất phụ đề hoặc nhập phụ đề
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="text-red-300 text-sm">{error}</div>
          </div>
        )}

        <div className="space-y-8">
          {/* Export Section */}
          <div>
            <div className="border-t border-gray-600 pt-6">
              <h3 className="text-xl font-semibold text-white mb-6">XUẤT PHỤ ĐỀ</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Export SRT */}
                <button
                  onClick={() => handleExportSubtitle('srt')}
                  disabled={isExporting}
                  className="group bg-gray-700 border border-blue-500 rounded-lg p-6 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                      Xuất phụ đề .SRT
                    </div>
                  </div>
                </button>

                {/* Export ASS */}
                <button
                  onClick={() => handleExportSubtitle('ass')}
                  disabled={isExporting}
                  className="group bg-gray-700 border border-blue-500 rounded-lg p-6 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                      Xuất phụ đề .ASS
                    </div>
                  </div>
                </button>

                {/* Export SRT Balanced */}
                <button
                  onClick={() => handleExportSubtitle('srt-balanced')}
                  disabled={isExporting}
                  className="group bg-gray-700 border border-blue-500 rounded-lg p-6 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                      Xuất phụ đề .SRT cân bằng
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Import Section */}
          <div>
            <div className="border-t border-gray-600 pt-6">
              <h3 className="text-xl font-semibold text-white mb-6">NHẬP PHỤ ĐỀ</h3>
              
              <div className="space-y-4">
                {/* File Selection */}
                <div>
                  <label className="block text-sm text-gray-300 mb-3">Chọn file phụ đề</label>
                  <div className="flex gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".srt,.vtt,.ass"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Chọn File
                    </button>
                    {selectedFile && (
                      <div className="flex-1 bg-gray-700 rounded-lg px-4 py-3 text-white flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Hỗ trợ định dạng: SRT, VTT, ASS
                  </p>
                </div>

                {/* Import Button */}
                <button
                  onClick={handleImportSubtitle}
                  disabled={!selectedFile || isImporting}
                  className="group bg-gray-700 border border-green-500 rounded-lg p-6 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <div className="text-white font-bold text-lg">CC</div>
                    </div>
                    <div className="bg-green-500 text-white px-3 py-1 rounded text-sm font-medium">
                      {isImporting ? 'Đang nhập...' : 'Nhập phụ đề'}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h4 className="text-sm font-medium text-white mb-3">Hướng dẫn sử dụng:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
              <div>
                <h5 className="font-medium text-white mb-2">Xuất phụ đề:</h5>
                <ul className="space-y-1">
                  <li>• <strong>SRT:</strong> Định dạng phụ đề chuẩn</li>
                  <li>• <strong>ASS:</strong> Hỗ trợ styling nâng cao</li>
                  <li>• <strong>SRT cân bằng:</strong> Tự động cân bằng độ dài dòng</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-white mb-2">Nhập phụ đề:</h5>
                <ul className="space-y-1">
                  <li>• Chọn file phụ đề từ máy tính</li>
                  <li>• Hỗ trợ định dạng SRT, VTT, ASS</li>
                  <li>• Phụ đề sẽ được sử dụng thay cho tự động tạo</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
