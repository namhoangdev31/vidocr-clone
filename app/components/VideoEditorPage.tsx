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
import { toBlobURL } from '@ffmpeg/util'
import { useEditorState } from '@/app/hooks/useEditorState'
import { VideoEditorState } from './video-editor/types'

const DEFAULT_TRANSCRIPTS: TranscriptEntry[] = []

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

// Provide a minimal default track layout: one image/video track spanning 60s and an empty text track
const cloneDefaultTracks = (): TimelineTrack[] => [
  {
    id: 'image-track-1',
    label: 'Video',
    type: 'image',
    items: [
      {
        id: 'img-1',
        label: 'Source',
        start: 0,
        end: 60,
        color: '#64748b',
        type: 'clip',
      },
    ],
    accentColor: '#94a3b8',
  },
  {
    id: 'text-track-1',
    label: 'Subtitles',
    type: 'text',
    items: [],
    accentColor: '#6366f1',
  },
]

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

// Load FFmpeg core in COEP environments with multiple fallbacks
// Returns a string describing which core variant was loaded (e.g. 'core-mt', 'core', 'cdn-core-mt', 'cdn-core')
const loadFFmpegCore = async (ffmpeg: FFmpeg, setStatus?: (s: string) => void): Promise<string> => {
  const version = '0.12.15'
  const tryLoad = async (cfg?: any) => {
    try {
      await ffmpeg.load(cfg)
      return true
    } catch (err) {
      console.debug('[loadFFmpegCore] tryLoad failed for cfg:', cfg, 'err:', String(err))
      return false
    }
  }
  // 1) Prefer self-hosted core-mt under SharedArrayBuffer
  if (typeof SharedArrayBuffer !== 'undefined') {
    setStatus?.('Đang tải FFmpeg core (đa luồng)…')
    if (await tryLoad({
      coreURL: '/ffmpeg/ffmpeg-core-mt.js',
      wasmURL: '/ffmpeg/ffmpeg-core-mt.wasm',
      workerURL: '/ffmpeg/ffmpeg-core-mt.worker.js',
    })) {
      console.log('[loadFFmpegCore] Loaded self-hosted core-mt')
      return 'core-mt'
    }
    // 2) Try proxied CDN core-mt via toBlobURL
    try {
      const base = `https://unpkg.com/@ffmpeg/core-mt@${version}/dist/umd`
      const coreURL = await toBlobURL(`/api/proxy?url=${encodeURIComponent(base + '/ffmpeg-core.js')}`, 'text/javascript')
      const wasmURL = await toBlobURL(`/api/proxy?url=${encodeURIComponent(base + '/ffmpeg-core.wasm')}`, 'application/wasm')
      const workerURL = await toBlobURL(`/api/proxy?url=${encodeURIComponent(base + '/ffmpeg-core.worker.js')}`, 'text/javascript')
      if (await tryLoad({ coreURL, wasmURL, workerURL })) {
        console.log('[loadFFmpegCore] Loaded proxied CDN core-mt')
        return 'cdn-core-mt'
      }
    } catch (err) {
      console.debug('[loadFFmpegCore] proxied core-mt attempt failed:', String(err))
    }
  }
  // 3) Self-hosted single-thread core
  setStatus?.('Đang tải FFmpeg core…')
  if (await tryLoad({
    coreURL: '/ffmpeg/ffmpeg-core.js',
    wasmURL: '/ffmpeg/ffmpeg-core.wasm',
    workerURL: '/ffmpeg/ffmpeg-core.worker.js',
  })) {
    console.log('[loadFFmpegCore] Loaded self-hosted single-thread core')
    return 'core'
  }
  // 4) Proxied CDN single-thread core
  try {
    const base = `https://unpkg.com/@ffmpeg/core@${version}/dist/umd`
    const coreURL = await toBlobURL(`/api/proxy?url=${encodeURIComponent(base + '/ffmpeg-core.js')}`, 'text/javascript')
    const wasmURL = await toBlobURL(`/api/proxy?url=${encodeURIComponent(base + '/ffmpeg-core.wasm')}`, 'application/wasm')
    const workerURL = await toBlobURL(`/api/proxy?url=${encodeURIComponent(base + '/ffmpeg-core.worker.js')}`, 'text/javascript')
    if (await tryLoad({ coreURL, wasmURL, workerURL })) {
      console.log('[loadFFmpegCore] Loaded proxied CDN single-thread core')
      return 'cdn-core'
    }
  } catch (err) {
    console.debug('[loadFFmpegCore] proxied single-thread attempt failed:', String(err))
  }
  // 5) Last resort
  await ffmpeg.load()
  console.log('[loadFFmpegCore] Loaded default ffmpeg.load() fallback')
  return 'fallback'
}

type VideoEditorPageProps = {
  jobId?: string
}

export default function VideoEditorPage({ jobId }: VideoEditorPageProps) {
  console.log('VideoEditorPage rendered with jobId:', jobId)
  
  // For testing: use a hardcoded jobId if none provided
  const testJobId = jobId || 'af696f2f4413f60f8d31c8b8ec6a8675564f71dd7a03e2844a75bbe2c7c0f9ff'
  
  // Initialize editor state management
  const { saveState, loadState, isLoading: isStateLoading, error: stateError } = useEditorState(testJobId)
  
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
  const [progressDetails, setProgressDetails] = useState<{ label: string; percent: number }[]>([])
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputExt, setOutputExt] = useState<string | null>(null)
  const [tempRenderUrl, setTempRenderUrl] = useState<string | null>(null)
  const renderAbortRef = useRef<{ abort: () => void } | null>(null)

  // Auto-save editor state when tracks change (debounced)
  useEffect(() => {
    if (!testJobId || tracks.length === 0) return
    
    const timeoutId = setTimeout(() => {
      const editorState: VideoEditorState = {
        tracks,
        // Add frame and logo settings later when implemented
        frameSettings: undefined,
        logoSettings: undefined,
        audioLayers: undefined,
      }
      
      saveState(editorState).catch((err) => {
        console.warn('Failed to auto-save editor state:', err)
      })
    }, 2000) // 2 second debounce
    
    return () => clearTimeout(timeoutId)
  }, [tracks, testJobId, saveState])
  
  // Load editor state on mount
  useEffect(() => {
    if (!testJobId) return
    
    loadState().then((state) => {
      if (state && state.tracks) {
        console.log('Loaded editor state:', state)
        setTracks(state.tracks)
        // Apply other state properties as they're implemented
      }
    }).catch((err) => {
      console.warn('Failed to load editor state:', err)
    })
  }, [testJobId, loadState])

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [objectUrl])

  const toolbarItems: ToolbarItem[] = useMemo(
    () => [
      { id: 'library', icon: <SquareStack className="w-5 h-5" />, label: 'Library', active: true },
      { id: 'layers', icon: <Layers className="w-5 h-5" />, label: 'Layers' },
      { id: 'text', icon: <Type className="w-5 h-5" />, label: 'Text' },
      { id: 'effects', icon: <Sparkles className="w-5 h-5" />, label: 'Effects' },
      { id: 'trim', icon: <Scissors className="w-5 h-5" />, label: 'Cut' },
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
      console.log('[exportSoft] Start exportSoft, transcripts:', activeTranscripts.length)
      const ffmpeg = new FFmpeg()
      try {
        const v = await loadFFmpegCore(ffmpeg, undefined)
        console.log('[exportSoft] FFmpeg core variant loaded:', v)
      } catch (e) {
        console.warn('[exportSoft] loadFFmpegCore failed, falling back to ffmpeg.load():', String(e))
        try { await ffmpeg.load() } catch (err) { console.error('[exportSoft] ffmpeg.load() failed:', String(err)) }
      }
      const inputName = 'input.mp4'
      const subsName = 'subs.srt'
      const outputName = 'output.mkv'
      console.log('[exportSoft] Fetching videoSource:', videoSource.url)
      const res = await fetch(videoSource.url)
      const buf = new Uint8Array(await res.arrayBuffer())
      console.log('[exportSoft] Fetched bytes:', buf.byteLength)
      await ffmpeg.writeFile(inputName, buf)
      console.log('[exportSoft] Wrote input file:', inputName)
      const ms = (s: number) => Math.max(0, Math.round(s * 1000))
      const srt = cuesToSrt(
        activeTranscripts.map((t, i) => ({ id: t.id || `c${i + 1}`, startMs: ms(t.start), endMs: ms(t.end), text: t.primaryText }))
      )
      await ffmpeg.writeFile(subsName, new TextEncoder().encode(srt))
      console.log('[exportSoft] Wrote srt file:', subsName)
      const cmd = ['-i', inputName, '-i', subsName, '-c', 'copy', '-c:s', 'srt', outputName]
      console.log('[exportSoft] Exec ffmpeg:', cmd.join(' '))
      await ffmpeg.exec(cmd)
      console.log('[exportSoft] Exec done')
      const data = await ffmpeg.readFile(outputName)
      console.log('[exportSoft] Read output file:', outputName, 'type:', typeof data)
      const buffer = typeof data === 'string' ? new TextEncoder().encode(data) : data
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
      console.log('[exportSoft] Output bytes:', buffer.byteLength)
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

  // After initial render (WebM), optionally transcode/remux to target container/codec using ffmpeg.wasm
  const transcodeOrRemux = async (
    inputBlob: Blob,
    settings: ExportSettings,
    opts?: { onProgress?: (p: number) => void; onStatus?: (s: string) => void }
  ): Promise<{ blob: Blob; ext: string }> => {
    const targetFormat = settings.format
    try {
      const ffmpeg = new FFmpeg()
      ffmpeg.on('progress', ({ progress }) => {
        opts?.onStatus?.('Đang chuyển định dạng…')
        const p = Math.max(0, Math.min(1, progress ?? 0))
        opts?.onProgress?.(p)
        if (progress != null) console.log('[transcode] progress', Math.round(p * 100) + '%')
      })
      const loadedVariant = await loadFFmpegCore(ffmpeg, opts?.onStatus)
      console.log('[transcode] core variant:', loadedVariant)

      // Write input into FS
      const inName = 'in.webm'
      const buf = new Uint8Array(await inputBlob.arrayBuffer())
  await ffmpeg.writeFile(inName, buf)
  console.log('[transcode] wrote input', inName, 'bytes:', buf.byteLength)

      const outName = targetFormat === 'MP4' ? 'out.mp4' : targetFormat === 'MOV' ? 'out.mov' : 'out.mkv'
      const outMime = targetFormat === 'MP4' ? 'video/mp4' : targetFormat === 'MOV' ? 'video/quicktime' : 'video/x-matroska'

      const fps = settings.framerate === 'Auto' ? undefined : Number(settings.framerate)
      const height = (() => {
        switch (settings.resolution) {
          case '2160p': return 2160
          case '1440p': return 1440
          case '1080p': return 1080
          case '720p': return 720
          case '480p': return 480
          default: return undefined
        }
      })()
      const crf = settings.bitrate === 'Cao' ? 18 : settings.bitrate === 'Thấp' ? 28 : 23
      const vcodec = settings.codec === 'H.265' ? 'libx265' : 'libx264'

      const args: string[] = ['-i', inName]
      if (height) { args.push('-vf', `scale=-2:${height}`) }
      if (fps) { args.push('-r', String(fps)) }

      // Map first video and optional first audio stream (won't error if audio missing)
      args.push('-map', '0:v:0', '-map', '0:a:0?')

      // Video codec, quality, threading
      args.push('-c:v', vcodec, '-preset', 'veryfast', '-crf', String(crf), '-threads', '0')
      // Pixel format for compatibility
      args.push('-pix_fmt', 'yuv420p')
      // Audio codec (if present due to optional map)
      args.push('-c:a', 'aac', '-b:a', '128k')

      // Container-specific flags
      if (vcodec === 'libx265' && (targetFormat === 'MP4' || targetFormat === 'MOV')) {
        args.push('-tag:v', 'hvc1')
      }
      if (targetFormat === 'MP4') {
        args.push('-movflags', 'faststart')
      }

      args.push(outName)

      console.log('[transcode] exec', args.join(' '))
      await ffmpeg.exec(args)
      console.log('[transcode] exec done')
      const data = await ffmpeg.readFile(outName)
      console.log('[transcode] read output', outName, 'type:', typeof data)
      const u8 = typeof data === 'string' ? new TextEncoder().encode(data) : (data as Uint8Array)
      const ab = u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength) as ArrayBuffer
      const outBlob = new Blob([ab], { type: outMime })
      console.log('[transcode] output blob size', outBlob.size, 'mime', outMime)
      return { blob: outBlob, ext: outName.split('.').pop() as string }
    } catch (e) {
      console.warn('[transcode] failed, fallback to original blob:', e)
      return { blob: inputBlob, ext: (inputBlob.type.includes('webm') ? 'webm' : 'bin') }
    }
  }

  // Helpers to map className/style from VideoSmallTool to canvas paint
  const parseTailwindColor = (token?: string): string | undefined => {
    if (!token) return undefined
    const map: Record<string, string> = {
      'text-white': '#ffffff',
      'text-black': '#000000',
      'text-slate-200': '#e2e8f0',
      'text-emerald-400': '#34d399',
      'text-orange-400': '#fb923c',
      'text-pink-500': '#ec4899',
      'text-yellow-900': '#713f12',
      'bg-black': '#000000',
      'bg-white': '#ffffff',
      'bg-slate-800': '#1f2937',
      'bg-violet-600': '#7c3aed',
      'bg-yellow-300': '#fde047',
      'bg-sky-600': '#0284c7',
    }
    return map[token]
  }

  const extractColorsFromClassName = (className?: string) => {
    const tokens = (className || '').split(/\s+/).filter(Boolean)
    const bgToken = tokens.find((t) => t.startsWith('bg-'))
    const textToken = tokens.find((t) => t.startsWith('text-'))
    // handle opacity modifier like bg-slate-800/80
    let bgOpacity = 1
    let baseBgToken = bgToken
    const m = bgToken?.match(/^(bg-[^/]+)\/(\d{1,3})$/)
    if (m) { baseBgToken = m[1]; bgOpacity = Math.min(1, Math.max(0, Number(m[2]) / 100)) }
    const bgHex = parseTailwindColor(baseBgToken)
    const textHex = parseTailwindColor(textToken)
    const hexToRgba = (hex?: string, alpha = 1) => {
      if (!hex) return undefined
      const v = hex.replace('#', '')
      const bigint = parseInt(v, 16)
      const r = (bigint >> 16) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255
      return `rgba(${r},${g},${b},${alpha})`
    }
    return { bg: hexToRgba(bgHex, bgOpacity), text: hexToRgba(textHex, 1) }
  }

  const parseTextShadow = (shadow?: string) => {
    if (!shadow) return undefined
    // only take the first pattern: offsetX offsetY blur color
    const first = shadow.split(',')[0].trim()
    const parts = first.match(/(-?\d+)px\s+(-?\d+)px(?:\s+(\d+)px)?\s+(.*)$/)
    if (!parts) return undefined
    const [, ox, oy, blur, color] = parts
    return { ox: Number(ox), oy: Number(oy), blur: Number(blur || 0), color: color?.trim() || 'rgba(0,0,0,0.7)' }
  }

  // Cache pre-rendered subtitle sprites to avoid re-measuring and path drawing every frame
  const subtitleCacheRef = useRef<Map<string, HTMLCanvasElement>>(new Map())

  const getSubtitleSprite = (text: string, meta: any) => {
    const key = JSON.stringify({
      t: text,
      fs: meta?.fontSize,
      cls: meta?.className,
      st: meta?.style,
    })
    const cached = subtitleCacheRef.current.get(key)
    if (cached) return cached

    const fontSize = Number(meta?.fontSize) || 32
    const { bg, text: fillColor } = extractColorsFromClassName(meta?.className)
    const shadow = parseTextShadow(meta?.style?.textShadow)
    const strokeStyle = shadow?.color || 'rgba(0,0,0,0.8)'
    const lineWidth = Math.max(2, Math.floor(fontSize / 8))

    // measure
    const tmp = document.createElement('canvas')
    const mctx = tmp.getContext('2d')!
    mctx.font = `${Math.max(10, fontSize)}px ui-sans-serif, system-ui, -apple-system`
    const metrics = mctx.measureText(text)
    const padX = fontSize * 0.6
    const padY = fontSize * 0.35
    const rectW = Math.ceil(metrics.width + padX * 2)
    const rectH = Math.ceil(fontSize + padY * 2)

    // paint sprite
    const sprite = document.createElement('canvas')
    sprite.width = rectW
    sprite.height = rectH
    const ctx = sprite.getContext('2d')!

    if (bg) {
      const r = Math.round(fontSize * 0.25)
      const left = 0
      const top = 0
      const right = rectW
      const bottom = rectH
      ctx.beginPath()
      ctx.moveTo(left + r, top)
      ctx.lineTo(right - r, top)
      ctx.quadraticCurveTo(right, top, right, top + r)
      ctx.lineTo(right, bottom - r)
      ctx.quadraticCurveTo(right, bottom, right - r, bottom)
      ctx.lineTo(left + r, bottom)
      ctx.quadraticCurveTo(left, bottom, left, bottom - r)
      ctx.lineTo(left, top + r)
      ctx.quadraticCurveTo(left, top, left + r, top)
      ctx.closePath()
      ctx.fillStyle = bg
      ctx.fill()
    }

    ctx.font = `${Math.max(10, fontSize)}px ui-sans-serif, system-ui, -apple-system`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    const x = rectW / 2
    const y = rectH - Math.round(padY)

    if (shadow) {
      ctx.shadowColor = shadow.color
      ctx.shadowBlur = shadow.blur
      ctx.shadowOffsetX = shadow.ox
      ctx.shadowOffsetY = shadow.oy
    }

    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeStyle
    ctx.strokeText(text, x, y)

    ctx.fillStyle = fillColor || '#ffffff'
    ctx.fillText(text, x, y)

    subtitleCacheRef.current.set(key, sprite)
    return sprite
  }

  const drawSubtitle = (
    ctx: CanvasRenderingContext2D,
    text: string,
    meta: any,
    targetW: number,
    targetH: number,
  ) => {
    const angle = Number(meta?.angle) || 0
    const sprite = getSubtitleSprite(text, meta)
    const x = Math.round(targetW / 2)
    const y = Math.round(targetH - targetH * 0.12)

    ctx.save()
    if (angle !== 0) { ctx.translate(x, y); ctx.rotate((angle * Math.PI) / 180); ctx.translate(-x, -y) }
    const left = Math.round(x - sprite.width / 2)
    // baseline align similar to original formula (uses fontSize*0.35 as bottom padding)
    const fontSize = Number(meta?.fontSize) || 32
    const top = Math.round(y - sprite.height + fontSize * 0.35)
    ctx.drawImage(sprite, left, top)
    ctx.restore()
  }

  // Fallback: Canvas + MediaRecorder path (only used when WebCodecs unsupported or fails)
  const renderWithRecorder = async (
    src: string,
    tks: TimelineTrack[],
    opts: { fps?: number; width?: number; height?: number; onProgress?: (p: number) => void; onStatus?: (s: string) => void; signal?: AbortSignal }
  ): Promise<Blob> => {
  const fps = opts.fps ?? (videoSource?.fps ?? 30)
  console.log('[renderWithRecorder] init', { fps, width: opts.width, height: opts.height })
    const onProgress = opts.onProgress ?? (() => {})
    const onStatus = opts.onStatus ?? (() => {})
    if (typeof (window as any).MediaRecorder === 'undefined') {
      throw new Error('MediaRecorder is not supported in this browser')
    }
    return new Promise<Blob>((resolve, reject) => {
      let aborted = false
      let finished = false
      let recorder: MediaRecorder | null = null
      let stopRequested = false
      let stopWatch: any = null
      const safeReject = (err: any) => { if (!finished) { finished = true; try { recorder?.stop() } catch {}; reject(err) } }
      const abort = () => {
        if (finished) return
        aborted = true
        finished = true
        try {
          if (recorder && recorder.state !== 'inactive') {
            try { (recorder as any).requestData?.() } catch {}
            recorder.stop()
          }
        } catch {}
        if (stopWatch) { try { clearTimeout(stopWatch) } catch {}; stopWatch = null }
        reject(new DOMException('Rendering aborted', 'AbortError'))
      }

      const finalizeFromChunks = (chunks: BlobPart[], mime?: string) => {
        if (finished) return
        finished = true
        try {
          const blob = new Blob(chunks, { type: mime || 'video/webm' })
          console.log('[renderWithRecorder] finalizeFromChunks, blob size:', blob.size)
          resolve(blob)
        } catch (err) {
          reject(err as any)
        }
      }
      if (opts.signal) {
        if (opts.signal.aborted) return abort()
        const handler = () => abort()
        opts.signal.addEventListener('abort', handler, { once: true })
      }

      const video = document.createElement('video')
      video.crossOrigin = 'anonymous'
      video.src = src
      video.muted = true
      video.preload = 'auto'
      video.playsInline = true

      const onLoaded = async () => {
        console.log('[renderWithRecorder] loadedmetadata')
        const naturalW = video.videoWidth || 1280
        const naturalH = video.videoHeight || 720
        let targetW = opts.width || naturalW
        let targetH = opts.height || naturalH
        const ratio = naturalW / naturalH || 16 / 9
        if (!opts.width && opts.height) targetW = Math.round((opts.height as number) * ratio)
        if (opts.width && !opts.height) targetH = Math.round((opts.width as number) / ratio)
        if (targetW % 2 !== 0) targetW -= 1
        if (targetH % 2 !== 0) targetH -= 1

        // Robust duration detection
        let durationSec = video.duration
        if (!Number.isFinite(durationSec) || durationSec <= 0) {
          durationSec = timelineDuration || 60
          console.warn('[renderWithRecorder] video.duration is not finite, fallback to timelineDuration:', durationSec)
        } else {
          console.log('[renderWithRecorder] video.duration:', video.duration)
        }

        const canvas = document.createElement('canvas')
        canvas.width = targetW
        canvas.height = targetH
  const ctx = canvas.getContext('2d')!
  console.log('[renderWithRecorder] canvas', { targetW, targetH })
        const canvasStream = canvas.captureStream(fps)

        // Attach audio from source video if available
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

        const mimeCandidates = [
          'video/webm;codecs=vp8,opus',
          'video/webm;codecs=vp9,opus',
          'video/webm',
        ]
        let mime: string | undefined
        for (const m of mimeCandidates) {
          try { if (MediaRecorder.isTypeSupported(m)) { mime = m; break } } catch {}
        }
        const chunks: BlobPart[] = []
        try {
          recorder = new MediaRecorder(mixStream, mime ? { mimeType: mime, videoBitsPerSecond: 6_000_000 } : undefined)
        } catch (e) {
          return safeReject(e)
        }

        const textTrack = tks.find((t) => t.type === 'text')
        // Heartbeat and end listener state
        let lastCallbackAt = performance.now()
        let lastCurrent = 0
        let heartbeat: any = null
        let onVideoEnded: ((this: HTMLVideoElement, ev: Event) => any) | null = null
  // durationSec already defined above
        recorder.ondataavailable = (e) => { if (e.data?.size) { chunks.push(e.data) } }
        recorder.onstop = () => {
          if (stopWatch) { try { clearTimeout(stopWatch) } catch {}; stopWatch = null }
          if (finished) return
          try { canvasStream.getTracks().forEach((t) => t.stop()) } catch {}
          try { video.pause() } catch {}
          try { if (onVideoEnded) video.removeEventListener('ended', onVideoEnded) } catch {}
          if (heartbeat) { try { clearInterval(heartbeat) } catch {}; heartbeat = null }
          finalizeFromChunks(chunks, mime)
        }
        recorder.onerror = (e) => safeReject((e as any).error || new Error('Recorder error'))

        const requestStop = () => {
          if (stopRequested) return
          stopRequested = true
          try { video.pause() } catch {}
          try { (recorder as any)?.requestData?.() } catch {}
          try { if (recorder && recorder.state !== 'inactive') recorder.stop() } catch {}
          // Watchdog: if onstop doesn't fire, finalize with what we have
          stopWatch = setTimeout(() => {
            if (!finished) {
              console.warn('[renderWithRecorder] onstop timed out, finalizing with available chunks')
              finalizeFromChunks(chunks, mime)
            }
          }, 4000)
        }

        const rVFC = (video as any).requestVideoFrameCallback?.bind(video)
        // Define and attach 'ended' handler so we stop even if callbacks stall
        onVideoEnded = () => {
          if (aborted || finished) return
          console.log('[renderWithRecorder] video ended event')
          requestStop()
        }
        video.addEventListener('ended', onVideoEnded, { once: true })

        // Heartbeat: if no frame callback for >2s and we are near the end, force stop
        const startHeartbeat = () => {
          if (heartbeat) return
          heartbeat = setInterval(() => {
            if (finished || aborted) { clearInterval(heartbeat); heartbeat = null; return }
            const now = performance.now()
            const current = Number(video.currentTime || lastCurrent || 0)
            const remaining = Math.max(0, (durationSec || 0) - current)
            if ((now - lastCallbackAt > 2000) && (remaining < Math.max(1, 2 / Math.max(1, fps)))) {
              console.warn('[renderWithRecorder] heartbeat forcing stop. remaining:', remaining.toFixed(3))
              requestStop()
            }
          }, 1000)
        }
        const drawFrame = (_now?: number, metadata?: any) => {
          if (aborted || finished) return
          ctx.drawImage(video, 0, 0, targetW, targetH)
          const current = metadata?.mediaTime ?? video.currentTime
          lastCurrent = Number(current) || 0
          lastCallbackAt = performance.now()
          startHeartbeat()
          if (textTrack) {
            const item = textTrack.items.find((it) => current >= it.start && current <= it.end)
            if (item) {
              const meta: any = (item as any).meta || {}
              const text = String(meta.fullText || item.label || '')
              drawSubtitle(ctx, text, meta, targetW, targetH)
            }
          }
          onProgress(Math.min(1, Number(current) / durationSec))
          const epsilon = Math.max(0.002, 1 / Math.max(1, fps))
          const endReached = Number(current) >= (durationSec - epsilon)
          if (!video.ended && !endReached) {
            if (rVFC) rVFC(drawFrame)
            else requestAnimationFrame(() => drawFrame())
          } else {
            console.log('[renderWithRecorder] end reached. current:', current, 'durationSec:', durationSec, 'video.ended:', video.ended)
            requestStop()
          }
        }

        await video.play().catch(() => {})
        console.log('[renderWithRecorder] recorder.start')
        recorder.start(250)
        onStatus('Đang xuất video…')
        if (rVFC) rVFC(drawFrame)
        else requestAnimationFrame(() => drawFrame())
      }

      video.addEventListener('loadedmetadata', onLoaded, { once: true })
      video.load()
    })
  }

  // MediaRecorder path removed as per requirement (WebCodecs-only export)

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
  console.log('[renderWebCodecs] init', { fps, width: opts.width, height: opts.height })
    return new Promise<Blob>((resolve, reject) => {
      let aborted = false
      let finished = false
      let encoderRef: any = null
      const safeReject = (err: any) => { if (!finished) { finished = true; try { encoderRef?.close?.() } catch {} ; reject(err) } }
      const abort = () => { if (finished) return; aborted = true; finished = true; try { encoderRef?.close?.() } catch {} ; reject(new DOMException('Rendering aborted', 'AbortError')) }
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
        console.log('[renderWebCodecs] loadedmetadata')
        const naturalW = video.videoWidth || 1280
        const naturalH = video.videoHeight || 720
        let targetW = opts.width || naturalW
        let targetH = opts.height || naturalH
        const ratio = naturalW / naturalH || 16 / 9
        if (!opts.width && opts.height) targetW = Math.round((opts.height as number) * ratio)
        if (opts.width && !opts.height) targetH = Math.round((opts.width as number) / ratio)

        // Ensure even dimensions for VP8/VP9 encoder stability
        if (targetW % 2 !== 0) targetW -= 1
        if (targetH % 2 !== 0) targetH -= 1

        const canvas = document.createElement('canvas')
        canvas.width = targetW
        canvas.height = targetH
        const ctx = canvas.getContext('2d')!

        const supported = (window as any).VideoEncoder && (window as any).EncodedVideoChunk
        if (!supported) return reject(new Error('WebCodecs not supported in this browser'))

        // Try multiple codec configurations (VP8 → VP9), set a reasonable bitrate for stability
        const codecCandidates = ['vp8', 'vp09.00.10.08']
        let chosenCodec: string | null = null
        let encoder: any = null
        let cfg: any = null

        // Declare writer in outer scope so encoder's output callback can reference it
        let writer: any = null
        for (const c of codecCandidates) {
          const tryCfg = {
            codec: c,
            width: targetW,
            height: targetH,
            framerate: fps,
            latencyMode: 'realtime' as const,
            hardwareAcceleration: 'prefer-hardware' as const,
            bitrate: 4_000_000, // ~4 Mbps baseline, browser may adjust
            bitrateMode: 'variable' as const,
          }
          try {
            // @ts-ignore
            const support = await (window as any).VideoEncoder.isConfigSupported?.(tryCfg)
            if (!support || (support?.supported === false)) continue
            // @ts-ignore
            encoder = new (window as any).VideoEncoder({
              output: (chunk: any) => {
                const data = new Uint8Array(chunk.byteLength)
                chunk.copyTo(data)
                // writer will be assigned after configure; by the time output fires it should exist
                writer && writer.addChunk({ timestampUs: Number(chunk.timestamp), data, key: chunk.type === 'key' })
              },
              error: (e: any) => safeReject(e),
            })
            encoder.configure(tryCfg)
            chosenCodec = c
            cfg = tryCfg
            // Instantiate WebM writer matching chosen codec
            writer = new SimpleWebMWriter(targetW, targetH, c.startsWith('vp9') ? 'V_VP9' : 'V_VP8')
            console.log('[renderWebCodecs] encoder configured', { codec: c, width: targetW, height: targetH, fps })
            break
          } catch (e) {
            try { encoder?.close?.() } catch {}
            encoder = null
            continue
          }
        }

        if (!encoder || !chosenCodec) {
          return reject(new Error('Không khởi tạo được VideoEncoder (VP8/VP9). Trình duyệt/GPU không hỗ trợ cấu hình yêu cầu.'))
        }

  encoderRef = encoder

        const textTrack = tks.find((t) => t.type === 'text')
        const durationSec = video.duration || timelineDuration
        let frameIndex = 0
        const gopSec = 2

  onStatus('Đang mã hóa (WebCodecs)…')
  console.log('[renderWebCodecs] start encode loop')
        await video.play().catch(() => {})

        const rVFC = (video as any).requestVideoFrameCallback?.bind(video)
        if (rVFC) {
          const step = async (_now: number, metadata: any) => {
            if (aborted || finished) return
            ctx.drawImage(video, 0, 0, targetW, targetH)
            const current = Number(metadata?.mediaTime || video.currentTime || 0)
            if (textTrack) {
              const item = textTrack.items.find((it) => current >= it.start && current <= it.end)
              if (item) {
                const meta: any = (item as any).meta || {}
                const text = String(meta.fullText || item.label || '')
                drawSubtitle(ctx, text, meta, targetW, targetH)
              }
            }
            // @ts-ignore
            const frame = new (window as any).VideoFrame(canvas, { timestamp: Math.round(current * 1_000_000) })
            try {
              const gop = Math.max(1, Math.round(gopSec * fps))
              // Guard: avoid encode on closed/unconfigured encoder
              if ((encoder as any).state === 'configured') {
                encoder.encode(frame, { keyFrame: frameIndex === 0 || (frameIndex % gop === 0) })
              }
            } catch (err) {
              frame.close()
              return safeReject(err)
            }
            frame.close()

            frameIndex += 1
            onProgress(Math.min(1, current / durationSec))

            if (current < durationSec && !video.ended) {
              if (!aborted && !finished) rVFC(step)
            } else {
              try { await encoder.flush() } catch {}
              finished = true
              try { encoder.close() } catch {}
              const blob = writer.finalize()
              console.log('[renderWebCodecs] finished, blob:', blob && blob.size)
              resolve(blob)
            }
          }
          rVFC(step)
        } else {
          // Fallback to rAF timing
          let tsUs = 0
          const deltaUs = Math.round(1_000_000 / fps)
          const drawAndEncode = async () => {
            if (aborted || finished) return
            ctx.drawImage(video, 0, 0, targetW, targetH)
            const current = tsUs / 1_000_000
            if (textTrack) {
              const item = textTrack.items.find((it) => current >= it.start && current <= it.end)
              if (item) {
                const meta: any = (item as any).meta || {}
                const text = String(meta.fullText || item.label || '')
                drawSubtitle(ctx, text, meta, targetW, targetH)
              }
            }
            // @ts-ignore
            const frame = new (window as any).VideoFrame(canvas, { timestamp: tsUs })
            try {
              const gop = Math.max(1, Math.round(gopSec * fps))
              if ((encoder as any).state === 'configured') {
                encoder.encode(frame, { keyFrame: frameIndex === 0 || (frameIndex % gop === 0) })
              }
            } catch (err) {
              frame.close()
              return safeReject(err)
            }
            frame.close()

            tsUs += deltaUs
            frameIndex += 1
            onProgress(Math.min(1, current / durationSec))

            if (current < durationSec && !video.ended) {
              if (!aborted && !finished) requestAnimationFrame(drawAndEncode)
            } else {
              try { await encoder.flush() } catch {}
              finished = true
              try { encoder.close() } catch {}
              const blob = writer.finalize()
              console.log('[renderWebCodecs] finished (rAF), blob:', blob && blob.size)
              resolve(blob)
            }
          }
          requestAnimationFrame(drawAndEncode)
        }
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
          let url = origin + data.videoUrl
          // Under COEP, remote media must be CORP-compatible; proxy through same-origin to ensure playback
          try {
            const needProxy = typeof window !== 'undefined' &&
              (window as any).crossOriginIsolated === true &&
              /^https?:\/\//i.test(url) &&
              !url.startsWith(window.location.origin)
            if (needProxy) {
              url = `/api/proxy?url=${encodeURIComponent(url)}`
            }
          } catch {}
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
            let url = origin + val
            try {
              const needProxy = typeof window !== 'undefined' &&
                (window as any).crossOriginIsolated === true &&
                /^https?:\/\//i.test(url) &&
                !url.startsWith(window.location.origin)
              if (needProxy) {
                url = `/api/proxy?url=${encodeURIComponent(url)}`
              }
            } catch {}
            nextUrls[k] = url
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
        progressDetails={progressDetails}
        onCancelRender={() => {
          renderAbortRef.current?.abort()
          setIsRendering(false)
        }}
        outputUrl={outputUrl}
        tempUrl={tempRenderUrl}
        onDownloadOutput={outputUrl ? () => {
          const base = (lastExportSettings?.title || 'export').replace(/\.(mp4|mov|mkv|webm)$/i, '')
          const ext = outputExt || 'webm'
          downloadFile(outputUrl, `${base}.${ext}`)
        } : undefined}
        onDownloadTemp={tempRenderUrl ? () => {
          const base = (lastExportSettings?.title || 'export').replace(/\.(mp4|mov|mkv|webm)$/i, '')
          downloadFile(tempRenderUrl, `${base}.webm`)
        } : undefined}
        onPublish={async (s) => {
          setLastExportSettings(s)
          setOutputUrl(null)
          setOutputExt(null)
          if (tempRenderUrl) { URL.revokeObjectURL(tempRenderUrl); setTempRenderUrl(null) }
          setIsRendering(true)
          setRenderProgress(0)
          setRenderStatus('Chuẩn bị render…')
          setProgressDetails([])
          console.log('[export] Begin pipeline with settings:', s)
          try {
            if (!videoSource?.url) {
              setRenderStatus('Chưa có video để xuất')
              alert('Vui lòng tải hoặc chọn video trước khi xuất')
              return
            }
            const canWebCodecs = typeof (window as any).VideoEncoder !== 'undefined'
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
            let renderBlob: Blob
            let inTranscode = false
            const report = (label: string, p: number) => {
              // Only show progress bar for render stage
              if (!inTranscode) {
                const clamped = Math.max(0, Math.min(1, p))
                setRenderProgress(clamped)
              }
              console.log('[export] progress', { label, p, overall: inTranscode ? 0.7 + 0.0 : p * 0.7 })
            }

            if (canWebCodecs) {
              try {
                console.log('[export] Using WebCodecs path')
                renderBlob = await renderWebCodecsWithTracks(
                  videoSource?.url!,
                  tracks,
                  { fps, height: targetHeight, onProgress: (p) => report('Render', p), onStatus: (t) => setRenderStatus(t), signal: ac.signal }
                )
              } catch (err) {
                console.warn('[export] WebCodecs failed, using MediaRecorder fallback:', err)
                setRenderStatus('WebCodecs lỗi, đang chuyển sang fallback MediaRecorder…')
                renderBlob = await renderWithRecorder(
                  videoSource?.url!,
                  tracks,
                  { fps, height: targetHeight, onProgress: (p) => report('Render (fallback)', p), onStatus: (t) => setRenderStatus(t), signal: ac.signal }
                )
              }
            } else {
              console.log('[export] WebCodecs not available, using MediaRecorder fallback')
              setRenderStatus('WebCodecs không khả dụng, dùng fallback MediaRecorder…')
              renderBlob = await renderWithRecorder(
                videoSource?.url!,
                tracks,
                { fps, height: targetHeight, onProgress: (p) => report('Render (fallback)', p), onStatus: (t) => setRenderStatus(t), signal: ac.signal }
              )
            }
            // Offer temp download of the rendered WebM immediately
            try { if (tempRenderUrl) URL.revokeObjectURL(tempRenderUrl) } catch {}
            const tmpUrl = URL.createObjectURL(renderBlob)
            console.log('[export] Render finished. Temp WebM URL ready. Size:', renderBlob.size)
            setTempRenderUrl(tmpUrl)
            // Convert/match to selected container/codec when feasible
            // Switch UI to indeterminate spinner: keep progress bar at 100% for render
            inTranscode = true
            setRenderProgress(1)
            setRenderStatus('Đang chuyển định dạng…')
            console.log('[export] Starting transcode stage with format:', s.format, 'codec:', s.codec)
            const { blob, ext } = await transcodeOrRemux(renderBlob, s, {
              // No progress bar for transcode; keep spinner only
              onProgress: () => {},
              onStatus: (t) => setRenderStatus(t),
            })
            console.log('[export] Transcode finished. Blob size:', blob.size, 'ext:', ext)
            const url = URL.createObjectURL(blob)
            setOutputUrl(url)
            setOutputExt(ext)
            setRenderStatus('Hoàn tất. Đang tải xuống…')
            // Auto-download as soon as render finishes
            const filenameBase = s.title?.replace(/\.(mp4|mov|mkv)$/i, '') || 'export'
            console.log('[export] Trigger download with base:', filenameBase)
            downloadFile(url, `${filenameBase}.${ext}`)
            // Optionally keep the dialog open; user can close it after download
          } catch (e: any) {
            if (e?.name === 'AbortError') {
              setRenderStatus('Đã hủy render')
              console.warn('[export] Aborted by user')
            } else {
              setRenderStatus('Lỗi khi render')
              console.error(e)
              console.error('[export] Pipeline failed:', e)
              alert('Render thất bại: ' + (e?.message || 'Unknown error'))
            }
          } finally {
            console.log('[export] Pipeline end, cleaning up. isRendering=false')
            setIsRendering(false)
            // Cleanup temp url if we have a final output
            if (outputUrl && tempRenderUrl) {
              try { URL.revokeObjectURL(tempRenderUrl) } catch {}
              setTempRenderUrl(null)
            }
          }
        }}
      />
    </div>
  )
}
