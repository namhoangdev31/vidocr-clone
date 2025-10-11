'use client'

import { Pause, Play, Plus } from 'lucide-react'
import { RemotionTimeline } from './RemotionTimeline'
import { TimelineTrack } from './types'

type TimelineProps = {
  tracks: TimelineTrack[]
  duration: number
  currentTime: number
  isPlaying: boolean
  onSeek: (seconds: number) => void
  onTogglePlay: () => void
  fps: number
  zoom: number
  onZoomChange: (value: number) => void
  onUpdateTrackItem?: (params: {
    trackId: string
    itemId: string
    start?: number
    end?: number
  }) => void
  onUpdateTrackItemMeta?: (params: { trackId: string; itemId: string; meta: Record<string, any> }) => void
  onDeleteTrackItem?: (params: { trackId: string; itemId: string }) => void
  onSelect?: (selection: { trackId: string; itemId: string } | null) => void
  // When true, hide the Play/Pause button and time text (moved to below VideoPlayer)
  hidePlayTime?: boolean
}

const formatTime = (seconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(seconds))
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function Timeline({ tracks, duration, currentTime, isPlaying, onSeek, onTogglePlay, fps, zoom, onZoomChange, onUpdateTrackItem, onDeleteTrackItem, onUpdateTrackItemMeta, onSelect, hidePlayTime }: TimelineProps) {
  
  return (
    <section className="bg-slate-950/90 border-t border-slate-800 flex-shrink-0">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!hidePlayTime && (
            <>
              <button
                type="button"
                onClick={onTogglePlay}
                className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-400"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-white">{formatTime(currentTime)}</span>
                <span className="text-xs text-slate-400">/ {formatTime(duration)}</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-2 pl-6 text-slate-200 text-sm">
            <span>Zoom</span>
            <input
              type="range"
              min={1}
              max={1000}
              value={zoom}
              onChange={(event) => onZoomChange(Number(event.target.value))}
              className="w-36"
            />
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        <RemotionTimeline
          tracks={tracks}
          duration={duration}
          currentTime={currentTime}
          fps={fps}
          zoom={zoom}
          onSeek={onSeek}
          onZoomChange={onZoomChange}
          onUpdateTrackItem={onUpdateTrackItem}
          onDeleteTrackItem={onDeleteTrackItem}
          onUpdateTrackItemMeta={onUpdateTrackItemMeta}
          onSelect={onSelect}
        />

        <div className="flex items-center justify-between text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <button type="button" className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center gap-2">
              <Plus size={16} /> Audio Track
            </button>
            <button type="button" className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center gap-2">
              <Plus size={16} /> Image Track
            </button>
            <button type="button" className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center gap-2">
              <Plus size={16} /> Effect
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Zoom:</span>
            <button type="button" className="px-2 py-1 rounded-md bg-slate-800">-</button>
            <button type="button" className="px-2 py-1 rounded-md bg-slate-800">+</button>
            <button type="button" className="px-3 py-1 rounded-md bg-slate-800">Fit to window</button>
          </div>
        </div>
      </div>
    </section>
  )
}
