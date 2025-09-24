'use client'

import { useState, useRef, useCallback } from 'react'
import * as FFmpegWasm from '@ffmpeg/ffmpeg'
import { translationAPI } from '@/app/lib/api'

type SubtitleCue = {
  id: string
  startMs: number
  endMs: number
  text: string
}

const timeStringToMs = (input: string) => {
  // supports SRT (00:00:00,000) and VTT (00:00:00.000)
  const cleaned = input.trim().replace(',', '.')
  const match = cleaned.match(/^(\d{2}):(\d{2}):(\d{2})\.(\d{1,3})$/)
  if (!match) return 0
  const [, hh, mm, ss, ms] = match
  const hours = parseInt(hh, 10)
  const minutes = parseInt(mm, 10)
  const seconds = parseInt(ss, 10)
  const millis = parseInt(ms.padEnd(3, '0'), 10)
  return (((hours * 60 + minutes) * 60 + seconds) * 1000) + millis
}

const msToSrtTime = (msTotal: number) => {
  const ms = Math.max(0, Math.floor(msTotal))
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const millis = ms % 1000
  const pad = (n: number, w = 2) => n.toString().padStart(w, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(millis, 3)}`
}

const msToVttTime = (msTotal: number) => {
  const ms = Math.max(0, Math.floor(msTotal))
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const millis = ms % 1000
  const pad = (n: number, w = 2) => n.toString().padStart(w, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(millis, 3)}`
}

const parseSrt = (content: string): SubtitleCue[] => {
  const blocks = content.replace(/\r/g, '').split(/\n\n+/)
  const cues: SubtitleCue[] = []
  for (const block of blocks) {
    const lines = block.split('\n').filter(Boolean)
    if (lines.length < 2) continue
    // Optional index at line 0; detect time line (has -->)
    let timeLineIndex = 0
    if (!/-->/.test(lines[0])) {
      timeLineIndex = 1
    }
    const timeLine = lines[timeLineIndex]
    const m = timeLine.match(/(\d{2}:\d{2}:\d{2}[,.]\d{1,3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{1,3})/)
    if (!m) continue
    const startMs = timeStringToMs(m[1])
    const endMs = timeStringToMs(m[2])
    const text = lines.slice(timeLineIndex + 1).join('\n')
    cues.push({ id: `${startMs}-${endMs}-${cues.length}`, startMs, endMs, text })
  }
  return cues
}

const parseVtt = (content: string): SubtitleCue[] => {
  const normalized = content.replace(/\r/g, '')
  const withoutHeader = normalized.replace(/^WEBVTT[^\n]*\n+/, '')
  const blocks = withoutHeader.split(/\n\n+/)
  const cues: SubtitleCue[] = []
  for (const block of blocks) {
    const lines = block.split('\n').filter(Boolean)
    if (lines.length === 0) continue
    let timeLineIndex = 0
    if (!/-->/.test(lines[0]) && lines.length > 1) timeLineIndex = 1
    const timeLine = lines[timeLineIndex]
    const m = timeLine.match(/(\d{2}:\d{2}:\d{2}[,.]\d{1,3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{1,3})/)
    if (!m) continue
    const startMs = timeStringToMs(m[1])
    const endMs = timeStringToMs(m[2])
    const text = lines.slice(timeLineIndex + 1).join('\n')
    cues.push({ id: `${startMs}-${endMs}-${cues.length}`, startMs, endMs, text })
  }
  return cues
}

const cuesToSrt = (cues: SubtitleCue[]) => {
  return cues
    .map((c, idx) => `${idx + 1}\n${msToSrtTime(c.startMs)} --> ${msToSrtTime(c.endMs)}\n${c.text}`)
    .join('\n\n')
}

const cuesToVtt = (cues: SubtitleCue[]) => {
  const body = cues
    .map((c) => `${msToVttTime(c.startMs)} --> ${msToVttTime(c.endMs)}\n${c.text}`)
    .join('\n\n')
  return `WEBVTT\n\n${body}`
}

export default function CreatePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTimeMs, setCurrentTimeMs] = useState(0)
  const [durationMs, setDurationMs] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [dragState, setDragState] = useState<null | { type: 'start' | 'end'; index: number; startClientX: number; startMsSnapshot: number; endMsSnapshot: number; pxPerMs: number }>(null)
  const [isExporting, setIsExporting] = useState(false)
  type FFmpegInstance = any
  const ffmpegRef = useRef<FFmpegInstance | null>(null)

  const getOrCreateFfmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current
    const ffmpeg = (FFmpegWasm as any).createFFmpeg({ log: false })
    await ffmpeg.load()
    ffmpegRef.current = ffmpeg
    return ffmpeg
  }

  // UI states
  const [autoDetect, setAutoDetect] = useState(false)
  const [showSourceDropdown, setShowSourceDropdown] = useState(false)
  const [showTargetDropdown, setShowTargetDropdown] = useState(false)
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [sourceLang, setSourceLang] = useState('Chinese')
  const [targetLang, setTargetLang] = useState('Vietnamese')
  const [selectedModel, setSelectedModel] = useState('ChatGPT 4.1 Giá Rẻ (1 ký tự trên dưới 1 token)')
  const [translationMethod, setTranslationMethod] = useState<'soft' | 'hard' | 'text' | 'dubbing' | 'dubbingV2'>('soft')
  const [removeOriginalText, setRemoveOriginalText] = useState(false)
  const [removeBackgroundMusic, setRemoveBackgroundMusic] = useState(false)
  const [mergeCaptions, setMergeCaptions] = useState(false)
  const [mergeOpenCaptions, setMergeOpenCaptions] = useState(false)
  const [brightness, setBrightness] = useState(160)
  const [contrast, setContrast] = useState(5)

  // Subtitles state (source and target tracks)
  const [sourceSubtitles, setSourceSubtitles] = useState<SubtitleCue[]>([])
  const [targetSubtitles, setTargetSubtitles] = useState<SubtitleCue[]>([])
  const subtitleFileInputRef = useRef<HTMLInputElement>(null)

  const availableLanguages = ['Chinese', 'English', 'Korean', 'Japanese', 'Vietnamese', 'Spanish', 'French']
  const availableModels = [
    'ChatGPT 4.1 Giá Rẻ (1 ký tự trên dưới 1 token)',
    'ChatGPT 4o Giá Rẻ (1 ký tự trên dưới 1 token)',
    'ChatGPT 5 Giá Rẻ (1 ký tự trên dưới 1 token)',
    'ChatGPT 4 Giá Rẻ (1 ký tự trên dưới 8 token)',
    'Dịch Theo Ngữ Cảnh Dài (1 ký tự dịch bằng 20 token)',
    'ChatGPT o1 Mini (1 ký tự trên dưới 8 token)',
    'ChatGPT o3 Mini (1 ký tự trên dưới 6 token)',
    'ChatGPT 4o (1 ký tự trên dưới 12 token)',
    'ChatGPT 4.1 (1 ký tự trên dưới 12 token)',
    'ChatGPT 5 (1 ký tự trên dưới 12 token)'
  ]

  // Supported video formats
  const supportedFormats = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/mkv',
    'video/m4v'
  ]

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Handle file validation
  const validateFile = (file: File) => {
    if (!supportedFormats.includes(file.type)) {
      alert('Định dạng file không được hỗ trợ. Vui lòng chọn file video hợp lệ.')
      return false
    }

    // Check file size (max 500MB)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
      alert('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 500MB.')
      return false
    }

    return true
  }

  // Simulate upload progress
  const simulateUpload = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Create video preview URL
    const previewUrl = URL.createObjectURL(file)
    setVideoPreview(previewUrl)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    setIsUploading(false)
  }

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) return

    setUploadedFile(file)
    await simulateUpload(file)
  }

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  // Handle click to browse files
  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleVideoTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    setCurrentTimeMs(Math.floor(v.currentTime * 1000))
  }

  const handleVideoLoadedMetadata = () => {
    const v = videoRef.current
    if (!v) return
    setDurationMs(Math.floor((v.duration || 0) * 1000))
  }

  const getActiveTrack = () => (targetSubtitles.length ? targetSubtitles : sourceSubtitles)
  const setActiveTrack = (updater: (list: SubtitleCue[]) => SubtitleCue[]) => {
    if (targetSubtitles.length) setTargetSubtitles(updater(targetSubtitles))
    else setSourceSubtitles(updater(sourceSubtitles))
  }

  const onGripMouseDown = (e: React.MouseEvent, index: number, type: 'start' | 'end') => {
    e.stopPropagation()
    const container = timelineRef.current
    if (!container || durationMs <= 0) return
    const rect = container.getBoundingClientRect()
    const pxPerMs = rect.width / durationMs
    const track = getActiveTrack()
    const cue = track[index]
    setDragState({
      type,
      index,
      startClientX: e.clientX,
      startMsSnapshot: cue.startMs,
      endMsSnapshot: cue.endMs,
      pxPerMs,
    })
    const onMove = (ev: MouseEvent) => {
      setDragState(prev => {
        if (!prev) return prev
        const dx = ev.clientX - prev.startClientX
        const dMs = Math.round(dx / prev.pxPerMs)
        setActiveTrack(list => list.map((c, i) => {
          if (i !== prev.index) return c
          if (prev.type === 'start') {
            const nextStart = Math.max(0, Math.min(prev.endMsSnapshot - 10, prev.startMsSnapshot + dMs))
            return { ...c, startMs: nextStart }
          } else {
            const nextEnd = Math.min(durationMs, Math.max(prev.startMsSnapshot + 10, prev.endMsSnapshot + dMs))
            return { ...c, endMs: nextEnd }
          }
        }))
        return prev
      })
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      setDragState(null)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // Import subtitles (SRT/VTT)
  const handleBrowseSubtitleClick = () => {
    subtitleFileInputRef.current?.click()
  }

  const handleSubtitleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    const text = await file.text()
    const lower = file.name.toLowerCase()
    let cues: SubtitleCue[] = []
    if (lower.endsWith('.srt')) {
      cues = parseSrt(text)
    } else if (lower.endsWith('.vtt')) {
      cues = parseVtt(text)
    } else {
      alert('Định dạng phụ đề không hỗ trợ. Chỉ hỗ trợ .srt hoặc .vtt')
      return
    }
    setSourceSubtitles(cues)
  }

  // Start translation (stub)
  const startTranslation = () => {
    if (!uploadedFile) {
      alert('Vui lòng chọn video trước khi bắt đầu dịch')
      return
    }
    // Placeholder: thực hiện gọi API ở đây
    alert(`Bắt đầu dịch: \n- Source: ${sourceLang}${autoDetect ? ' (auto-detect)' : ''}\n- Target: ${targetLang}\n- Model: ${selectedModel}\n- Method: ${translationMethod}\n- Options: removeOriginalText=${removeOriginalText}, removeBackgroundMusic=${removeBackgroundMusic}, mergeCaptions=${mergeCaptions}, mergeOpenCaptions=${mergeOpenCaptions}\n- Brightness: ${brightness}\n- Contrast: ${contrast}`)
  }

  const translateSubtitles = async () => {
    const src = sourceSubtitles
    if (src.length === 0) {
      alert('Cần phụ đề nguồn để dịch')
      return
    }
    try {
      setIsUploading(true)
      const results: SubtitleCue[] = []
      for (const c of src) {
        const res = await translationAPI.translateText({
          text: c.text,
          sourceLang: sourceLang,
          targetLang: targetLang,
        })
        results.push({ ...c, id: c.id + '-t', text: res.translatedText })
      }
      setTargetSubtitles(results)
      alert('Dịch phụ đề hoàn tất')
    } catch (e) {
      console.error(e)
      alert('Gọi API dịch thất bại')
    } finally {
      setIsUploading(false)
    }
  }

  // Remove uploaded file
  const removeFile = () => {
    setUploadedFile(null)
    setVideoPreview(null)
    setUploadProgress(0)
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Export soft subtitles embedded (MKV with SRT)
  const exportSoftWithSubtitles = async () => {
    if (!uploadedFile) {
      alert('Vui lòng chọn video')
      return
    }
    const track = targetSubtitles.length ? targetSubtitles : sourceSubtitles
    if (track.length === 0) {
      alert('Chưa có phụ đề để xuất')
      return
    }
    try {
      setIsExporting(true)
      const ffmpeg = await getOrCreateFfmpeg()
      const inputName = 'input.mp4'
      const subsName = 'subs.srt'
      const outputName = 'output.mkv'
      // write inputs
      ffmpeg.FS('writeFile', inputName, await (FFmpegWasm as any).fetchFile(uploadedFile))
      ffmpeg.FS('writeFile', subsName, new TextEncoder().encode(cuesToSrt(track)))
      // mux: copy streams, add srt as subtitle stream
      await ffmpeg.run('-i', inputName, '-i', subsName, '-c', 'copy', '-c:s', 'srt', outputName)
      const data = ffmpeg.FS('readFile', outputName)
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/x-matroska' }))
      const a = document.createElement('a')
      a.href = url
      a.download = (uploadedFile.name.replace(/\.[^.]+$/, '') || 'video') + '_with_subs.mkv'
      a.click()
      URL.revokeObjectURL(url)
      // cleanup
      ffmpeg.FS('unlink', inputName)
      ffmpeg.FS('unlink', subsName)
      ffmpeg.FS('unlink', outputName)
    } catch (e) {
      console.error(e)
      alert('Xuất file thất bại. Trình duyệt có thể thiếu tài nguyên. Thử lại với file nhỏ hơn.')
    } finally {
      setIsExporting(false)
    }
  }
  return (
    <div className="bg-gray-900 px-8 py-8 min-h-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-3 text-center">
            Video Subtitle Translation Editor
          </h1>
          <p className="text-lg text-gray-400 text-center">
            Upload your video and configure translation settings
          </p>
        </div>

        {/* File Upload Section */}
        <div className="space-y-8">
          {/* Upload Area */}
          <div className={`w-full h-96 border-2 border-dashed rounded-lg bg-gray-800 bg-opacity-50 flex flex-col items-center justify-center p-8 transition-colors cursor-pointer ${isDragOver
              ? 'border-blue-500 bg-blue-500 bg-opacity-10'
              : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            {/* Subtitle import moved to ProgressDetailPage */}

            {!uploadedFile ? (
              <div className="flex flex-col items-center space-y-6">
                {/* Upload Icon */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${isDragOver ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>

                {/* Text */}
                <div className="text-center">
                  <h3 className="text-xl font-medium text-white mb-3">
                    {isDragOver ? 'Drop your video file here' : 'Drop your video file here'}
                  </h3>
                  <p className="text-lg text-gray-400">
                    or click to browse files
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports: MP4, AVI, MOV, WMV, FLV, WebM, MKV (Max: 500MB)
                  </p>
                </div>

                {/* Cloud Service Options */}
                <div className="flex flex-wrap gap-6 justify-center">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.28 6.28a.75.75 0 00-1.06 1.06L8.94 11H3a1 1 0 100 2h5.94l-3.72 3.66a.75.75 0 101.06 1.06L11 13l4.72 4.72a.75.75 0 101.06-1.06L13.06 13H19a1 1 0 100-2h-5.94l3.72-3.66a.75.75 0 00-1.06-1.06L11 11L6.28 6.28z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">Google Drive</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.71 6.71a1 1 0 00-1.42 0l-4 4a1 1 0 000 1.42l4 4a1 1 0 001.42-1.42L4.42 11H20a1 1 0 000-2H4.42l3.29-3.29a1 1 0 000-1.42z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">Dropbox</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25 4.83 4.83 0 01-7.72 0 4.83 4.83 0 01-3.77 4.25 4.83 4.83 0 000 6.62 4.83 4.83 0 013.77 4.25 4.83 4.83 0 017.72 0 4.83 4.83 0 013.77-4.25 4.83 4.83 0 000-6.62z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">TikTok</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">YouTube</span>
                  </div>
                </div>
              </div>
            ) : (
              /* File Uploaded Display */
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                {/* Video Preview */}
                {videoPreview && !isUploading && (
                  <div className="w-64 h-36 bg-black rounded-lg overflow-hidden relative">
                    <video
                      ref={videoRef}
                      src={videoPreview}
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                      onLoadedMetadata={handleVideoLoadedMetadata}
                      onTimeUpdate={handleVideoTimeUpdate}
                    />
                    {/* Subtitle Overlay */}
                    {(() => {
                      const track = targetSubtitles.length > 0 ? targetSubtitles : sourceSubtitles
                      if (track.length === 0) return null
                      const cue = track.find(c => currentTimeMs >= c.startMs && currentTimeMs <= c.endMs)
                      if (!cue) return null
                      return (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 bottom-2 px-2 py-1 bg-black/60 text-white text-[10px] leading-snug rounded max-w-[95%] text-center whitespace-pre-wrap"
                          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                        >
                          {cue.text}
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Upload Progress */}
                {isUploading && (
                  <div className="w-full max-w-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Uploading...</span>
                      <span className="text-sm text-gray-300">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* File Info */}
                <div className="text-center">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg font-medium text-white">{uploadedFile.name}</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>

                {/* Action Buttons */}
                {!isUploading && (
                  <div className="flex gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBrowseClick()
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Change File
                    </button>
                    {/* Import subtitles moved to ProgressDetailPage */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile()
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language Settings */}
          <div className="bg-gray-800 rounded-lg p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Language Settings</h3>
              <button
                className={`text-sm px-3 py-2 rounded border ${autoDetect ? 'border-blue-500 text-blue-400' : 'border-gray-500 text-gray-300'}`}
                onClick={() => setAutoDetect(!autoDetect)}
              >
                Auto-detect: {autoDetect ? 'On' : 'Off'}
              </button>
            </div>

            <div className="flex items-end gap-4">
              {/* Source Language */}
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-2">Source Language</label>
                <button
                  className="w-full bg-gray-600 rounded-lg px-4 py-3 flex items-center justify-between text-white"
                  onClick={() => setShowSourceDropdown((v) => !v)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🌐</span>
                    <span>{sourceLang}</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showSourceDropdown && (
                  <div className="mt-2 bg-gray-700 rounded-lg border border-gray-600 shadow-lg overflow-hidden">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSourceLang(lang)
                          setShowSourceDropdown(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${sourceLang === lang ? 'bg-gray-600 text-white' : 'text-gray-200 hover:bg-gray-600'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Switch Button */}
              <div className="pb-3">
                <button
                  className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center"
                  onClick={() => {
                    const tmp = sourceLang
                    setSourceLang(targetLang)
                    setTargetLang(tmp)
                  }}
                >
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* Target Language */}
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-2">Target Language</label>
                <button
                  className="w-full bg-gray-600 rounded-lg px-4 py-3 flex items-center justify-between text-white"
                  onClick={() => setShowTargetDropdown((v) => !v)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🌐</span>
                    <span>{targetLang}</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showTargetDropdown && (
                  <div className="mt-2 bg-gray-700 rounded-lg border border-gray-600 shadow-lg overflow-hidden">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setTargetLang(lang)
                          setShowTargetDropdown(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${targetLang === lang ? 'bg-gray-600 text-white' : 'text-gray-200 hover:bg-gray-600'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Model Selection */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Lựa chọn mô hình AI</h3>
            <div className="relative">
              <button
                className="w-full bg-gray-600 rounded-lg px-4 py-3 flex items-center justify-between text-white"
                onClick={() => setShowModelDropdown((v) => !v)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-300">Model AI:</span>
                  <span>{selectedModel}</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showModelDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-10 overflow-hidden max-h-80 overflow-y-auto">
                  {availableModels.map((model) => (
                    <button
                      key={model}
                      onClick={() => {
                        setSelectedModel(model)
                        setShowModelDropdown(false)
                      }}
                      className={`w-full px-4 py-3 text-left ${selectedModel === model ? 'bg-gray-600 text-white' : 'text-gray-200 hover:bg-gray-600'}`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Translation Options */}
          <div className="bg-gray-800 rounded-lg p-8">
            <h3 className="text-xl font-medium text-white mb-8">Translation Options</h3>

            {/* Translation Method Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => setTranslationMethod('soft')}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg ${translationMethod === 'soft' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Soft Sub (.SRT)</span>
              </button>
              <button
                onClick={() => setTranslationMethod('hard')}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg ${translationMethod === 'hard' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Hard Sub</span>
              </button>
              <button
                onClick={() => setTranslationMethod('text')}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg ${translationMethod === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h14a2 2 0 012 2v0" />
                </svg>
                <span className="text-sm">Text Translation</span>
              </button>
              <button
                onClick={() => setTranslationMethod('dubbing')}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg ${translationMethod === 'dubbing' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 8.464a5 5 0 000 7.072M5.636 5.636a9 9 0 000 12.728" />
                </svg>
                <span className="text-sm">Audio Dubbing</span>
              </button>
              <button
                onClick={() => setTranslationMethod('dubbingV2')}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg ${translationMethod === 'dubbingV2' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span className="text-sm">Audio Dubbing V2</span>
              </button>
            </div>

            {/* Advanced Tools */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-white mb-6">Advanced Tools</h4>

              <div className="grid grid-cols-2 gap-6">
                {/* Toggle Switches */}
                <button
                  onClick={() => setRemoveOriginalText(!removeOriginalText)}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-700"
                >
                  <div className={`relative w-12 h-7 rounded-full ${removeOriginalText ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform transform ${removeOriginalText ? 'translate-x-6' : 'translate-x-1'}`}></div>
                  </div>
                  <span className="text-gray-300">Remove original text</span>
                </button>

                <button
                  onClick={() => setRemoveBackgroundMusic(!removeBackgroundMusic)}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-700"
                >
                  <div className={`relative w-12 h-7 rounded-full ${removeBackgroundMusic ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform transform ${removeBackgroundMusic ? 'translate-x-6' : 'translate-x-1'}`}></div>
                  </div>
                  <span className="text-gray-300">Remove background music</span>
                </button>

                <button
                  onClick={() => setMergeCaptions(!mergeCaptions)}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-700"
                >
                  <div className={`relative w-12 h-7 rounded-full ${mergeCaptions ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform transform ${mergeCaptions ? 'translate-x-6' : 'translate-x-1'}`}></div>
                  </div>
                  <span className="text-gray-300">Merge captions</span>
                </button>

                <button
                  onClick={() => setMergeOpenCaptions(!mergeOpenCaptions)}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-700"
                >
                  <div className={`relative w-12 h-7 rounded-full ${mergeOpenCaptions ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform transform ${mergeOpenCaptions ? 'translate-x-6' : 'translate-x-1'}`}></div>
                  </div>
                  <span className="text-gray-300">Merge open captions</span>
                </button>
              </div>

              {/* Example control sliders */}
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-200 text-sm">Chỉnh sáng</span>
                    <span className="text-gray-400 text-sm">{brightness}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-200 text-sm">Chỉnh tương phản</span>
                    <span className="text-gray-400 text-sm">{contrast}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subtitles Management moved to ProgressDetailPage */}

          {/* Status Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-lg text-gray-400">
                    {uploadedFile ? formatFileSize(uploadedFile.size) : '0 MB'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-lg text-gray-400">990 Points/min</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={removeFile}
                  disabled={!uploadedFile}
                >
                  Cancel
                </button>
                {/* Translate/Export moved to ProgressDetailPage */}
              </div>
            </div>
          </div>

          {/* Timeline moved to ProgressDetailPage */}
        </div>
      </div>
    </div>
  )
}