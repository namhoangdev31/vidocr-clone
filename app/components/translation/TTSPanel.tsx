'use client'

import { useState, useEffect } from 'react'
import { useMultiSpeakerTTS } from '@/app/hooks/useMultiSpeakerTTS'
import { VoiceProfile, MultiSpeakerTTSRequest } from '@/app/lib/api/videoTranslationService'

interface TTSPanelProps {
  initialText?: string
  onAudioGenerated?: (audioUrl: string) => void
}

export default function TTSPanel({ initialText = '', onAudioGenerated }: TTSPanelProps) {
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

  const [text, setText] = useState(initialText)
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [volume, setVolume] = useState(100)
  const [speed, setSpeed] = useState(100)
  const [pitch, setPitch] = useState(100)
  const [delayXuongDong, setDelayXuongDong] = useState(0.39)
  const [delayDauCham, setDelayDauCham] = useState(0.3)
  const [delayDauPhay, setDelayDauPhay] = useState(0.186)

  // Set default voice when profiles are loaded
  useEffect(() => {
    if (voiceProfiles.length > 0 && !selectedVoice) {
      setSelectedVoice(voiceProfiles[0].id)
    }
  }, [voiceProfiles, selectedVoice])

  // Notify parent when audio is generated
  useEffect(() => {
    if (resultAudioUrl && onAudioGenerated) {
      onAudioGenerated(resultAudioUrl)
    }
  }, [resultAudioUrl, onAudioGenerated])

  const handleGenerate = async () => {
    if (!text.trim() || !selectedVoice) {
      return
    }

    const request: MultiSpeakerTTSRequest = {
      segments: [{
        text: text.trim(),
        voiceId: selectedVoice,
        startTime: 0,
        endTime: 0
      }]
    }

    await generateTTS(request)
  }

  const handleDownload = () => {
    if (resultAudioUrl) {
      const link = document.createElement('a')
      link.href = resultAudioUrl
      link.download = `tts-${Date.now()}.wav`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Lồng tiếng (TTS)</h3>
      
      {/* Text Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Văn bản cần lồng tiếng
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập văn bản cần lồng tiếng..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Voice Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Giọng nói
        </label>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
      <div className="mb-4">
        <button
          onClick={handleGenerate}
          disabled={!text.trim() || !selectedVoice || isGenerating}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGenerating ? `Đang tạo... ${ttsProgress}%` : 'Tạo lồng tiếng'}
        </button>
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${ttsProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">Tiến độ: {ttsProgress}%</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Result Audio */}
      {resultAudioUrl && (
        <div className="space-y-3">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Kết quả:</h4>
            <audio controls className="w-full">
              <source src={resultAudioUrl} type="audio/wav" />
              Trình duyệt không hỗ trợ phát audio.
            </audio>
          </div>
          <button
            onClick={handleDownload}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Tải xuống file audio
          </button>
        </div>
      )}
    </div>
  )
}
