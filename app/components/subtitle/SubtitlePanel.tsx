'use client'

import { useState } from 'react'
import SubtitleManager from './SubtitleManager'
import { subtitleService } from '@/app/lib/api/subtitleService'

interface SubtitlePanelProps {
  jobId?: string
  onSubtitleImported?: (success: boolean) => void
  onSubtitleExported?: (format: string) => void
}

export default function SubtitlePanel({
  jobId,
  onSubtitleImported,
  onSubtitleExported
}: SubtitlePanelProps) {
  const [isManagerOpen, setIsManagerOpen] = useState(false)

  const handleOpenManager = () => {
    setIsManagerOpen(true)
  }

  const handleCloseManager = () => {
    setIsManagerOpen(false)
  }

  const handleSubtitleImported = (success: boolean) => {
    onSubtitleImported?.(success)
    if (success) {
      handleCloseManager()
    }
  }

  const handleSubtitleExported = async (format: string) => {
    if (!jobId) {
      alert('Cần có job ID để export phụ đề')
      return
    }

    try {
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
        alert(result.message || `Export phụ đề ${format} thất bại`)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : `Export phụ đề ${format} thất bại`)
    }
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="text-2xl">🐝</div>
          <h2 className="text-2xl font-semibold text-white">
            Xuất phụ đề hoặc nhập phụ đề
          </h2>
        </div>

        {/* Export Section */}
        <div>
          <div className="border-t border-gray-600 pt-6">
            <h3 className="text-xl font-semibold text-white mb-6">XUẤT PHỤ ĐỀ</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Export SRT */}
              <button
                onClick={() => handleSubtitleExported('srt')}
                className="group bg-gray-700 border border-blue-500 rounded-lg p-4 hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium inline-block">
                      Xuất phụ đề .SRT
                    </div>
                  </div>
                </div>
              </button>

              {/* Export ASS */}
              <button
                onClick={() => handleSubtitleExported('ass')}
                className="group bg-gray-700 border border-blue-500 rounded-lg p-4 hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium inline-block">
                      Xuất phụ đề .ASS
                    </div>
                  </div>
                </div>
              </button>

              {/* Export SRT Balanced */}
              <button
                onClick={() => handleSubtitleExported('srt-balanced')}
                className="group bg-gray-700 border border-blue-500 rounded-lg p-4 hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium inline-block">
                      Xuất phụ đề .SRT cân bằng
                    </div>
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
            
            <button
              onClick={handleOpenManager}
              className="group bg-gray-700 border border-green-500 rounded-lg p-4 hover:bg-gray-600 transition-colors w-full"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-white font-bold text-lg">CC</div>
                </div>
                <div className="flex-1">
                  <div className="bg-green-500 text-white px-3 py-1 rounded text-sm font-medium inline-block">
                    Nhập phụ đề
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-white mb-3">Hướng dẫn:</h4>
          <div className="text-xs text-gray-300 space-y-2">
            <div>
              <strong>Xuất phụ đề:</strong> Tải xuống phụ đề đã tạo với các định dạng khác nhau
            </div>
            <div>
              <strong>Nhập phụ đề:</strong> Upload file phụ đề có sẵn để sử dụng thay cho tự động tạo
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle Manager Modal */}
      <SubtitleManager
        isOpen={isManagerOpen}
        onClose={handleCloseManager}
        jobId={jobId}
        onSubtitleImported={handleSubtitleImported}
        onSubtitleExported={handleSubtitleExported}
      />
    </>
  )
}
