'use client'

import { useState } from 'react'
import { useVideoPreview } from '@/app/hooks/useVideoPreview'

interface VideoPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  videoS3Key: string
  subtitleS3Key?: string
  onPreviewGenerated?: (previewUrl: string) => void
}

export default function VideoPreviewModal({
  isOpen,
  onClose,
  videoS3Key,
  subtitleS3Key,
  onPreviewGenerated
}: VideoPreviewModalProps) {
  const { generatePreview, isLoading, error, previewUrl, previewInfo } = useVideoPreview()
  
  const [startTime, setStartTime] = useState(10)
  const [duration, setDuration] = useState(30)
  const [showSubtitles, setShowSubtitles] = useState(true)
  const [brightness, setBrightness] = useState(10)
  const [contrast, setContrast] = useState(5)
  const [quality, setQuality] = useState(8)

  const handleGeneratePreview = async () => {
    if (!subtitleS3Key) {
      alert('Cần có phụ đề để tạo preview')
      return
    }

    const result = await generatePreview({
      videoS3Key,
      subtitleS3Key,
      startTime,
      duration,
      showSubtitles,
      brightness,
      contrast,
      quality
    })

    if (result && onPreviewGenerated) {
      onPreviewGenerated(result.previewUrl)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-white">Tạo Video Preview</h3>
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
          {/* Preview Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Thời gian bắt đầu (giây)</label>
              <input
                type="number"
                value={startTime}
                onChange={(e) => setStartTime(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Thời lượng (giây)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                min="1"
                max="60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Chất lượng (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">{quality}/10</div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={showSubtitles}
                  onChange={(e) => setShowSubtitles(e.target.checked)}
                  className="rounded"
                />
                Hiển thị phụ đề
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Độ sáng (-50 đến 50)</label>
              <input
                type="range"
                min="-50"
                max="50"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">{brightness}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Độ tương phản (-10 đến 10)</label>
              <input
                type="range"
                min="-10"
                max="10"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">{contrast}</div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3">
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          )}

          {/* Preview Info */}
          {previewInfo && (
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3">
              <div className="text-green-300 text-sm">
                <div>Thời gian xử lý: {previewInfo.processingTime}ms</div>
                <div>Kích thước file: {(previewInfo.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                <div>Thời lượng thực tế: {previewInfo.actualDuration}s</div>
                <div>Độ phân giải: {previewInfo.videoInfo.width}x{previewInfo.videoInfo.height}</div>
              </div>
            </div>
          )}

          {/* Preview Video */}
          {previewUrl && (
            <div className="bg-black rounded-lg overflow-hidden">
              <video
                src={previewUrl}
                controls
                className="w-full h-auto"
                preload="metadata"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleGeneratePreview}
              disabled={isLoading || !subtitleS3Key}
              className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang tạo preview...' : 'Tạo Preview'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
