'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Bookmark, Grid, MessageCircle, PanelsTopLeft, Settings, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import VideoSmallTool from './VideoSmallTool'
import { EditorHeader } from './Header'
import { Toolbar } from './Toolbar'
import { Timeline } from './Timeline'
import { TranscriptPanel } from './TranscriptPanel'
import { VideoPlayer } from './VideoPlayer'
import { VideoEditorProps, ToolbarItem } from './types'

export function VideoEditor({
  videoSource,
  toolbarItems,
  headerInfo,
  tracks,
  transcripts,
  timelineDuration,
  onUpload,
  onRemoveVideo,
  onDurationChange,
  onSeek,
  onUpdateTrackItem,
  onApplyTranscripts,
  onDeleteTrackItem,
  onUpdateTrackItemMeta,
}: VideoEditorProps) {
  const [selected, setSelected] = useState<{ trackId: string; itemId: string } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(timelineDuration)
  const [zoom, setZoom] = useState(40)
  const centerRef = useRef<HTMLDivElement | null>(null)
  const [centerHeight, setCenterHeight] = useState<number | null>(null)
  const [isMuted, setIsMuted] = useState(false)

  const formatTime = (seconds: number) => {
    // Format as H:MM:SS.hh (hours not padded, minutes/seconds padded to 2, hundredths padded to 2)
    const totalHundredths = Math.max(0, Math.floor((seconds || 0) * 100))
    const hours = Math.floor(totalHundredths / (3600 * 100))
    const remAfterHours = totalHundredths % (3600 * 100)
    const minutes = Math.floor(remAfterHours / (60 * 100))
    const remAfterMinutes = remAfterHours % (60 * 100)
    const secs = Math.floor(remAfterMinutes / 100)
    const hundredths = remAfterMinutes % 100
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`
  }

  useEffect(() => {
    setDuration(timelineDuration)
  }, [timelineDuration])

  useEffect(() => {
    if (!videoSource) {
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [videoSource])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video
        .play()
        .catch(() => {
          setIsPlaying(false)
        })
    } else {
      video.pause()
    }
  }, [isPlaying])

  // Sync mute state to the underlying video element
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = isMuted
    }
  }, [isMuted])

  // (Auto-apply handled in parent page to avoid interference with videoSource-driven resets.)

  // Observe center column height and set centerHeight for the right panel
  useEffect(() => {
    const el = centerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height
        setCenterHeight(Math.round(h))
      }
    })

    ro.observe(el)
    // initial set
    setCenterHeight(Math.round(el.getBoundingClientRect().height))

    return () => ro.disconnect()
  }, [centerRef.current])

  const handleTogglePlay = () => {
    if (!videoSource) return
    setIsPlaying((prev) => !prev)
  }

  const handleTimeUpdate = () => {
    const current = videoRef.current?.currentTime ?? 0
    setCurrentTime(current)
    onSeek?.(current)
  }

  const handleSeek = (value: number) => {
    const safeDuration = duration > 0 ? duration : timelineDuration
    const clamped = Math.min(safeDuration, Math.max(0, value))
    const video = videoRef.current
    if (video) {
      video.currentTime = clamped
    }
    setCurrentTime(clamped)
    onSeek?.(clamped)
  }

  const handleLoadedMetadata = () => {
    const loadedDuration = videoRef.current?.duration
    if (loadedDuration && Number.isFinite(loadedDuration)) {
      setDuration(loadedDuration)
      onDurationChange?.(loadedDuration)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const effectiveToolbarItems: ToolbarItem[] = useMemo(() => {
    const fallbackItems: ToolbarItem[] = [
      { id: 'media', icon: <PanelsTopLeft size={18} />, label: 'Media', active: true },
      { id: 'text', icon: <MessageCircle size={18} />, label: 'Text' },
      { id: 'templates', icon: <Grid size={18} />, label: 'Templates' },
      { id: 'element', icon: <Bookmark size={18} />, label: 'Elements' },
      { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
    ]
    return toolbarItems.length ? toolbarItems : fallbackItems
  }, [toolbarItems])

  return (
    <div className="flex bg-slate-900 text-white h-full overflow-hidden">
      <Toolbar items={effectiveToolbarItems} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <EditorHeader info={headerInfo} />

        <div className="flex-1 flex min-h-0 items-stretch overflow-hidden">
          <div ref={centerRef} className="flex-1 flex flex-col gap-6 p-6 min-h-0 min-w-0 overflow-hidden">
            <div className="flex gap-4 text-sm text-slate-300 flex-shrink-0">
              {['Text', 'Audio', 'Image', 'Effect'].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="px-4 py-2 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60"
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-0 min-w-0 grid [grid-template-rows:minmax(0,1fr)_auto] gap-0 overflow-hidden">
              <VideoPlayer
                videoSource={videoSource}
                videoRef={videoRef}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                onTogglePlay={handleTogglePlay}
                onSeek={handleSeek}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onUpload={onUpload}
                onRemove={onRemoveVideo}
                transcripts={transcripts}
                tracks={tracks}
                hideOverlayButtons={true}
              />
              {videoSource && (
                <div className="pt-2">
                  {/* dashed separator */}
                  <div
                    aria-hidden
                    className="w-full h-2 opacity-70"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(to right, rgba(255,255,255,0.14) 0 2px, rgba(0,0,0,0) 2px 16px)'
                    }}
                  />
                  <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center text-slate-300">
                    {/* Left: Time */}
                    <div className="justify-self-start font-mono text-[11px] sm:text-xs">
                      {formatTime(currentTime)} <span className="text-slate-500">/ {formatTime(duration)}</span>
                    </div>
                    {/* Center: Play/Pause */}
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="justify-self-center text-slate-400 hover:text-slate-200 transition-colors p-1.5"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-0.5" />}
                    </button>
                    {/* Right: Mute/Unmute */}
                    <button
                      type="button"
                      onClick={() => setIsMuted((v) => !v)}
                      className="justify-self-end text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Only forward selection to VideoSmallTool when the selected item belongs to a text track.
                Also ensure apply handler only updates the text item's meta. */}
            <VideoSmallTool
              selected={(() => {
                if (!selected) return null
                const track = tracks.find((t) => t.id === selected.trackId)
                if (!track || track.type !== 'text') return null
                // ensure the item exists on the track
                const item = track.items.find((i) => i.id === selected.itemId)
                return item ? selected : null
              })()}
              // pass selected item's existing meta so the tool can initialize/reset
              selectedMeta={(() => {
                if (!selected) return undefined
                const track = tracks.find((t) => t.id === selected.trackId)
                if (!track || track.type !== 'text') return undefined
                const item = track.items.find((i) => i.id === selected.itemId)
                return item?.meta
              })()}
              onApplyToSelected={(meta) => {
                if (!selected) return
                const track = tracks.find((t) => t.id === selected.trackId)
                if (!track || track.type !== 'text') return
                const item = track.items.find((i) => i.id === selected.itemId)
                if (!item) return
                // Only update the selected text item's meta
                onUpdateTrackItemMeta?.({ trackId: track.id, itemId: item.id, meta })
              }}
            />
          </div>

          <TranscriptPanel
            entries={transcripts}
            currentTime={currentTime}
            onSeek={handleSeek}
            height={centerHeight}
            onApplyTranscripts={onApplyTranscripts}
            onUpdateEntry={(entryId, changes) => {
              // Reflect text edits onto the text track item meta.fullText and also update transcripts
              const textTrack = tracks.find((t) => t.type === 'text')
              const item = textTrack?.items.find((i) => i.id === entryId)
              if (item && onUpdateTrackItemMeta) {
                const nextMeta = {
                  ...(item.meta || {}),
                  fullText: typeof changes.primaryText === 'string' ? changes.primaryText : (item.meta as any)?.fullText,
                }
                onUpdateTrackItemMeta({ trackId: textTrack!.id, itemId: item.id, meta: nextMeta })
              }
            }}
          />
        </div>

        <Timeline
          tracks={tracks}
          duration={duration}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onSeek={handleSeek}
          onTogglePlay={handleTogglePlay}
          fps={videoSource?.fps ?? 30}
          zoom={zoom}
          onZoomChange={setZoom}
          onUpdateTrackItem={onUpdateTrackItem}
          onDeleteTrackItem={onDeleteTrackItem}
          onUpdateTrackItemMeta={onUpdateTrackItemMeta}
          onSelect={(s) => setSelected(s)}
          hidePlayTime
        />
      </div>
    </div>
  )
}
