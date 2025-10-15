'use client'

import { useState, useEffect } from 'react'
import { useMultiSpeakerTTS } from '@/app/hooks/useMultiSpeakerTTS'
import { VoiceProfile, MultiSpeakerTTSRequest } from '@/app/lib/api/videoTranslationService'
import VoiceRecordingPanel from '@/app/components/translation/VoiceRecordingPanel'
import VoiceInfoPanel from '@/app/components/translation/VoiceInfoPanel'

export default function DubbingPage() {
  const {
    voiceProfiles,
    isLoading,
    error,
    isGenerating,
    ttsProgress,
    resultAudioUrl,
    fetchVoiceProfiles,
    generateTTS
  } = useMultiSpeakerTTS()

  const [activeMode, setActiveMode] = useState<'ai' | 'record'>('ai')
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [volume, setVolume] = useState(100)
  const [speed, setSpeed] = useState(100)
  const [pitch, setPitch] = useState(100)
  const [delayXuongDong, setDelayXuongDong] = useState(0.39)
  const [delayDauCham, setDelayDauCham] = useState(0.3)
  const [delayDauPhay, setDelayDauPhay] = useState(0.186)
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null)
  const [ttsHistory, setTtsHistory] = useState<Array<{
    id: string
    text: string
    voice: string
    audioUrl: string
    timestamp: Date
  }>>([])

  // Set default voice when profiles are loaded
  useEffect(() => {
    if (voiceProfiles.length > 0 && !selectedVoice) {
      setSelectedVoice(voiceProfiles[0].id)
    }
  }, [voiceProfiles, selectedVoice])

  // Update generated audio URL when TTS completes
  useEffect(() => {
    if (resultAudioUrl) {
      setGeneratedAudioUrl(resultAudioUrl)
    }
  }, [resultAudioUrl])

  const handleAITTSGenerate = async () => {
    if (!text.trim() || !selectedVoice) {
      return
    }

    const request: MultiSpeakerTTSRequest = {
      segments: [{
        text: text.trim(),
        speakerId: selectedVoice,
        startMs: 0,
        endMs: 0
      }],
      jobId: 'dubbing-' + Date.now().toString()
    }

    const result = await generateTTS(request)
    
    if (result?.success && resultAudioUrl) {
      // Add to history
      const historyItem = {
        id: Date.now().toString(),
        text: text.trim(),
        voice: selectedVoice,
        audioUrl: resultAudioUrl,
        timestamp: new Date()
      }
      setTtsHistory(prev => [historyItem, ...prev])
    }
  }

  const handleRecordingComplete = (audioBlob: Blob) => {
    const url = URL.createObjectURL(audioBlob)
    setGeneratedAudioUrl(url)
    
    // Add to history
    const historyItem = {
      id: Date.now().toString(),
      text: 'Bản thu âm thủ công',
      voice: 'Manual Recording',
      audioUrl: url,
      timestamp: new Date()
    }
    setTtsHistory(prev => [historyItem, ...prev])
  }

  const handleDownload = (audioUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClearHistory = () => {
    // Revoke URLs to free memory
    ttsHistory.forEach(item => {
      URL.revokeObjectURL(item.audioUrl)
    })
    setTtsHistory([])
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-3 text-center">
            Studio Lồng Tiếng
          </h1>
          <p className="text-lg text-gray-400 text-center">
            Tạo giọng nói AI hoặc thu âm thủ công cho video của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mode Selection */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Chọn phương thức</h2>
              <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setActiveMode('ai')}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeMode === 'ai'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Lồng tiếng
                  </div>
                </button>
                <button
                  onClick={() => setActiveMode('record')}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeMode === 'record'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Thu âm thủ công
                  </div>
                </button>
              </div>
            </div>

            {/* AI TTS Panel */}
            {activeMode === 'ai' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">AI Lồng tiếng</h2>
                
                {/* Text Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Văn bản cần lồng tiếng
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Nhập văn bản cần lồng tiếng..."
                    className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Voice Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Giọng nói
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <option>Đang tải danh sách giọng nói...</option>
                    ) : (
                      voiceProfiles.map((voice) => (
                        <option key={voice.id} value={voice.id}>
                          {voice.name} ({voice.language})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Advanced Settings */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Âm lượng: {volume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Tốc độ: {speed}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Cao độ: {pitch}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={pitch}
                      onChange={(e) => setPitch(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Delay xuống dòng: {delayXuongDong}s
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={delayXuongDong}
                      onChange={(e) => setDelayXuongDong(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleAITTSGenerate}
                  disabled={!text.trim() || !selectedVoice || isGenerating}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? `Đang tạo... ${ttsProgress}%` : 'Tạo lồng tiếng AI'}
                </button>

                {/* Progress Bar */}
                {isGenerating && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${ttsProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Tiến độ: {ttsProgress}%</p>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* Voice Recording Panel */}
            {activeMode === 'record' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Thu âm thủ công</h2>
                <VoiceRecordingPanel onRecordingComplete={handleRecordingComplete} />
              </div>
            )}

            {/* Generated Audio Preview */}
            {generatedAudioUrl && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Bản lồng tiếng đã tạo</h2>
                <audio controls className="w-full mb-4">
                  <source src={generatedAudioUrl} type="audio/webm" />
                  Trình duyệt không hỗ trợ phát audio.
                </audio>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(generatedAudioUrl, `voiceover-${Date.now()}.${activeMode === 'ai' ? 'wav' : 'webm'}`)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Tải xuống
                  </button>
                  <button
                    onClick={() => setGeneratedAudioUrl(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Tạo lại
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voice Info Panel */}
            <VoiceInfoPanel
              selectedVoice={selectedVoice}
              onVoiceSelect={setSelectedVoice}
            />

            {/* History */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Lịch sử</h2>
                {ttsHistory.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
              
              {ttsHistory.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Chưa có bản lồng tiếng nào
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {ttsHistory.map((item) => (
                    <div key={item.id} className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium truncate">
                            {item.text}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.voice} • {item.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownload(item.audioUrl, `voiceover-${item.id}.${item.voice === 'Manual Recording' ? 'webm' : 'wav'}`)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      </div>
                      <audio controls className="w-full">
                        <source src={item.audioUrl} type="audio/webm" />
                      </audio>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Thao tác nhanh</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setText('Xin chào, đây là test lồng tiếng')}
                  className="w-full text-left px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Sử dụng văn bản mẫu
                </button>
                <button
                  onClick={() => setText('')}
                  className="w-full text-left px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Xóa văn bản
                </button>
                <button
                  onClick={fetchVoiceProfiles}
                  className="w-full text-left px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Làm mới danh sách giọng nói
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
