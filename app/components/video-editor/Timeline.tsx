'use client'

import { Film, Pause, Play, Plus, Sparkles, Type, Waves } from 'lucide-react'
import { RemotionThumbnail } from './RemotionThumbnail'
import { TimelineTrack } from './types'

type TimelineProps = {
  tracks: TimelineTrack[]
  duration: number
  currentTime: number
  isPlaying: boolean
  onSeek: (seconds: number) => void
  onTogglePlay: () => void
  zoom: number
  onZoomChange: (value: number) => void
}

const formatTime = (seconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(seconds))
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function Timeline({ tracks, duration, currentTime, isPlaying, onSeek, onTogglePlay, zoom, onZoomChange }: TimelineProps) {
  const safeDuration = duration > 0 ? duration : 1
  const markers = Array.from({ length: Math.max(3, Math.ceil(safeDuration / 10) + 1) }, (_, index) => index * 10)
  const scale = Math.max(0.4, zoom / 40)

  return (
    <section className="bg-slate-950/90 border-t border-slate-800">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
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
          <div className="flex items-center gap-2 pl-6 text-slate-200 text-sm">
            <span>Zoom</span>
            <input
              type="range"
              min={1}
              max={100}
              value={zoom}
              onChange={(event) => onZoomChange(Number(event.target.value))}
              className="w-36"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Cà chọ</span>
          <input type="range" min={0} max={100} defaultValue={24} className="w-24" />
          <span>Góc chọ</span>
          <input type="range" min={0} max={100} defaultValue={0} className="w-24" />
        </div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-[200px_1fr] text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-2 uppercase tracking-wide">Timeline</div>
          <div className="relative h-6 flex items-center">
            <div className="absolute inset-0 flex">
              {markers.map((marker) => (
                <div key={marker} className="flex-1 border-l border-slate-800/70 relative">
                  <span className="absolute -top-5 left-0 text-[10px] text-slate-500">
                    {formatTime(marker)}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-sky-400"
              style={{ left: `${Math.min(100, (currentTime / safeDuration) * 100 * scale)}%` }}
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/40">
          {tracks.map((track) => (
            <div key={track.id} className="grid grid-cols-[200px_1fr] border-b border-slate-800 last:border-b-0">
              <div className="px-4 py-4 flex items-center gap-2 text-sm text-slate-200">
                {track.type === 'video' && <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300"><Film size={14} /></span>}
                {track.type === 'audio' && <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300"><Waves size={14} /></span>}
                {track.type === 'text' && <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 text-orange-300"><Type size={14} /></span>}
                {track.type === 'effect' && <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300"><Sparkles size={14} /></span>}
                {track.type === 'image' && <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/20 text-pink-300">🖼️</span>}
                <div className="leading-tight">
                  <div className="font-medium">{track.label}</div>
                  {track.resourceName && (
                    <div className="text-xs text-slate-400">{track.resourceName}</div>
                  )}
                </div>
              </div>
              <div className="relative flex items-center py-4">
                <div className="h-20 w-full relative bg-slate-900/50 rounded-md overflow-hidden">
                  {track.type === 'video' && track.assetSrc && track.thumbnails?.length ? (
                    <div className="absolute inset-2 pointer-events-none">
                      {track.thumbnails.map((thumb, index) => {
                        const thumbEnd = Math.min(safeDuration, thumb.time + thumb.duration)
                        const widthPercent = Math.max(4, ((thumbEnd - thumb.time) / safeDuration) * 100 * scale)
                        const offsetPercent = Math.min(100, (thumb.time / safeDuration) * 100 * scale)
                        const fps = track.fps ?? 30
                        const durationInFrames = Math.max(1, Math.round(safeDuration * fps))
                        const frame = thumb.time * fps
                        return (
                          <div
                            key={`${track.id}-thumb-${index}`}
                            className="absolute top-0 bottom-0 px-0.5"
                            style={{ left: `${offsetPercent}%`, width: `${widthPercent}%` }}
                          >
                            <div className="h-full w-full overflow-hidden rounded-md border border-black/30 bg-black/60 shadow-inner">
                              <RemotionThumbnail
                                src={track.assetSrc || ""}
                                frame={frame}
                                width={320}
                                height={180}
                                durationInFrames={durationInFrames}
                                fps={fps}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                  {track.items.map((item) => {
                    const isVideoTrack = track.type === 'video'
                    const widthPercent = Math.max(3, ((item.end - item.start) / safeDuration) * 100 * scale)
                    const offsetPercent = Math.min(100, (item.start / safeDuration) * 100 * scale)
                    return (
                      <div
                        key={item.id}
                        className="absolute top-2 bottom-2 rounded-md flex items-center justify-center text-xs font-semibold text-slate-900 shadow-sm"
                        style={{
                          left: `${offsetPercent}%`,
                          width: `${widthPercent}%`,
                          backgroundColor: item.color,
                          opacity: isVideoTrack ? 0.55 : 1,
                        }}
                        onClick={() => onSeek(item.start)}
                      >
                        {item.label}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between py-4 text-sm text-slate-300">
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
