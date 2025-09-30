'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { useJobManagement } from '@/app/hooks/useJobManagement'
import { useWebSocket } from '@/app/hooks/useWebSocket'
import { videoTranslationService } from '@/app/lib/api/videoTranslationService'
import { STAGE_DISPLAY_NAMES } from '@/app/lib/config/environment'

// Minimal subset re-used from CreatePage

type SubtitleCue = {
  id: string
  startMs: number
  endMs: number
  text: string
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

const cuesToSrt = (cues: SubtitleCue[]) => {
  return cues
    .map((c, idx) => `${idx + 1}\n${msToSrtTime(c.startMs)} --> ${msToSrtTime(c.endMs)}\n${c.text}`)
    .join('\n\n')
}

interface ProgressDetailPageProps {
  jobId: string
  onBack?: () => void
}

export default function ProgressDetailPage({ jobId, onBack }: ProgressDetailPageProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [sourceSubtitles, setSourceSubtitles] = useState<SubtitleCue[]>([])
  const [targetSubtitles, setTargetSubtitles] = useState<SubtitleCue[]>([])
  const [downloadUrls, setDownloadUrls] = useState<Record<string, string>>({})

  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTimeMs, setCurrentTimeMs] = useState(0)
  const [durationMs, setDurationMs] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)

  // API integration
  const { getJobStatus, cancelJob, isLoading, error } = useJobManagement({
    autoRefresh: false
  })

  const { isConnected: isWebSocketConnected } = useWebSocket()

  // Load job data
  useEffect(() => {
    const loadJobData = async () => {
      try {
        const job = await getJobStatus(jobId)
        console.log('Job data loaded:', job)
        
        // Load video URL if available
        if (job.outputs?.mp4Key) {
          try {
            const downloadResponse = await videoTranslationService.getDownloadUrl(job.outputs.mp4Key)
            setVideoUrl(downloadResponse.url)
          } catch (error) {
            console.error('Failed to get video download URL:', error)
          }
        }
        
        // Load download URLs for all outputs
        const urls: Record<string, string> = {}
        if (job.outputs) {
          for (const [type, key] of Object.entries(job.outputs)) {
            if (key) {
              try {
                const downloadResponse = await videoTranslationService.getDownloadUrl(key)
                urls[type] = downloadResponse.url
              } catch (error) {
                console.error(`Failed to get download URL for ${type}:`, error)
              }
            }
          }
        }
        setDownloadUrls(urls)
        
      } catch (error) {
        console.error('Failed to load job data:', error)
      }
    }

    if (jobId) {
      loadJobData()
    }
  }, [jobId, getJobStatus])

  // Demo subtitles (replace with real data from API)
  useEffect(() => {
    setSourceSubtitles([
      { id: 'c1', startMs: 2000, endMs: 5000, text: 'Xin chào, bạn khỏe không?' },
      { id: 'c2', startMs: 6000, endMs: 9000, text: 'Mình ổn, cảm ơn bạn!' },
    ])
  }, [])

  const getActiveTrack = () => (targetSubtitles.length ? targetSubtitles : sourceSubtitles)
  const setActiveTrack = (updater: (list: SubtitleCue[]) => SubtitleCue[]) => {
    if (targetSubtitles.length) setTargetSubtitles(updater(targetSubtitles))
    else setSourceSubtitles(updater(sourceSubtitles))
  }

  const onGripMouseDown = (e: React.MouseEvent, index: number, type: 'start' | 'end') => {
    e.stopPropagation()
    if (durationMs <= 0) return
    const rect = timelineRef.current?.getBoundingClientRect()
    if (!rect) return
    const pxPerMs = rect.width / durationMs
    const track = getActiveTrack()
    const cue = track[index]
    const startClientX = e.clientX
    const startMsSnapshot = cue.startMs
    const endMsSnapshot = cue.endMs

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startClientX
      const dMs = Math.round(dx / pxPerMs)
      setActiveTrack(list => list.map((c, i) => {
        if (i !== index) return c
        if (type === 'start') {
          const nextStart = Math.max(0, Math.min(endMsSnapshot - 10, startMsSnapshot + dMs))
          return { ...c, startMs: nextStart }
        } else {
          const nextEnd = Math.min(durationMs, Math.max(startMsSnapshot + 10, endMsSnapshot + dMs))
          return { ...c, endMs: nextEnd }
        }
      }))
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const exportSoft = async () => {
    if (!videoUrl) {
      alert('Không có video để export')
      return
    }
    
    const track = getActiveTrack()
    if (track.length === 0) {
      alert('Không có phụ đề để export')
      return
    }
    
    try {
      const ffmpeg = new FFmpeg()
      await ffmpeg.load()
      const inputName = 'input.mp4'
      const subsName = 'subs.srt'
      const outputName = 'output.mkv'
      const res = await fetch(videoUrl)
      const buf = new Uint8Array(await res.arrayBuffer())
      await ffmpeg.writeFile(inputName, buf)
      await ffmpeg.writeFile(subsName, new TextEncoder().encode(cuesToSrt(track)))
      await ffmpeg.exec(['-i', inputName, '-i', subsName, '-c', 'copy', '-c:s', 'srt', outputName])
      const data = await ffmpeg.readFile(outputName)
      // Handle both string and Uint8Array data from FFmpeg
      const buffer = typeof data === 'string' ? new TextEncoder().encode(data) : data
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
      const url = URL.createObjectURL(new Blob([arrayBuffer], { type: 'video/x-matroska' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'export_with_subs.mkv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export thất bại: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Header */}
      <div className="h-12 border-b border-gray-700 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="px-2 py-1 bg-gray-700 rounded text-xs">Quay lại</button>
          <div className="text-sm">Job ID: {jobId}</div>
          <div className="text-xs text-gray-400">
            {isWebSocketConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 bg-gray-700 rounded text-xs">▷</button>
          <button onClick={exportSoft} className="px-3 py-1 bg-blue-600 rounded text-xs">XUẤT BẢN</button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-600/20 text-red-300 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Download Section */}
      {Object.keys(downloadUrls).length > 0 && (
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white mb-2">Download Results</h3>
          <div className="flex flex-wrap gap-2">
            {downloadUrls.srtKey && (
              <button
                onClick={() => downloadFile(downloadUrls.srtKey, 'subtitles.srt')}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                Download SRT
              </button>
            )}
            {downloadUrls.assKey && (
              <button
                onClick={() => downloadFile(downloadUrls.assKey, 'subtitles.ass')}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                Download ASS
              </button>
            )}
            {downloadUrls.vttKey && (
              <button
                onClick={() => downloadFile(downloadUrls.vttKey, 'subtitles.vtt')}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                Download VTT
              </button>
            )}
            {downloadUrls.mp4Key && (
              <button
                onClick={() => downloadFile(downloadUrls.mp4Key, 'video.mp4')}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                Download Video
              </button>
            )}
            {downloadUrls.voiceKey && (
              <button
                onClick={() => downloadFile(downloadUrls.voiceKey, 'audio.mp3')}
                className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
              >
                Download Audio
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex">
        {/* Left toolbar */}
        <div className="w-10 border-r border-gray-700 flex flex-col items-center py-3 gap-3 text-xs">
          {['↩','✂','T','🎵','🖼','✨','⌫'].map((t, i) => (
            <button key={i} className="w-7 h-7 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center">{t}</button>
          ))}
        </div>

        {/* Main center */}
        <div className="flex-1 px-4 py-4">
          {/* Preview area */}
          <div className="bg-gray-800 rounded-lg p-3 mb-4">
            <div className="w-full h-[440px] bg-black rounded relative overflow-hidden">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                  onLoadedMetadata={() => {
                    const v = videoRef.current
                    if (v) setDurationMs(Math.floor((v.duration || 0) * 1000))
                  }}
                  onTimeUpdate={() => {
                    const v = videoRef.current
                    if (v) setCurrentTimeMs(Math.floor(v.currentTime * 1000))
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Chưa có video xem trước</div>
              )}
              {(() => {
                const track = getActiveTrack()
                const cue = track.find(c => currentTimeMs >= c.startMs && currentTimeMs <= c.endMs)
                if (!cue) return null
                return (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-6 px-4 py-2 bg-black/60 text-white text-sm rounded max-w-[90%] text-center whitespace-pre-wrap" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                    {cue.text}
                  </div>
                )
              })()}
            </div>

            {/* Transport controls */}
            <div className="flex items-center gap-3 mt-3 text-xs">
              <button className="w-8 h-8 rounded bg-gray-700">⏮</button>
              <button className="w-8 h-8 rounded bg-gray-700">▶</button>
              <button className="w-8 h-8 rounded bg-gray-700">⏭</button>
              <div className="text-gray-400">{msToSrtTime(currentTimeMs)} / {durationMs ? msToSrtTime(durationMs) : '00:00:00,000'}</div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-gray-400">Zoom:</span>
                <input type="range" min={1} max={100} defaultValue={50} className="w-40" />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="relative h-28 bg-gray-900 rounded border border-gray-700 overflow-hidden">
              {durationMs > 0 && (
                <div className="absolute top-0 bottom-0 w-px bg-red-500" style={{ left: `${(currentTimeMs / Math.max(1, durationMs)) * 100}%` }} />
              )}
              {/* Simple tracks mock */}
              <div className="absolute left-0 right-0 top-2 text-[10px] text-gray-400 px-2">Video</div>
              <div className="absolute left-0 right-0 top-6 text-[10px] text-gray-400 px-2">Audio</div>
              <div className="absolute left-0 right-0 top-10 text-[10px] text-gray-400 px-2">Text</div>
              {(() => {
                const track = getActiveTrack()
                if (durationMs <= 0 || track.length === 0) return null
                return track.map((c, idx) => {
                  const leftPct = (c.startMs / durationMs) * 100
                  const widthPct = (Math.max(0, c.endMs - c.startMs) / durationMs) * 100
                  return (
                    <div key={c.id} className="absolute" style={{ top: 40, left: `${leftPct}%`, width: `${widthPct}%` }}>
                      <div className="h-6 bg-blue-600/60 rounded border border-blue-400 relative">
                        <div className="px-2 text-[10px] truncate text-white leading-6">{c.text}</div>
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-300 cursor-ew-resize" onMouseDown={(e) => onGripMouseDown(e, idx, 'start')} />
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-blue-300 cursor-ew-resize" onMouseDown={(e) => onGripMouseDown(e, idx, 'end')} />
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        </div>

        {/* Right transcript panel */}
        <div className="w-80 border-l border-gray-700 p-3 overflow-auto max-h-[calc(100vh-48px)]">
          <div className="text-xs text-gray-400 mb-2">PHỤ ĐỀ</div>
          <div className="space-y-2">
            {(targetSubtitles.length ? targetSubtitles : sourceSubtitles).map((c) => (
              <div key={c.id} className="bg-gray-800 rounded p-2 text-sm">
                <div className="text-[10px] text-gray-400 mb-1">{msToSrtTime(c.startMs)} - {msToSrtTime(c.endMs)}</div>
                <div className="text-gray-200 whitespace-pre-wrap">{c.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
