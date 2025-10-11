"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { TimelineTrack } from './types'
import './timeline-zoom-fix.css'

const LABEL_WIDTH = 180
const MARKER_HEIGHT = 36
const ROW_HEIGHT = 34
const ROW_GAP = 12
const PADDING_X = 24
const PADDING_Y = 20
const BASE_PIXEL_PER_SECOND = 120
const THUMB_CAPTURE_HEIGHT = 120

function formatTimestamp(seconds: number) {
  const s = Math.floor(Math.max(0, seconds))
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function pickTickInterval(duration: number) {
  if (duration <= 10) return 1
  if (duration <= 30) return 2
  if (duration <= 60) return 5
  if (duration <= 3 * 60) return 10
  if (duration <= 10 * 60) return 30
  return 60
}

type ThumbnailSpec = { time: number; duration?: number }

async function generateVideoThumbnails(src: string, thumbs: ThumbnailSpec[]): Promise<string[]> {
  const video = document.createElement('video')
  video.crossOrigin = 'anonymous'
  video.src = src
  video.muted = true
  video.playsInline = true

  await new Promise<void>((resolve, reject) => {
    const onLoaded = () => resolve()
    const onError = () => reject(new Error('Failed to load video'))
    video.addEventListener('loadedmetadata', onLoaded, { once: true })
    video.addEventListener('error', onError, { once: true })
  })

  const ratio = video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 16 / 9
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(THUMB_CAPTURE_HEIGHT * ratio))

  const ctx = canvas.getContext('2d')!

  const results: string[] = []
  for (const spec of thumbs) {
    const t = Math.max(0, Math.min(video.duration || spec.time, spec.time))
    await new Promise<void>((resolve) => {
      const onSeeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        results.push(canvas.toDataURL('image/jpeg', 0.7))
        video.removeEventListener('seeked', onSeeked)
        resolve()
      }
      video.addEventListener('seeked', onSeeked)
      try { video.currentTime = t } catch { resolve() }
    })
  }
  return results
}

type CompositionProps = {
  tracks: TimelineTrack[]
  durationInSeconds: number
  pxPerSecond: number
  thumbnailMap: Record<string, string[]>
  draggingItem: { trackId: string; itemId: string } | null
  onBeginDrag?: (params: {
    trackId: string
    itemId: string
    mode: 'move' | 'start' | 'end'
    clientX: number
    start: number
    end: number
    isTextTrack?: boolean
  }) => void
  onSeek?: (seconds: number) => void
  onSelect?: (trackId: string, itemId: string) => void
  selected: { trackId: string; itemId: string } | null
  onUpdateTrackItemMeta?: (trackId: string, itemId: string, meta: Record<string, any>) => void
  currentTime: number
}

function TimelineComposition({ tracks, durationInSeconds, pxPerSecond, thumbnailMap, draggingItem, onBeginDrag, onSeek, onSelect, selected, currentTime }: CompositionProps) {
  // Use passed currentTime instead of Remotion frame
  const currentSeconds = currentTime
  const timelineWidth = Math.max(1, durationInSeconds) * pxPerSecond
  const totalRowsHeight = tracks.length > 0 ? tracks.length * ROW_HEIGHT + Math.max(0, tracks.length - 1) * ROW_GAP : ROW_HEIGHT
  const tickInterval = pickTickInterval(durationInSeconds)

  const ticks = useMemo(() => {
    const list: number[] = []
    if (durationInSeconds <= 0) { list.push(0); return list }
    for (let t = 0; t <= durationInSeconds + 0.001; t += tickInterval) list.push(Number(t.toFixed(2)))
    if (list[list.length - 1] < durationInSeconds) list.push(durationInSeconds)
    return list
  }, [durationInSeconds, tickInterval])

  const playheadLeft = currentSeconds * pxPerSecond

  return (
    <div style={{ position: 'relative', width: timelineWidth, height: MARKER_HEIGHT + totalRowsHeight, background: 'rgba(15, 23, 42, 0.65)', borderRadius: 16, border: '1px solid rgba(100, 116, 139, 0.25)', boxShadow: '0 12px 25px rgba(15, 23, 42, 0.45) inset', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: MARKER_HEIGHT }}>
          {ticks.map((tick) => {
            const left = tick * pxPerSecond
            return (
              <div key={`tick-${tick}`} style={{ position: 'absolute', left }}>
                <div style={{ position: 'absolute', bottom: 2, height: MARKER_HEIGHT - 10, width: 1, background: 'rgba(148, 163, 184, 0.4)' }} />
                <div style={{ position: 'absolute', bottom: MARKER_HEIGHT - 6, transform: 'translateX(-50%)', fontSize: 11, color: '#94a3b8' }}>{formatTimestamp(tick)}</div>
              </div>
            )
          })}
        </div>

        <div style={{ position: 'absolute', top: MARKER_HEIGHT, left: 0, right: 0, height: totalRowsHeight }}>
          {tracks.map((track, index) => {
            const top = index * (ROW_HEIGHT + ROW_GAP)
            const isThumbnailTrack = Boolean(track.type === 'image' && track.assetSrc && track.thumbnails && track.thumbnails.length > 0)
            const isTextTrack = track.type === 'text'
            const totalDuration = durationInSeconds > 0 ? durationInSeconds : 1
            return (
              <div key={`${track.id}-timeline-row`} style={{ position: 'absolute', top, left: 0, right: 0, height: ROW_HEIGHT, borderRadius: 10, background: isThumbnailTrack ? 'rgba(15, 23, 42, 0.35)' : isTextTrack ? 'rgba(99, 102, 241, 0.18)' : 'rgba(30, 41, 59, 0.55)', border: '1px solid rgba(148, 163, 184, 0.18)', overflow: 'hidden' }}>
                {isThumbnailTrack && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 0, pointerEvents: 'none' }}>
                    {(track.thumbnails ?? []).map((thumb, thumbIndex) => {
                      const segmentDuration = (thumb.duration ?? totalDuration / (track.thumbnails?.length || 1))
                      const widthPercent = Math.min(1, Math.max(segmentDuration / totalDuration, 0))
                      const flexAmount = Math.max(widthPercent, 0.0001)
                      const images = thumbnailMap[track.id] ?? []
                      const imageSrc = images[thumbIndex] ?? images[images.length - 1]
                      return (
                        <div key={`${track.id}-thumb-${thumbIndex}`} style={{ flexBasis: `${flexAmount * 100}%`, flexGrow: flexAmount, flexShrink: 0, height: '100%', overflow: 'hidden' }}>
                          {imageSrc ? <img src={imageSrc} alt="thumbnail" style={{ height: '100%', display: 'block' }} /> : <div style={{ width: '100%', height: '100%', background: 'rgba(30,41,59,0.6)' }} />}
                        </div>
                      )
                    })}
                  </div>
                )}
                {!isThumbnailTrack && track.items.map((item) => {
                  const startPx = Math.max(0, item.start * pxPerSecond)
                  const widthPx = Math.max(4, Math.max(0, (item.end - item.start)) * pxPerSecond)
                  const isCurrentDragging = Boolean(draggingItem && draggingItem.trackId === track.id && draggingItem.itemId === item.id)
                  const isSelected = Boolean(selected && selected.trackId === track.id && selected.itemId === item.id)
                  const isAudioTrack = track.type === 'audio'
                  const draggable = !isAudioTrack && !isThumbnailTrack
                  const beginDrag = (mode: 'move' | 'start' | 'end') => (event: ReactPointerEvent) => {
                    if (!onBeginDrag || !draggable) return
                    event.preventDefault(); event.stopPropagation()
                    onBeginDrag({ trackId: track.id, itemId: item.id, mode, clientX: event.clientX, start: item.start, end: item.end, isTextTrack: track.type === 'text' })
                  }
                  const cursor = draggable ? (isCurrentDragging ? 'grabbing' : 'grab') : (isAudioTrack ? 'not-allowed' : 'default')
                  return (
                    <div
                      key={item.id}
                      onPointerDown={(e) => {
                        // Begin move-drag when pressing on the body (not on handles)
                        if (!onBeginDrag || !draggable) return
                        const target = e.target as HTMLElement
                        if (target && target.dataset.role === 'track-handle') return
                        beginDrag('move')(e as unknown as ReactPointerEvent)
                      }}
                      onPointerUp={(e) => {
                        if (!draggingItem || draggingItem.trackId !== track.id || draggingItem.itemId !== item.id) {
                          if (onSelect) onSelect(track.id, item.id)
                          if (onSeek) onSeek(item.start)
                        }
                      }}
                      data-role={'track-item'}
                      style={{ position: 'absolute', left: startPx, width: widthPx, top: 4, bottom: 4, borderRadius: 8, background: isTextTrack ? 'rgba(99, 102, 241, 0.8)' : item.color, boxShadow: isCurrentDragging ? '0 0 0 2px rgba(56, 189, 248, 0.9)' : '0 8px 18px rgba(15, 23, 42, 0.45)', outline: isSelected ? '2px solid rgba(99, 102, 241, 0.95)' : undefined, transform: isSelected ? 'translateY(-1px)' : undefined, display: 'flex', alignItems: 'center', justifyContent: isTextTrack ? 'flex-start' : 'center', fontSize: isTextTrack ? 12 : 11, fontWeight: isTextTrack ? 500 : 600, color: isTextTrack ? '#ede9fe' : '#0f172a', textTransform: isTextTrack ? 'none' : 'uppercase', letterSpacing: isTextTrack ? 0 : 0.4, padding: isTextTrack ? '0 18px' : undefined, overflow: 'hidden', whiteSpace: isTextTrack ? 'nowrap' : undefined, textOverflow: isTextTrack ? 'ellipsis' : undefined, cursor, userSelect: 'none', zIndex: isTextTrack ? 2 : 1 }}
                    >
                      {draggable ? (
                        <>
                          <span onPointerDown={beginDrag('start')} data-role="track-handle" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, cursor: 'ew-resize', background: 'rgba(15, 23, 42, 0.3)' }} />
                          <span style={{ flex: 1 }}>{item.label}</span>
                          <span onPointerDown={beginDrag('end')} data-role="track-handle" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 8, cursor: 'ew-resize', background: 'rgba(15, 23, 42, 0.3)' }} />
                        </>
                      ) : (
                        <span style={{ flex: 1 }}>{item.label}</span>
                      )}
                    </div>
                  ) 
                })}
              </div>
            )
          })}
        </div>

        <div style={{ position: 'absolute', top: 0, bottom: 0, left: playheadLeft, width: 2, background: 'rgba(56, 189, 248, 0.95)', boxShadow: '0 0 12px rgba(56, 189, 248, 0.6)' }} />
      </div>
  )
}

export type RemotionTimelineProps = {
  tracks: TimelineTrack[]
  duration: number
  currentTime: number
  fps?: number
  zoom: number
  onSeek: (seconds: number) => void
  onZoomChange?: (value: number) => void
  onUpdateTrackItem?: (params: { trackId: string; itemId: string; start?: number; end?: number }) => void
  onDeleteTrackItem?: (params: { trackId: string; itemId: string }) => void
  onUpdateTrackItemMeta?: (params: { trackId: string; itemId: string; meta: Record<string, any> }) => void
  onSelect?: (selection: { trackId: string; itemId: string } | null) => void
}

type DragState = { trackId: string; itemId: string; mode: 'move' | 'start' | 'end'; startClientX: number; initialStart: number; initialEnd: number }

export function RemotionTimeline({
  tracks,
  duration,
  currentTime,
  fps = 30,
  zoom,
  onSeek,
  onZoomChange,
  onUpdateTrackItem,
  onDeleteTrackItem,
  onUpdateTrackItemMeta: onUpdateTrackItemMetaProp,
  onSelect: onSelectProp,
}: RemotionTimelineProps) {
  const [selected, setSelected] = useState<{ trackId: string; itemId: string } | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected && onDeleteTrackItem) {
        onDeleteTrackItem(selected)
        setSelected(null)
        onSelectProp?.(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, onDeleteTrackItem, onSelectProp])

  // Remove playerRef - not using Remotion Player anymore
  const rootRef = useRef<HTMLDivElement>(null)
  const tracksViewportRef = useRef<HTMLDivElement>(null)
  const thumbnailCacheRef = useRef(new Map<string, string[]>())
  const [thumbnailMap, setThumbnailMap] = useState<Record<string, string[]>>({})
  const [containerWidth, setContainerWidth] = useState(1024)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [draggingItem, setDraggingItem] = useState<{ trackId: string; itemId: string } | null>(null)
  const isScrubbingRef = useRef(false)
  const lastPointerXRef = useRef<number | null>(null)
  const scrollRAFRef = useRef<number | null>(null)

  const safeFps = Math.max(1, Math.round(fps))
  const paddingWidth = PADDING_X * 2

  useEffect(() => {
    const update = () => {
      const n = tracksViewportRef.current
      if (!n) return
      const width = n.clientWidth
      if (width > 0) setContainerWidth(width)
    }
    update()
    if (typeof ResizeObserver !== 'undefined' && tracksViewportRef.current) {
      const ro = new ResizeObserver(() => update())
      ro.observe(tracksViewportRef.current)
      return () => ro.disconnect()
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }
    return undefined
  }, [])

  // Removed zoom/global wheel prevention per SAMPLE SRC model

  const availableTimelineWidthRaw = Math.max(containerWidth - paddingWidth, 0)
  const basePxPerSecondRaw = duration > 0 ? availableTimelineWidthRaw / duration : availableTimelineWidthRaw
  const pxPerSecond = useMemo(() => {
    const zoomFactor = Math.max(0.2, Math.min(zoom / 40, 4))
    const base = basePxPerSecondRaw > 0 ? basePxPerSecondRaw : BASE_PIXEL_PER_SECOND * 0.5
    return Math.max(base * zoomFactor, 0.5)
  }, [basePxPerSecondRaw, zoom])

  // Timeline width grows with zoom - this is the scrollable content width
  const timelineWidth = duration > 0 ? pxPerSecond * duration : availableTimelineWidthRaw
  const totalRowsHeight = tracks.length > 0 ? tracks.length * ROW_HEIGHT + Math.max(0, tracks.length - 1) * ROW_GAP : ROW_HEIGHT
  const totalHeight = MARKER_HEIGHT + totalRowsHeight + PADDING_Y * 2

  const handleBeginDrag = useCallback(({ trackId, itemId, mode, clientX, start, end }: { trackId: string; itemId: string; mode: DragState['mode']; clientX: number; start: number; end: number }) => {
    if (!onUpdateTrackItem) return
    setDragState({ trackId, itemId, mode, startClientX: clientX, initialStart: start, initialEnd: end })
    setDraggingItem({ trackId, itemId })
  }, [onUpdateTrackItem])

  useEffect(() => {
    let cancelled = false
    const loadThumbnails = async () => {
      const entries = await Promise.all(tracks.map(async (track) => {
        if (!(track.type === 'image' && track.assetSrc && track.thumbnails && track.thumbnails.length)) return [track.id, undefined] as const
        const cacheKey = `${track.assetSrc}|${track.thumbnails.map((t) => `${t.time}-${t.duration ?? ''}`).join(',')}`
        const cached = thumbnailCacheRef.current.get(cacheKey)
        if (cached) return [track.id, cached] as const
        try {
          const specs: ThumbnailSpec[] = (track.thumbnails ?? []).map((t) => ({ time: t.time, duration: t.duration }))
          const images = await generateVideoThumbnails(track.assetSrc, specs)
          if (!cancelled && images.length) thumbnailCacheRef.current.set(cacheKey, images)
          return [track.id, images] as const
        } catch { return [track.id, []] as const }
      }))
      if (cancelled) return
      setThumbnailMap(() => { const next: Record<string, string[]> = {}; for (const [trackId, images] of entries) if (images && images.length) next[trackId] = images as string[]; return next })
    }
    loadThumbnails();
    return () => { cancelled = true }
  }, [tracks])

  // Remove Player sync - using direct currentTime now

  const handleSeek = useCallback((clientX: number) => {
    const cont = tracksViewportRef.current
    if (!cont || duration <= 0) return
    const rect = cont.getBoundingClientRect()
    const scrollLeft = cont.scrollLeft || 0
    const offsetX = clientX - rect.left + scrollLeft
    const timelineX = offsetX - PADDING_X
    const seconds = timelineX / pxPerSecond
    const clamped = Math.min(duration, Math.max(0, seconds))
    onSeek(clamped)
  }, [duration, onSeek, pxPerSecond])

  useEffect(() => {
    if (!dragState || !onUpdateTrackItem) return
    const handlePointerMove = (event: PointerEvent) => {
      lastPointerXRef.current = event.clientX
      const deltaPx = event.clientX - dragState.startClientX
      const deltaSeconds = deltaPx / pxPerSecond
      const segmentLength = dragState.initialEnd - dragState.initialStart
      const minSegment = 0.1
      const totalDuration = duration > 0 ? duration : dragState.initialEnd
      let nextStart = dragState.initialStart
      let nextEnd = dragState.initialEnd
      if (dragState.mode === 'move') { nextStart = Math.max(0, Math.min(dragState.initialStart + deltaSeconds, totalDuration - segmentLength)); nextEnd = Math.min(totalDuration, nextStart + segmentLength) }
      else if (dragState.mode === 'start') { nextStart = Math.max(0, Math.min(dragState.initialStart + deltaSeconds, dragState.initialEnd - minSegment)); nextEnd = dragState.initialEnd }
      else if (dragState.mode === 'end') { nextEnd = Math.min(totalDuration, Math.max(dragState.initialEnd + deltaSeconds, dragState.initialStart + minSegment)); nextStart = dragState.initialStart }
      onUpdateTrackItem({ trackId: dragState.trackId, itemId: dragState.itemId, start: nextStart, end: nextEnd })
    }
    const handlePointerUp = () => { setDragState(null); setDraggingItem(null); lastPointerXRef.current = null; if (scrollRAFRef.current) { cancelAnimationFrame(scrollRAFRef.current); scrollRAFRef.current = null } }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp, { once: true })
    return () => { window.removeEventListener('pointermove', handlePointerMove); window.removeEventListener('pointerup', handlePointerUp) }
  }, [dragState, onUpdateTrackItem, pxPerSecond, duration])

  // Auto-scroll near edges while dragging
  useEffect(() => {
    if (!dragState) return
    const tick = () => {
      if (!dragState) { scrollRAFRef.current = null; return }
      const cont = tracksViewportRef.current
      const pointerX = lastPointerXRef.current
      if (cont && typeof pointerX === 'number') {
        const rect = cont.getBoundingClientRect()
        const edge = 48
        let dx = 0
        if (pointerX < rect.left + edge) dx = -Math.min(30, (rect.left + edge - pointerX) * 0.4)
        else if (pointerX > rect.right - edge) dx = Math.min(30, (pointerX - (rect.right - edge)) * 0.4)
        if (dx !== 0) cont.scrollLeft = Math.max(0, Math.min(cont.scrollLeft + dx, cont.scrollWidth))
      }
      scrollRAFRef.current = requestAnimationFrame(tick)
    }
    scrollRAFRef.current = requestAnimationFrame(tick)
    return () => { if (scrollRAFRef.current) cancelAnimationFrame(scrollRAFRef.current); scrollRAFRef.current = null }
  }, [dragState])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => { if (!isScrubbingRef.current) return; handleSeek(event.clientX) }
    const handlePointerUp = () => { isScrubbingRef.current = false }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => { window.removeEventListener('pointermove', handlePointerMove); window.removeEventListener('pointerup', handlePointerUp) }
  }, [handleSeek])

  const handlePointerDownCapture = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const target = event.target as HTMLElement
    const role = target.dataset.role
    if (role === 'track-item' || role === 'track-handle') return
    const cont = tracksViewportRef.current
    if (!cont) return
    const rect = cont.getBoundingClientRect()
    const offsetY = event.clientY - rect.top
    const withinRuler = offsetY <= PADDING_Y + MARKER_HEIGHT
    if (!withinRuler) return
    isScrubbingRef.current = true
    handleSeek(event.clientX)
  }, [handleSeek])

  return (
    <div
      className="relative rounded-2xl border border-slate-800 bg-slate-900/60 w-full overflow-hidden select-none"
      style={{ 
        contain: 'layout paint', 
        touchAction: 'pan-x',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
      data-timeline-container
      tabIndex={0}
      ref={rootRef}
    >
      <div className="flex w-full">
        <div className="shrink-0" style={{ padding: `${PADDING_Y}px ${PADDING_X}px`, width: LABEL_WIDTH + PADDING_X, height: totalHeight }}>
          <div style={{ height: MARKER_HEIGHT }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: ROW_GAP }}>
            {tracks.map((track) => (
              <div key={`label-${track.id}`} style={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: 8, background: 'rgba(71,85,105,0.25)', border: '1px solid rgba(71,85,105,0.3)', color: '#f8fafc', fontSize: 13, fontWeight: 600 }}>
                <span>{track.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div ref={tracksViewportRef} className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden" style={{ 
          overscrollBehaviorX: 'contain',
          touchAction: 'pan-x'
        }}>
          {/* Scrollable timeline content - width grows with zoom */}
          <div
            style={{ 
              width: timelineWidth + PADDING_X * 2,
              minWidth: '100%',
              touchAction: 'pan-x',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            onPointerDownCapture={handlePointerDownCapture}
            onWheelCapture={(e) => {
              // Handle Cmd/Ctrl+wheel for timeline zoom only
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault()
                e.stopPropagation()

                if (!onZoomChange) return

                const delta = e.deltaY
                const currentZoom = zoom
                const step = Math.max(1, Math.round(Math.abs(delta) > 50 ? 6 : 3))
                const nextZoom = Math.max(1, Math.min(160, currentZoom + (delta > 0 ? -step : step)))
                const cont = tracksViewportRef.current
                if (!cont) { onZoomChange(nextZoom); return }

                // Compute next pixels-per-second using same base calculation
                const zoomFactor = Math.max(0.2, Math.min(nextZoom / 40, 4))
                const base = basePxPerSecondRaw > 0 ? basePxPerSecondRaw : BASE_PIXEL_PER_SECOND * 0.5
                const nextPps = Math.max(base * zoomFactor, 0.5)

                // Determine anchor: default to playhead; hold Alt to anchor to cursor
                let newScrollLeft: number
                const rect = cont.getBoundingClientRect()
                if (e.altKey) {
                  // Cursor-anchored zoom
                  const mouseX = e.clientX - rect.left + cont.scrollLeft
                  const anchorXContent = mouseX - PADDING_X
                  const anchorTime = anchorXContent / pxPerSecond
                  const nextAnchorXContent = anchorTime * nextPps
                  newScrollLeft = nextAnchorXContent + PADDING_X - (e.clientX - rect.left)
                } else {
                  // Playhead-anchored zoom
                  const currentPlayheadXContent = PADDING_X + currentTime * pxPerSecond
                  const currentAnchorScreenX = currentPlayheadXContent - cont.scrollLeft
                  const nextPlayheadXContent = PADDING_X + currentTime * nextPps
                  newScrollLeft = nextPlayheadXContent - currentAnchorScreenX
                }

                // Clamp to next content width
                const nextTimelineWidth = (duration > 0 ? nextPps * duration : Math.max(containerWidth - PADDING_X * 2, 0))
                const nextInnerWidth = nextTimelineWidth + PADDING_X * 2
                const maxScrollLeft = Math.max(0, nextInnerWidth - cont.clientWidth)
                newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft))

                onZoomChange(nextZoom)
                requestAnimationFrame(() => { cont.scrollLeft = newScrollLeft })
              }
            }}

          >
            {/* Timeline content using CSS layout, not Remotion Player */}
            <div style={{ 
              width: '100%', 
              height: totalHeight,
              position: 'relative',
              backgroundColor: '#0f172a',
              color: '#e2e8f0',
              fontFamily: 'Inter, ui-sans-serif, system-ui',
              padding: `${PADDING_Y}px ${PADDING_X}px`
            }}>
              <TimelineComposition
                tracks={tracks}
                durationInSeconds={duration}
                pxPerSecond={pxPerSecond}
                thumbnailMap={thumbnailMap}
                draggingItem={draggingItem}
                onBeginDrag={onUpdateTrackItem ? handleBeginDrag : undefined}
                onSeek={onSeek}
                onSelect={(trackId: string, itemId: string) => {
                  const sel = { trackId, itemId }
                  setSelected(sel)
                  onSelectProp?.(sel)
                }}
                selected={selected}
                onUpdateTrackItemMeta={(trackId: string, itemId: string, meta: Record<string, any>) => {
                  onUpdateTrackItemMetaProp?.({ trackId, itemId, meta })
                }}
                currentTime={currentTime}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

