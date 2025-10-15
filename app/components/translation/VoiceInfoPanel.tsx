'use client'

import { useState, useEffect } from 'react'
import { useMultiSpeakerTTS } from '@/app/hooks/useMultiSpeakerTTS'

interface VoiceInfoPanelProps {
  selectedVoice: string
  onVoiceSelect: (voiceId: string) => void
}

export default function VoiceInfoPanel({ selectedVoice, onVoiceSelect }: VoiceInfoPanelProps) {
  const { voiceProfiles, isLoading, error, fetchVoiceProfiles } = useMultiSpeakerTTS()
  const [selectedVoiceInfo, setSelectedVoiceInfo] = useState<any>(null)

  useEffect(() => {
    if (selectedVoice && voiceProfiles.length > 0) {
      const voice = voiceProfiles.find(v => v.id === selectedVoice)
      setSelectedVoiceInfo(voice)
    }
  }, [selectedVoice, voiceProfiles])

  const handleVoicePreview = (voiceId: string) => {
    // This would play a preview of the voice
    // For now, just log it
    console.log('Previewing voice:', voiceId)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Thông tin giọng nói</h2>
        <button
          onClick={fetchVoiceProfiles}
          className="text-sm text-gray-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-400">Đang tải danh sách giọng nói...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Voice List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {voiceProfiles.map((voice) => (
              <div
                key={voice.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedVoice === voice.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => onVoiceSelect(voice.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{voice.name}</p>
                    <p className="text-sm opacity-75">
                      {voice.language} • {voice.gender || 'Unknown'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVoicePreview(voice.id)
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Voice Details */}
          {selectedVoiceInfo && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">
                {selectedVoiceInfo.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Ngôn ngữ:</span>
                  <span className="text-white">{selectedVoiceInfo.language}</span>
                </div>
                <div className="flex justify-between">
                  <span>Giới tính:</span>
                  <span className="text-white">{selectedVoiceInfo.gender || 'Không xác định'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chất lượng:</span>
                  <span className="text-white">{selectedVoiceInfo.quality || 'Cao'}</span>
                </div>
                {selectedVoiceInfo.description && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <p className="text-gray-400">{selectedVoiceInfo.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Voice Statistics */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Thống kê</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {voiceProfiles.length}
                </div>
                <div className="text-gray-400">Tổng số giọng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {voiceProfiles.filter(v => v.language === 'vi').length}
                </div>
                <div className="text-gray-400">Tiếng Việt</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
