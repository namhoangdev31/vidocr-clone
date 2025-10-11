 'use client'

import { RefObject, useMemo } from 'react'
import { TranscriptEntry, TimelineTrack } from './types'
import { Pause, Play, UploadCloud, Volume2, X } from 'lucide-react'
import { UploadDropzone } from './UploadDropzone'
import { VideoSource } from './types'

type VideoPlayerProps = {
  videoSource: VideoSource | null
  videoRef: RefObject<HTMLVideoElement>
  isPlaying: boolean
  currentTime: number
  duration: number
  onTogglePlay: () => void
  onSeek: (seconds: number) => void
  onTimeUpdate: () => void
  onLoadedMetadata: () => void
  onEnded: () => void
  onUpload: (file: File) => void
  onRemove?: () => void
  transcripts?: TranscriptEntry[]
  tracks?: TimelineTrack[]
  hideOverlayButtons?: boolean
}

const formatTime = (value: number) => {
  const totalSeconds = Math.max(0, Math.floor(value))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function VideoPlayer({
  videoSource,
  videoRef,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
  onTimeUpdate,
  onLoadedMetadata,
  onEnded,
  onUpload,
  onRemove,
  transcripts,
  tracks,
  hideOverlayButtons,
}: VideoPlayerProps) {
  if (!videoSource) {
    return (
      <div className="h-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
        <UploadDropzone onUpload={onUpload} />
      </div>
    )
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="relative h-full rounded-xl overflow-hidden bg-black border border-slate-800">
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        src={videoSource.url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        preload="metadata"
      />

      {/* Subtitle overlay: derive from tracks.text if provided, otherwise fall back to transcripts prop */}
      {(() => {
        const displayTranscripts: TranscriptEntry[] | undefined = useMemo(() => {
          if (tracks && tracks.length) {
            const textTrack = tracks.find((t) => t.type === 'text')
            if (textTrack) {
              return textTrack.items
                .map((item) => ({
                  id: item.id,
                  start: item.start,
                  end: item.end,
                  primaryText: item.label,
                  secondaryText: '',
                }))
                .sort((a, b) => a.start - b.start)
            }
          }
          return transcripts && transcripts.length ? transcripts : undefined
        }, [tracks, transcripts])

        if (!displayTranscripts || displayTranscripts.length === 0) return null
        const active = displayTranscripts.find((t) => currentTime >= t.start && currentTime <= t.end)
        if (!active) return null
        return (
          <div className="pointer-events-none absolute left-1/2 transform -translate-x-1/2 bottom-20 max-w-[80%] text-center">
            <div className="bg-black/60 px-4 py-2 rounded-md text-white">
              <div className="text-sm font-medium leading-tight">{active.primaryText}</div>
              {active.secondaryText && <div className="text-xs text-slate-200 mt-1">{active.secondaryText}</div>}
            </div>
          </div>
        )
      })()}

      {!hideOverlayButtons && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

          <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-black/60 text-xs text-white pointer-events-auto">
              {videoSource.name}
            </div>
          </div>
        </>
      )}

      {!hideOverlayButtons && (
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
          <div className="mb-2 flex justify-between text-xs text-slate-200">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="group relative h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer" onClick={(event) => {
            const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
            const fraction = (event.clientX - rect.left) / rect.width
            onSeek(fraction * duration)
          }}>
            <div className="absolute inset-y-0 left-0 bg-sky-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onTogglePlay}
                className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-400"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>
              <button type="button" className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center">
                <Volume2 size={18} />
              </button>
            </div>
            {!hideOverlayButtons && (
              <label className="flex items-center gap-2 text-sm text-slate-200 px-3 py-2 rounded-md bg-black/50 cursor-pointer">
                <UploadCloud size={16} />
                <span>Replace</span>
                <input
                  type="file"
                  accept="video/mp4,video/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) onUpload(file)
                  }}
                />
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
