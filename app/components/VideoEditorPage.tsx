'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Layers, Rocket, Scissors, Shapes, Sparkles, SquareStack, Type } from 'lucide-react'
import { parseMedia } from '@remotion/media-parser'
import { VideoEditor } from './video-editor/VideoEditor'
import {
  HeaderInfo,
  TimelineTrack,
  ToolbarItem,
  TranscriptEntry,
  VideoSource,
} from './video-editor/types'
import { apiClient } from '@/app/lib/api'
import { API_BASE_URL } from '@/app/lib/config/environment'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { ExportDialog, ExportSettings } from './video-editor/ExportDialog'

const DEFAULT_TRANSCRIPTS: TranscriptEntry[] = [
  {
    id: 't1',
    start: 2,
    end: 6,
    primaryText: 'Yeah, not too bad.',
    secondaryText: 'Ừm, không tệ lắm',
  },
  {
    id: 't2',
    start: 6,
    end: 12,
    primaryText: "It's been a steep learning curve though.",
    secondaryText: 'Nhưng mà cũng phải học hỏi khá nhiều',
  },
  {
    id: 't3',
    start: 12,
    end: 18,
    primaryText: 'Yeah, I can imagine.',
    secondaryText: 'Ừm mình có thể tưởng tượng được',
  },
  {
    id: 't4',
    start: 18,
    end: 26,
    primaryText: 'I have been here for four years and I only recently switched departments.',
    secondaryText: 'Mình làm ở đây được bốn năm rồi và mới đổi phòng ban gần đây',
  },
  {
    id: 't5',
    start: 26,
    end: 32,
    primaryText: 'Oh really?',
    secondaryText: 'Ồ thật hả?',
  },
  {
    id: 't6',
    start: 32,
    end: 40,
    primaryText: 'When did that happen? About two months ago.',
    secondaryText: 'Chuyện đó xảy ra khi nào vậy? Khoảng hai tháng trước',
  },
]

const DEFAULT_TRACKS: TimelineTrack[] = [
  {
    id: 'text-track',
    label: 'Text',
    type: 'text',
    items: [],
  },
  {
    id: 'image-track',
    label: 'Image',
    type: 'image',
    items: [],
  },
  {
    id: 'audio-track',
    label: 'Audio',
    type: 'audio',
    items: [],
  },
]

const cloneDefaultTracks = (): TimelineTrack[] =>
  DEFAULT_TRACKS.map((track) => ({
    ...track,
    items: track.items.map((item) => ({ ...item })),
    thumbnails: track.thumbnails ? track.thumbnails.map((t) => ({ ...t })) : undefined,
  }))

const formatBytes = (value?: number) => {
  if (!value) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let size = value
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const formatDuration = (seconds?: number) => {
  if (!seconds || Number.isNaN(seconds)) return ''
  const totalSeconds = Math.max(0, Math.round(seconds))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const remainingSeconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m ${remainingSeconds.toString().padStart(2, '0')}s`
  }
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

type VideoEditorPageProps = {
  jobId?: string
}

export default function VideoEditorPage({ jobId }: VideoEditorPageProps) {
  console.log('VideoEditorPage rendered with jobId:', jobId)
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null)
  const [timelineDuration, setTimelineDuration] = useState(60)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [tracks, setTracks] = useState<TimelineTrack[]>(() => cloneDefaultTracks())
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>(DEFAULT_TRANSCRIPTS)
  const [hasApiTranscripts, setHasApiTranscripts] = useState(false)
  const [hasAutoApplied, setHasAutoApplied] = useState(false)
  
  // Debug transcripts state
  useEffect(() => {
    console.log('Transcripts state updated:', transcripts.length, transcripts)
  }, [transcripts])
  const [downloadUrls, setDownloadUrls] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [lastExportSettings, setLastExportSettings] = useState<ExportSettings | null>(null)
  const [isRendering, setIsRendering] = useState(false)
  const [renderProgress, setRenderProgress] = useState(0)
  const [renderStatus, setRenderStatus] = useState<string | undefined>()
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const renderAbortRef = useRef<{ abort: () => void } | null>(null)

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [objectUrl])

  const resetTracks = useCallback(() => {
    setTracks(cloneDefaultTracks())
  }, [])

  const toolbarItems: ToolbarItem[] = useMemo(
    () => [
      { id: 'library', icon: <SquareStack className="w-5 h-5" />, label: 'Library', active: true },
      { id: 'layers', icon: <Layers className="w-5 h-5" />, label: 'Layers' },
      { id: 'text', icon: <Type className="w-5 h-5" />, label: 'Text' },
      { id: 'effects', icon: <Sparkles className="w-5 h-5" />, label: 'Effects' },
      { id: 'trim', icon: <Scissors className="w-5 h-5" />, label: 'Cut' },
      { id: 'templates', icon: <Shapes className="w-5 h-5" />, label: 'Templates' },
      { id: 'launch', icon: <Rocket className="w-5 h-5" />, label: 'Export' },
    ],
    [],
  )

  const headerInfo: HeaderInfo = {
    fileName: videoSource?.name || 'No source selected',
    meta: videoSource
      ? [formatBytes(videoSource.size), formatDuration(videoSource.duration)]
          .filter(Boolean)
          .join(' • ')
      : 'Waiting for video',
    actions: [
      { id: 'publish', label: 'Xuất bản', variant: 'primary', disabled: !videoSource },
      { id: 'share', label: 'Chia sẻ', variant: 'ghost' },
      { id: 'more', label: '•••', variant: 'ghost' },
    ],
  }

  const handleUpload = (file: File) => {
    // Allow auto-apply to run again for a new video
    setHasAutoApplied(false)
    if (!file.type.includes('video')) {
      alert('Please choose an MP4 or supported video file.')
      return
    }

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
    }

    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    setVideoSource({ url, name: file.name, size: file.size })
    setTracks((prev) =>
      prev.map((track) =>
        track.type === 'image'
          ? {
              ...track,
              resourceName: file.name,
              assetSrc: url,
            }
          : track,
      ),
    )

    parseMedia({
      src: file,
      fields: { fps: true, durationInSeconds: true },
      acknowledgeRemotionLicense: true,
    })
      .then((result) => {
        setVideoSource((prev) =>
          prev
            ? {
                ...prev,
                duration: result.durationInSeconds ?? prev.duration,
                fps: result.fps ?? prev.fps,
              }
            : prev,
        )
        if (result.durationInSeconds) {
          setTimelineDuration(Math.round(result.durationInSeconds))
        }
      })
      .catch((error) => {
        console.error('Failed to parse media metadata', error)
      })
  }

  const handleRemoveVideo = () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setObjectUrl(null)
    setVideoSource(null)
    setTimelineDuration(60)
    resetTracks()
    setHasAutoApplied(false)
  }

  // Auto-apply transcripts to timeline once at initialization: when we have transcripts
  // and the text track is currently empty. This respects both default transcripts and
  // API-provided ones. It runs once per page lifecycle.
  useEffect(() => {
    if (hasAutoApplied) return
    if (!videoSource || !videoSource.url) return
    const textTrack = tracks.find((t) => t.type === 'text')
    const hasNoTextItems = !textTrack || textTrack.items.length === 0
    const hasTranscriptsToApply = Array.isArray(transcripts) && transcripts.length > 0
    if (hasNoTextItems && hasTranscriptsToApply) {
      // Replace text track items with transcript entries
      setTracks((prev) =>
        prev.map((track) =>
          track.type === 'text'
            ? {
                ...track,
                items: transcripts.map((t, idx) => ({
                  id: t.id || `transcript-${idx}`,
                  label: t.primaryText.length > 42 ? `${t.primaryText.slice(0, 39)}…` : t.primaryText,
                  start: t.start,
                  end: t.end,
                  color: '#6366f1',
                  meta: {
                    preset: 'none',
                    fontSize: 31,
                    angle: 0,
                    className: 'bg-slate-800/80 text-slate-200',
                    style: {},
                    fullText: t.primaryText,
                  },
                })),
              }
            : track,
        ),
      )
      setHasAutoApplied(true)
    }
  }, [hasAutoApplied, tracks, transcripts, videoSource])

  // Utilities for SRT export (ms formatting)
  const msToSrtTime = (msTotal: number) => {
    const ms = Math.max(0, Math.floor(msTotal))
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const millis = ms % 1000
    const pad = (n: number, w = 2) => n.toString().padStart(w, '0')
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(millis, 3)}`
  }

  const cuesToSrt = (cues: { id: string; startMs: number; endMs: number; text: string }[]) =>
    cues
      .map((c, idx) => `${idx + 1}\n${msToSrtTime(c.startMs)} --> ${msToSrtTime(c.endMs)}\n${c.text}`)
      .join('\n\n')

  const exportSoft = async () => {
    if (!videoSource?.url) {
      alert('Không có video để export')
      return
    }
    const activeTranscripts = transcripts || []
    if (activeTranscripts.length === 0) {
      alert('Không có phụ đề để export')
      return
    }
    try {
      const ffmpeg = new FFmpeg()
      await ffmpeg.load()
      const inputName = 'input.mp4'
      const subsName = 'subs.srt'
      const outputName = 'output.mkv'
      const res = await fetch(videoSource.url)
      const buf = new Uint8Array(await res.arrayBuffer())
      await ffmpeg.writeFile(inputName, buf)
      const ms = (s: number) => Math.max(0, Math.round(s * 1000))
      const srt = cuesToSrt(
        activeTranscripts.map((t, i) => ({ id: t.id || `c${i + 1}`, startMs: ms(t.start), endMs: ms(t.end), text: t.primaryText }))
      )
      await ffmpeg.writeFile(subsName, new TextEncoder().encode(srt))
      await ffmpeg.exec(['-i', inputName, '-i', subsName, '-c', 'copy', '-c:s', 'srt', outputName])
      const data = await ffmpeg.readFile(outputName)
      const buffer = typeof data === 'string' ? new TextEncoder().encode(data) : data
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
      const url = URL.createObjectURL(new Blob([arrayBuffer], { type: 'video/x-matroska' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'export_with_subs.mkv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error('Export failed:', err)
      alert('Export thất bại: ' + (err?.message || 'Unknown error'))
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

  const downloadSrtFromTranscripts = () => {
    const ms = (s: number) => Math.max(0, Math.round(s * 1000))
    const srt = cuesToSrt(
      (transcripts || []).map((t, i) => ({ id: t.id || `c${i + 1}`, startMs: ms(t.start), endMs: ms(t.end), text: t.primaryText }))
    )
    const blob = new Blob([srt], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    downloadFile(url, (lastExportSettings?.title || videoSource?.name || 'export') + '.srt')
    URL.revokeObjectURL(url)
  }

  // Canvas-based renderer that burns in text tracks and records audio
  const renderWithTracks = async (
    src: string,
    tks: TimelineTrack[],
    opts: { fps?: number; width?: number; height?: number; onProgress?: (p: number) => void; onStatus?: (s: string) => void; signal?: AbortSignal }
  ): Promise<Blob> => {
    const fps = opts.fps ?? (videoSource?.fps ?? 30)
    const onProgress = opts.onProgress ?? (() => {})
    const onStatus = opts.onStatus ?? (() => {})
    return new Promise<Blob>((resolve, reject) => {
      let aborted = false
      let recorder: MediaRecorder | null = null
      let animationId = 0

      const abort = () => {
        aborted = true
        try { recorder && recorder.stop() } catch {}
        try { animationId && cancelAnimationFrame(animationId) } catch {}
        try { (video as any)?.pause?.() } catch {}
        reject(new DOMException('Rendering aborted', 'AbortError'))
      }
      if (opts.signal) {
        const handler = () => abort()
        if (opts.signal.aborted) return abort()
        opts.signal.addEventListener('abort', handler, { once: true })
      }

      const video = document.createElement('video')
      video.crossOrigin = 'anonymous'
      video.src = src
      video.muted = true // avoid echo; we'll grab audio via captureStream
      video.preload = 'auto'
      video.playsInline = true

      const onLoaded = async () => {
        const naturalW = video.videoWidth || 1280
        const naturalH = video.videoHeight || 720
        let targetW = opts.width || naturalW
        let targetH = opts.height || naturalH

        // Keep aspect ratio
        const ratio = naturalW / naturalH || 16 / 9
        if (!opts.width && opts.height) targetW = Math.round(opts.height * ratio)
        if (opts.width && !opts.height) targetH = Math.round(opts.width / ratio)

        const canvas = document.createElement('canvas')
        canvas.width = targetW
        canvas.height = targetH
        const ctx = canvas.getContext('2d')!

        const canvasStream = canvas.captureStream(fps)
        // Try to add audio track from source video
        let mixStream: MediaStream = canvasStream
        try {
          const vStream = (video as any).captureStream?.()
          if (vStream) {
            const audioTracks = vStream.getAudioTracks()
            if (audioTracks.length) {
              mixStream = new MediaStream([canvasStream.getVideoTracks()[0], audioTracks[0]])
            }
          }
        } catch {}

        // MediaRecorder
        const mimeCandidates = [
          'video/webm;codecs=vp9,opus',
          'video/webm;codecs=vp8,opus',
          'video/webm',
        ]
        let mime: string | undefined
        for (const m of mimeCandidates) {
          if ((window as any).MediaRecorder && MediaRecorder.isTypeSupported(m)) { mime = m; break }
        }
        if (!mime) {
          onStatus('Trình duyệt không hỗ trợ MediaRecorder dạng webm')
        }
  const chunks: BlobPart[] = []
  recorder = new MediaRecorder(mixStream, mime ? { mimeType: mime, videoBitsPerSecond: 6_000_000 } : undefined)
  const textTrack = tks.find((t) => t.type === 'text')
        const durationSec = video.duration || timelineDuration

        recorder.ondataavailable = (e) => { if (e.data?.size) chunks.push(e.data) }
        recorder.onstop = () => {
          try { canvasStream.getTracks().forEach((t) => t.stop()) } catch {}
          try {
            const blob = new Blob(chunks, { type: mime || 'video/webm' })
            resolve(blob)
          } catch (err) { reject(err) }
        }
        recorder.onerror = (e) => { reject((e as any).error || new Error('Recorder error')) }

        const drawFrame = () => {
          if (aborted) return
          // Draw base
          ctx.drawImage(video, 0, 0, targetW, targetH)
          const current = video.currentTime
          if (textTrack) {
            const item = textTrack.items.find((it) => current >= it.start && current <= it.end)
            if (item) {
              const meta: any = (item as any).meta || {}
              const fontSize = Number(meta.fontSize) || 32
              const text = String(meta.fullText || item.label || '')
              const angle = Number(meta.angle) || 0
              ctx.save()
              ctx.font = `${Math.max(10, fontSize)}px ui-sans-serif, system-ui, -apple-system`
              ctx.textAlign = 'center'
              ctx.fillStyle = '#ffffff'
              ctx.strokeStyle = 'rgba(0,0,0,0.7)'
              ctx.lineWidth = Math.max(2, Math.floor(fontSize / 8))
              const x = targetW / 2
              const y = targetH - Math.round(targetH * 0.12)
              if (angle !== 0) {
                ctx.translate(x, y)
                ctx.rotate((angle * Math.PI) / 180)
                ctx.translate(-x, -y)
              }
              ctx.strokeText(text, x, y)
              ctx.fillText(text, x, y)
              ctx.restore()
            }
          }
          if (!video.paused && !video.ended) {
            animationId = requestAnimationFrame(drawFrame)
          }
          onProgress(Math.min(1, current / durationSec))
        }

        // Start playback and recording
        await video.play().catch(() => {})
        recorder.start(250)
        onStatus('Đang ghi video…')
        animationId = requestAnimationFrame(drawFrame)

        video.onended = () => {
          onProgress(1)
          try { recorder && recorder.stop() } catch {}
        }
      }

      video.addEventListener('loadedmetadata', onLoaded, { once: true })
      video.load()
    })
  }

  // WebCodecs-based renderer (video-only WebM, faster/more consistent than MediaRecorder; audio not included)
  const renderWebCodecsWithTracks = async (
    src: string,
    tks: TimelineTrack[],
    opts: { fps?: number; width?: number; height?: number; onProgress?: (p: number) => void; onStatus?: (s: string) => void; signal?: AbortSignal }
  ): Promise<Blob> => {
    const { SimpleWebMWriter } = await import('@/app/lib/webcodecs/simple-webm') as any
    const fps = opts.fps ?? (videoSource?.fps ?? 30)
    const onProgress = opts.onProgress ?? (() => {})
    const onStatus = opts.onStatus ?? (() => {})
    return new Promise<Blob>((resolve, reject) => {
      let aborted = false
      const abort = () => { aborted = true; reject(new DOMException('Rendering aborted', 'AbortError')) }
      if (opts.signal) {
        if (opts.signal.aborted) return abort()
        const handler = () => abort()
        opts.signal.addEventListener('abort', handler, { once: true })
      }

      const video = document.createElement('video')
      video.src = src
      video.crossOrigin = 'anonymous'
      video.muted = true
      video.preload = 'auto'
      video.playsInline = true

      const onLoaded = async () => {
        const naturalW = video.videoWidth || 1280
        const naturalH = video.videoHeight || 720
        let targetW = opts.width || naturalW
        let targetH = opts.height || naturalH
        const ratio = naturalW / naturalH || 16 / 9
        if (!opts.width && opts.height) targetW = Math.round((opts.height as number) * ratio)
        if (opts.width && !opts.height) targetH = Math.round((opts.width as number) / ratio)

        const canvas = document.createElement('canvas')
        canvas.width = targetW
        canvas.height = targetH
        const ctx = canvas.getContext('2d')!

        const supported = (window as any).VideoEncoder && (window as any).EncodedVideoChunk
        if (!supported) return reject(new Error('WebCodecs not supported in this browser'))

        const codecCandidates = ['vp09.00.10.08', 'vp8']
        let chosen: string | null = null
        for (const c of codecCandidates) {
          // @ts-ignore
          if (await (window as any).VideoEncoder.isConfigSupported?.({ codec: c, width: targetW, height: targetH, framerate: fps })) {
            chosen = c; break
          }
        }
        if (!chosen) chosen = 'vp8'

        const writer = new SimpleWebMWriter(targetW, targetH, chosen.startsWith('vp9') ? 'V_VP9' : 'V_VP8')

        // @ts-ignore
        const encoder = new (window as any).VideoEncoder({
          output: (chunk: any) => {
            const data = new Uint8Array(chunk.byteLength)
            chunk.copyTo(data)
            writer.addChunk({ timestampUs: Number(chunk.timestamp), data, key: chunk.type === 'key' })
          },
          error: (e: any) => reject(e),
        })

        // @ts-ignore
        await (window as any).VideoEncoder.isConfigSupported?.({ codec: chosen, width: targetW, height: targetH, framerate: fps })
        encoder.configure({ codec: chosen, width: targetW, height: targetH, framerate: fps })

        const textTrack = tks.find((t) => t.type === 'text')
        const durationSec = video.duration || timelineDuration
        const deltaUs = Math.round(1_000_000 / fps)
        let tsUs = 0
        let frameIndex = 0

        onStatus('Đang mã hóa (WebCodecs)…')
        await video.play().catch(() => {})

        const drawAndEncode = async () => {
          if (aborted) return
          // Draw base
          ctx.drawImage(video, 0, 0, targetW, targetH)
          const current = tsUs / 1_000_000

          if (textTrack) {
            const item = textTrack.items.find((it) => current >= it.start && current <= it.end)
            if (item) {
              const meta: any = (item as any).meta || {}
              const fontSize = Number(meta.fontSize) || 32
              const text = String(meta.fullText || item.label || '')
              const angle = Number(meta.angle) || 0
              ctx.save()
              ctx.font = `${Math.max(10, fontSize)}px ui-sans-serif, system-ui, -apple-system`
              ctx.textAlign = 'center'
              ctx.fillStyle = '#ffffff'
              ctx.strokeStyle = 'rgba(0,0,0,0.7)'
              ctx.lineWidth = Math.max(2, Math.floor(fontSize / 8))
              const x = targetW / 2
              const y = targetH - Math.round(targetH * 0.12)
              if (angle !== 0) { ctx.translate(x, y); ctx.rotate((angle * Math.PI) / 180); ctx.translate(-x, -y) }
              ctx.strokeText(text, x, y)
              ctx.fillText(text, x, y)
              ctx.restore()
            }
          }

          // Encode this canvas frame
          // @ts-ignore
          const frame = new (window as any).VideoFrame(canvas, { timestamp: tsUs })
          encoder.encode(frame, { keyFrame: frameIndex % fps === 0 })
          frame.close()

          tsUs += deltaUs
          frameIndex += 1
          onProgress(Math.min(1, current / durationSec))

          if (current < durationSec && !video.ended) {
            requestAnimationFrame(drawAndEncode)
          } else {
            try { await encoder.flush() } catch {}
            const blob = writer.finalize()
            resolve(blob)
          }
        }

        requestAnimationFrame(drawAndEncode)
      }

      video.addEventListener('loadedmetadata', onLoaded, { once: true })
      video.load()
    })
  }

  const deriveTranscripts = useCallback((nextTracks: TimelineTrack[]): TranscriptEntry[] => {
    const textTrack = nextTracks.find((t) => t.type === 'text')
    if (!textTrack) return []
    return textTrack.items
      .map((item: any) => ({
        id: item.id,
        start: item.start,
        end: item.end,
        primaryText: item?.meta?.fullText || item.label,
      }))
      .sort((a, b) => a.start - b.start)
  }, [])

  const handleUpdateTrackItem = ({ trackId, itemId, start, end }: { trackId: string; itemId: string; start?: number; end?: number }) => {
    setTracks((prev) => {
      const nextTracks = prev.map((track) => {
        if (track.id !== trackId) return track

        const updatedItems = track.items
          .map((item) => {
            if (item.id !== itemId) return item
            const minDuration = 0.1
            const trackDuration = videoSource?.duration ?? timelineDuration
            const nextStart = typeof start === 'number' ? Math.max(0, Math.min(start, trackDuration - minDuration)) : item.start
            const nextEnd = typeof end === 'number' ? Math.max(nextStart + minDuration, Math.min(end, trackDuration)) : item.end
            return {
              ...item,
              start: nextStart,
              end: nextEnd,
            }
          })
          .sort((a, b) => a.start - b.start)

        return {
          ...track,
          items: updatedItems,
        }
      })

      setTranscripts(deriveTranscripts(nextTracks))
      return nextTracks
    })
  }

  const handleUpdateTrackItemMeta = ({ trackId, itemId, meta }: { trackId: string; itemId: string; meta: Record<string, any> }) => {
    setTracks((prev) => {
      const next = prev.map((track) => {
        if (track.id !== trackId) return track

        const items = track.items.map((item) => {
          if (item.id !== itemId) return item
          return {
            ...item,
            meta: {
              ...(item.meta || {}),
              ...meta,
            },
          }
        })

        return {
          ...track,
          items,
        }
      })

      // update transcripts derived from text track as well
      setTranscripts(deriveTranscripts(next))
      return next
    })
  }

  useEffect(() => {
    // Do not populate text track with sample/default transcript items automatically.
    // Keep text track empty by default and avoid setting transcripts from DEFAULT_TRANSCRIPTS.

    if (!videoSource || !videoSource.url) {
      // Ensure text track remains empty when there's no video loaded
      setTracks((prev) =>
        prev.map((track) => (track.type === 'text' ? { ...track, items: [] } : track)),
      )
      return
    }

    const durationSeconds = videoSource.duration ?? timelineDuration
    const fps = videoSource.fps ?? 30
    const totalDuration = Math.max(durationSeconds, 1)
  // Generate more frequent thumbnails so image track appears continuous when scrubbing
  const desiredSegmentSeconds = 0.2
  const thumbnailCount = Math.max(12, Math.min(1000, Math.ceil(totalDuration / desiredSegmentSeconds)))
    const segment = totalDuration / thumbnailCount
    const thumbnails = Array.from({ length: thumbnailCount }, (_, index) => {
      const start = Math.min(totalDuration, index * segment)
      const end = index === thumbnailCount - 1 ? totalDuration : Math.min(totalDuration, (index + 1) * segment)
      const durationWindow = Math.max(0, end - start)
      return {
        id: `thumb-${index}`,
        time: start,
        duration: durationWindow,
      }
    })

    setTracks((prev) => {
      const nextTracks = prev.map((track) => {
        if (track.type === 'text') {
          return {
            ...track,
            items: hasAutoApplied ? track.items : [],
          }
        }

        if (track.type === 'image') {
          return {
            ...track,
            resourceName: videoSource.name ?? track.resourceName,
            assetSrc: videoSource.url,
            fps,
            thumbnails,
            items: track.items.map((item, idx) =>
              idx === 0
                ? {
                    ...item,
                    end: totalDuration,
                  }
                : item,
            ),
          }
        }

        return track
      })

      // Do not override transcripts here; preserve current transcripts (API/default)
      return nextTracks
    })
  }, [videoSource, timelineDuration, deriveTranscripts, hasApiTranscripts, hasAutoApplied])

  // Load NTS task data via /videos/nts/check/:jobId when jobId provided
  useEffect(() => {
    console.log('VideoEditorPage useEffect triggered, jobId:', jobId)
    
    // For testing: use a hardcoded jobId if none provided
    const testJobId = jobId || 'af696f2f4413f60f8d31c8b8ec6a8675564f71dd7a03e2844a75bbe2c7c0f9ff'
    
    if (!testJobId) {
      console.log('No jobId provided, skipping API call')
      return
    }
    let cancelled = false
    const loadTask = async () => {
      try {
        console.log('Starting API call to /videos/nts/check/', testJobId)
        setIsLoading(true)
        setError(null)
        const res = await apiClient.get(`/videos/nts/check/${testJobId}`)
        console.log('API response:', res)
        const data = res?.data?.data
        console.log('API data:', data)
        if (!data) {
          console.log('No data in API response')
          return
        }
        
        // Setup video URL from API origin
        if (data.videoUrl) {
          const origin = API_BASE_URL.replace('/v1', '')
          const url = origin + data.videoUrl
          if (!cancelled) {
            setVideoSource((prev) => ({ 
              url, 
              name: data.fileName || prev?.name || 'NTS Job', 
              size: prev?.size,
              duration: prev?.duration,
              fps: prev?.fps
            }))
          }
        }
        
        // Download keys if present
        const keys = ['srtKey', 'assKey', 'vttKey', 'mp4Key', 'voiceKey'] as const
        const nextUrls: Record<string, string> = {}
        keys.forEach((k) => {
          const val = data?.[k]
          if (typeof val === 'string' && val.length > 0) {
            const origin = API_BASE_URL.replace('/v1', '')
            nextUrls[k] = origin + val
          }
        })
        if (!cancelled) setDownloadUrls(nextUrls)

        // Parse SRT result from API
        if (data?.result && typeof data.result === 'string') {
          try {
            console.log('Parsing SRT result:', data.result.substring(0, 200) + '...')
            
            // Parse SRT format from result string
            const srtText = data.result.replace(/^"|"$/g, '').replace(/\\n/g, '\n')
            console.log('Cleaned SRT text:', srtText.substring(0, 200) + '...')
            
            const apiTranscripts: TranscriptEntry[] = []
            
            // Try different splitting methods
            let blocks: string[] = []
            
            // Method 1: Split by double newlines
            blocks = srtText.split('\n\n').filter((block: string) => block.trim())
            console.log('Method 1 - Found blocks:', blocks.length)
            
            // If no blocks found, try splitting by single newlines with number pattern
            if (blocks.length === 0 || blocks.length === 1) {
              console.log('Trying alternative parsing...')
              const lines = srtText.split('\n').filter((line: string) => line.trim())
              console.log('All lines:', lines.length)
              
              // Group lines by subtitle blocks (number, time, text)
              let currentBlock: string[] = []
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim()
                
                // Check if line is a number (subtitle index)
                if (/^\d+$/.test(line)) {
                  if (currentBlock.length > 0) {
                    blocks.push(currentBlock.join('\n'))
                  }
                  currentBlock = [line]
                } else {
                  currentBlock.push(line)
                }
              }
              if (currentBlock.length > 0) {
                blocks.push(currentBlock.join('\n'))
              }
              console.log('Method 2 - Found blocks:', blocks.length)
            }
            
            console.log('First few blocks:', blocks.slice(0, 3))
            
            blocks.forEach((block: string, idx: number) => {
              const lines = block.trim().split('\n')
              console.log(`Block ${idx}:`, lines)
              
              if (lines.length >= 3) {
                const index = lines[0]
                const timeLine = lines[1]
                const textLines = lines.slice(2)
                
                // Parse time format: 00:00:00,140 --> 00:00:09,560
                const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/)
                if (timeMatch) {
                  const [, h1, m1, s1, ms1, h2, m2, s2, ms2] = timeMatch
                  const startMs = parseInt(h1) * 3600000 + parseInt(m1) * 60000 + parseInt(s1) * 1000 + parseInt(ms1)
                  const endMs = parseInt(h2) * 3600000 + parseInt(m2) * 60000 + parseInt(s2) * 1000 + parseInt(ms2)
                  
                  // Check if there are multiple text lines (original + translation)
                  let primaryText = ''
                  let secondaryText = undefined
                  
                  if (textLines.length === 1) {
                    // Single line - create demo translation
                    const originalText = textLines[0].trim()
                    primaryText = originalText
                    // Create a simple demo translation (in real app, this would come from translation API)
                    secondaryText = `[Translation: ${originalText}]`
                  } else if (textLines.length === 2) {
                    // Two lines - could be original + translation
                    primaryText = textLines[0].trim()
                    secondaryText = textLines[1].trim()
                  } else {
                    // Multiple lines - join all as primary text
                    primaryText = textLines.join('\n').trim()
                    secondaryText = `[Translation: ${primaryText}]`
                  }
                  
                  const transcriptEntry = {
                    id: `srt-${idx + 1}`,
                    start: startMs / 1000, // Convert to seconds
                    end: endMs / 1000,
                    primaryText,
                    secondaryText,
                  }
                  
                  console.log('Adding transcript entry:', transcriptEntry)
                  apiTranscripts.push(transcriptEntry)
                }
              }
            })

            console.log('Total parsed transcripts:', apiTranscripts.length)
            
            if (apiTranscripts.length > 0 && !cancelled) {
              console.log('Setting transcripts:', apiTranscripts)
              setTranscripts(apiTranscripts)
              setHasApiTranscripts(true)
              setTracks((prev) => {
                const nextTracks = prev.map((track) =>
                  track.type === 'text'
                    ? {
                        ...track,
                        items: apiTranscripts.map((t, index) => ({
                          id: t.id || `transcript-${index}`,
                          label: t.primaryText.length > 42 ? `${t.primaryText.slice(0, 39)}…` : t.primaryText,
                          start: t.start,
                          end: t.end,
                          color: '#6366f1',
                          meta: {
                            // default VideoSmallTool style
                            preset: 'none',
                            fontSize: 31,
                            angle: 0,
                            className: 'bg-slate-800/80 text-slate-200',
                            style: {},
                            fullText: t.primaryText,
                          },
                        })),
                      }
                    : track,
                )
                return nextTracks
              })
            }
          } catch (parseError) {
            console.error('Failed to parse SRT result:', parseError)
          }
        }

        // Fallback: try to parse from subtitle arrays if SRT parsing failed
        const subtitleArrays: any[] = (data?.targetSubtitles || data?.sourceSubtitles || []) as any[]
        if (Array.isArray(subtitleArrays) && subtitleArrays.length > 0) {
          // Expect items with startMs/endMs/text
          const apiTranscripts: TranscriptEntry[] = subtitleArrays
            .map((c: any, idx: number) => ({
              id: c.id || `c${idx + 1}`,
              start: typeof c.startMs === 'number' ? Math.max(0, c.startMs) / 1000 : Number(c.start) || 0,
              end: typeof c.endMs === 'number' ? Math.max(0, c.endMs) / 1000 : Number(c.end) || 0,
              primaryText: String(c.text ?? c.primaryText ?? '').trim(),
              
            }))
            .filter((t) => t.end > t.start && t.primaryText)
            .sort((a, b) => a.start - b.start)

          if (apiTranscripts.length > 0 && !cancelled) {
            setTranscripts(apiTranscripts)
            setHasApiTranscripts(true)
            setTracks((prev) => {
              const nextTracks = prev.map((track) =>
                track.type === 'text'
                  ? {
                      ...track,
                      items: apiTranscripts.map((t, index) => ({
                        id: t.id || `transcript-${index}`,
                        label: t.primaryText.length > 42 ? `${t.primaryText.slice(0, 39)}…` : t.primaryText,
                        start: t.start,
                        end: t.end,
                        color: '#6366f1',
                        meta: {
                          preset: 'none',
                          fontSize: 31,
                          angle: 0,
                          className: 'bg-slate-800/80 text-slate-200',
                          style: {},
                          fullText: t.primaryText,
                        },
                      })),
                    }
                  : track,
              )
              return nextTracks
            })
          }
        }
      } catch (e: any) {
        const msg = e?.response?.data?.message || e?.message || 'Failed to load task data'
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadTask()
    return () => {
      cancelled = true
    }
  }, [jobId])

  return (
    <div className="h-full">
      <VideoEditor
        videoSource={videoSource}
        toolbarItems={toolbarItems}
        headerInfo={headerInfo}
        tracks={tracks}
        transcripts={transcripts}
        timelineDuration={timelineDuration}
        onUpload={handleUpload}
        onRemoveVideo={handleRemoveVideo}
        onDurationChange={(duration) => {
          setTimelineDuration(Math.round(duration))
          setVideoSource((prev) => (prev ? { ...prev, duration } : prev))
        }}
  onUpdateTrackItem={handleUpdateTrackItem}
        onHeaderAction={(id) => {
          if (id === 'publish') {
            setExportOpen(true)
          }
        }}
        onApplyTranscripts={(entries) => {
          // Convert transcript entries to timeline items and replace text track items
          setTracks((prev) =>
            prev.map((track) =>
              track.type === 'text'
                ? {
                    ...track,
                    items: entries.map((t, idx) => ({
                      id: t.id || `transcript-${idx}`,
                      label: t.primaryText.length > 42 ? `${t.primaryText.slice(0, 39)}…` : t.primaryText,
                      start: t.start,
                      end: t.end,
                      color: '#6366f1',
                      meta: {
                        preset: 'none',
                        fontSize: 31,
                        angle: 0,
                        className: 'bg-slate-800/80 text-slate-200',
                        style: {},
                        fullText: t.primaryText,
                      },
                    })),
                  }
                : track,
            ),
          )
        }}
        onUpdateTrackItemMeta={handleUpdateTrackItemMeta}
        onSeek={(sec) => {
          // keep same behavior
        }}
      />

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        video={videoSource}
        duration={videoSource?.duration ?? timelineDuration}
        onDownloadBackup={downloadUrls.mp4Key ? () => downloadFile(downloadUrls.mp4Key, videoSource?.name || 'video.mp4') : undefined}
        onDownloadSrt={transcripts?.length ? downloadSrtFromTranscripts : undefined}
        onSave={(s) => {
          setLastExportSettings(s)
          setExportOpen(false)
        }}
        isRendering={isRendering}
        progress={renderProgress}
        statusText={renderStatus}
        onCancelRender={() => {
          renderAbortRef.current?.abort()
          setIsRendering(false)
        }}
        outputUrl={outputUrl}
        onDownloadOutput={outputUrl ? () => downloadFile(outputUrl, (lastExportSettings?.title || 'export') + '.webm') : undefined}
        onPublish={async (s) => {
          setLastExportSettings(s)
          setOutputUrl(null)
          setIsRendering(true)
          setRenderProgress(0)
          setRenderStatus('Chuẩn bị render…')
          try {
            const ac = new AbortController()
            renderAbortRef.current = { abort: () => ac.abort() }
            const targetHeight = (() => {
              switch (s.resolution) {
                case '2160p': return 2160
                case '1440p': return 1440
                case '1080p': return 1080
                case '720p': return 720
                case '480p': return 480
                default: return undefined
              }
            })()
            const fps = s.framerate === 'Auto' ? (videoSource?.fps ?? 30) : Number(s.framerate)
            const canWebCodecs = typeof (window as any).VideoEncoder !== 'undefined'
            const blob = await (canWebCodecs
              ? renderWebCodecsWithTracks(
                  videoSource?.url!,
                  tracks,
                  { fps, height: targetHeight, onProgress: (p) => setRenderProgress(p), onStatus: (t) => setRenderStatus(t), signal: ac.signal }
                )
              : renderWithTracks(
                  videoSource?.url!,
                  tracks,
                  { fps, height: targetHeight, onProgress: (p) => setRenderProgress(p), onStatus: (t) => setRenderStatus(t), signal: ac.signal }
                )
            )
            const url = URL.createObjectURL(blob)
            setOutputUrl(url)
            setRenderStatus('Hoàn tất. Đang tải xuống…')
            // Auto-download as soon as render finishes
            const filenameBase = s.title?.replace(/\.(mp4|mov|mkv)$/i, '') || 'export'
            const ext = 'webm'
            downloadFile(url, `${filenameBase}.${ext}`)
            // Optionally keep the dialog open; user can close it after download
          } catch (e: any) {
            if (e?.name === 'AbortError') {
              setRenderStatus('Đã hủy render')
            } else {
              setRenderStatus('Lỗi khi render')
              console.error(e)
              alert('Render thất bại: ' + (e?.message || 'Unknown error'))
            }
          } finally {
            setIsRendering(false)
          }
        }}
      />
    </div>
  )
}
