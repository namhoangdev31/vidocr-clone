'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Bookmark, Grid, MessageCircle, PanelsTopLeft, Settings } from 'lucide-react'
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
}: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(timelineDuration)
  const [zoom, setZoom] = useState(40)
  const centerRef = useRef<HTMLDivElement | null>(null)
  const [centerHeight, setCenterHeight] = useState<number | null>(null)

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
    <div className="flex bg-slate-900 text-white">
      <Toolbar items={effectiveToolbarItems} />
      <div className="flex-1 flex flex-col">
        <EditorHeader info={headerInfo} />

        <div className="flex-1 flex min-h-0 items-stretch">
          <div ref={centerRef} className="flex-1 flex flex-col gap-6 p-6 min-h-0">
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

            <div className="flex-1 min-h-0">
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
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs text-slate-300 flex-shrink-0">
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="font-semibold text-slate-100">Video info</div>
                <p className="mt-1">Resolution adapts to the uploaded source. Replace to update.</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="font-semibold text-slate-100">Caption style</div>
                <p className="mt-1">Switch between soft subtitles and hard burn in one click.</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="font-semibold text-slate-100">Export preset</div>
                <p className="mt-1">Keep bitrates optimized for social reels.</p>
              </div>
            </div>
          </div>

          <TranscriptPanel entries={transcripts} currentTime={currentTime} onSeek={handleSeek} height={centerHeight} onApplyTranscripts={onApplyTranscripts} />
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
        />
      </div>
    </div>
  )
}
