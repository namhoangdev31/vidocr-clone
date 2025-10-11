'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Player, PlayerRef } from '@remotion/player'
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { TimelineTrack } from './types'

const LABEL_WIDTH = 180
const MARKER_HEIGHT = 36
const ROW_HEIGHT = 34
const ROW_GAP = 12
const PADDING_X = 24
const PADDING_Y = 20
const BASE_PIXEL_PER_SECOND = 120
const THUMB_CAPTURE_HEIGHT = 120

const generateVideoThumbnails = async (
  src: string,
  thumbnails: TimelineTrack['thumbnails'] = [],
): Promise<string[]> => {
  if (!src || !thumbnails?.length) return []

  const video = document.createElement('video')
  video.src = src
  video.muted = true
  video.crossOrigin = 'anonymous'
  video.preload = 'auto'
  video.playsInline = true

  try {
    await new Promise<void>((resolve, reject) => {
      const onLoaded = () => resolve()
      const onError = () => reject(new Error('Failed to load video'))
      video.addEventListener('loadeddata', onLoaded, { once: true })
      video.addEventListener('error', onError, { once: true })
    })
  } catch (error) {
    return []
  }

  const durationSeconds = Number.isFinite(video.duration) ? video.duration : undefined
  const aspect = video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 16 / 9
  const canvas = document.createElement('canvas')
  canvas.height = Math.max(THUMB_CAPTURE_HEIGHT, ROW_HEIGHT)
  canvas.width = Math.max(Math.round(canvas.height * aspect), 2)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []

  const results: string[] = []

  const captureAt = (time: number) =>
    new Promise<void>((resolve, reject) => {
      const targetTime = Math.max(0, Math.min(time, (durationSeconds ?? time)))
      const onSeeked = () => {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          results.push(canvas.toDataURL('image/jpeg', 0.7))
          resolve()
        } catch (err) {
          reject(err)
        }
      }
      const onError = (err: Event) => reject(err as any)
      video.addEventListener('seeked', onSeeked, { once: true })
      video.addEventListener('error', onError, { once: true })
      try {
        video.currentTime = Number.isFinite(targetTime) ? targetTime : 0
      } catch (err) {
        reject(err)
      }
    })

  for (const thumb of thumbnails) {
    const time = Number.isFinite(thumb.time) ? thumb.time : 0
    try {
      await captureAt(time)
    } catch (err) {
      // skip frame on failure
    }
  }

  return results
}

const formatTimestamp = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '00:00'
  const totalSeconds = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const pickTickInterval = (duration: number) => {
  if (duration <= 30) return 1
  if (duration <= 120) return 5
  if (duration <= 300) return 10
  if (duration <= 900) return 30
  return 60
}

type TimelineCompositionProps = {
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
    isTextTrack: boolean
  }) => void
  onSeek?: (seconds: number) => void
  onSelect?: (trackId: string, itemId: string) => void
  selected?: { trackId: string; itemId: string } | null
}

const TimelineComposition: React.FC<TimelineCompositionProps> = ({
  tracks,
  durationInSeconds,
  pxPerSecond,
  thumbnailMap,
  draggingItem,
  onBeginDrag,
  onSeek,
  onSelect,
  selected,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentSeconds = durationInSeconds > 0 && fps > 0 ? Math.min(durationInSeconds, frame / fps) : 0
  const timelineWidth = Math.max(1, durationInSeconds) * pxPerSecond
  const totalRowsHeight = tracks.length > 0 ? tracks.length * ROW_HEIGHT + Math.max(0, tracks.length - 1) * ROW_GAP : ROW_HEIGHT
  const tickInterval = pickTickInterval(durationInSeconds)
  const ticks = useMemo(() => {
    const list: number[] = []
    if (durationInSeconds <= 0) {
      list.push(0)
      return list
    }
    for (let t = 0; t <= durationInSeconds + 0.001; t += tickInterval) {
      list.push(Number(t.toFixed(2)))
    }
    if (list[list.length - 1] < durationInSeconds) {
      list.push(durationInSeconds)
    }
    return list
  }, [durationInSeconds, tickInterval])

  const playheadLeft = currentSeconds * pxPerSecond
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        fontFamily: 'Inter, ui-sans-serif, system-ui',
        padding: `${PADDING_Y}px ${PADDING_X}px`,
      }}
    >
      <div style={{ display: 'flex', height: '100%', gap: 16 }}>
        <div style={{ width: LABEL_WIDTH }}>
          <div style={{ height: MARKER_HEIGHT }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tracks.map((track, index) => (
              <div
                key={track.id}
                style={{
                  height: ROW_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  borderRadius: 8,
                  background: 'rgba(71, 85, 105, 0.25)',
                  border: '1px solid rgba(71, 85, 105, 0.3)',
                  color: '#f8fafc',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: index === tracks.length - 1 ? 0 : ROW_GAP,
                }}
              >
                <span>{track.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div
            style={{
              position: 'relative',
              width: timelineWidth,
              height: MARKER_HEIGHT + totalRowsHeight,
              background: 'rgba(15, 23, 42, 0.65)',
              borderRadius: 16,
              border: '1px solid rgba(100, 116, 139, 0.25)',
              boxShadow: '0 12px 25px rgba(15, 23, 42, 0.45) inset',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: MARKER_HEIGHT }}>
              {ticks.map((tick) => {
                const left = tick * pxPerSecond
                return (
                  <div key={`tick-${tick}`} style={{ position: 'absolute', left }}>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 2,
                        height: MARKER_HEIGHT - 10,
                        width: 1,
                        background: 'rgba(148, 163, 184, 0.4)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: MARKER_HEIGHT - 6,
                        transform: 'translateX(-50%)',
                        fontSize: 11,
                        color: '#94a3b8',
                      }}
                    >
                      {formatTimestamp(tick)}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ position: 'absolute', top: MARKER_HEIGHT, left: 0, right: 0, height: totalRowsHeight }}>
              {tracks.map((track, index) => {
                const top = index * (ROW_HEIGHT + ROW_GAP)
                const isThumbnailTrack = Boolean(
                  track.type === 'image' && track.assetSrc && track.thumbnails && track.thumbnails.length > 0,
                )
                const isTextTrack = track.type === 'text'
                const totalDuration = durationInSeconds > 0 ? durationInSeconds : 1
                return (
                  <div
                    key={`${track.id}-timeline-row`}
                    style={{
                      position: 'absolute',
                      top,
                      left: 0,
                      right: 0,
                      height: ROW_HEIGHT,
                      borderRadius: 10,
                      background: isThumbnailTrack
                        ? 'rgba(15, 23, 42, 0.35)'
                        : isTextTrack
                        ? 'rgba(99, 102, 241, 0.18)'
                        : 'rgba(30, 41, 59, 0.55)',
                      border: '1px solid rgba(148, 163, 184, 0.18)',
                      overflow: 'hidden',
                    }}
                  >
                      {isThumbnailTrack && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            gap: 0,
                            pointerEvents: 'none',
                          }}
                        >
                          {track.thumbnails!.map((thumb, thumbIndex) => {
                            const segmentDuration = thumb.duration ?? totalDuration / track.thumbnails!.length
                            const widthPercent = Math.min(1, Math.max(segmentDuration / totalDuration, 0))
                            const flexAmount = Math.max(widthPercent, 0.0001)
                            const images = thumbnailMap[track.id] ?? []
                            const imageSrc = images[thumbIndex] ?? images[images.length - 1]
                            return (
                              <div
                                key={`${track.id}-thumb-${thumbIndex}`}
                                style={{
                                  flexBasis: `${flexAmount * 100}%`,
                                  flexGrow: flexAmount,
                                  flexShrink: 0,
                                  height: '100%',
                                  overflow: 'hidden',
                                }}
                              >
                                {imageSrc ? (
                                  <img
                                    src={imageSrc}
                                    alt="thumbnail"
                                    style={{ height: '100%', display: 'block' }}
                                  />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', background: 'rgba(30,41,59,0.6)' }} />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                      {!isThumbnailTrack &&
                        track.items.map((item) => {
                          const startPx = interpolate(item.start, [0, durationInSeconds || 1], [0, timelineWidth])
                          const widthPx = interpolate(
                            item.end - item.start,
                            [0, durationInSeconds || 1],
                            [0, timelineWidth],
                            { extrapolateRight: 'clamp' },
                          )
                          const isCurrentDragging =
                            Boolean(
                              draggingItem &&
                                draggingItem.trackId === track.id &&
                                draggingItem.itemId === item.id,
                            )
                          const isSelected = Boolean(selected && selected.trackId === track.id && selected.itemId === item.id)

                          const beginDrag = (mode: DragState['mode']) => (event: ReactPointerEvent) => {
                            if (!onBeginDrag || track.type !== 'text') return
                            event.preventDefault()
                            event.stopPropagation()
                            onBeginDrag({
                              trackId: track.id,
                              itemId: item.id,
                              mode,
                              clientX: event.clientX,
                              start: item.start,
                              end: item.end,
                              isTextTrack: true
                            })
                          }

                                    return (
                                      <div
                                        key={item.id}
                                        // don't start a move-drag when pressing the item body; only start drag from handles
                                        // onPointerDown={isTextTrack ? beginDrag('move') : undefined}
                                        onPointerUp={
                                          isTextTrack
                                            ? (e) => {
                                                // if this item is currently being actively dragged, don't treat this as a click/select
                                                if (!draggingItem || draggingItem.trackId !== track.id || draggingItem.itemId !== item.id) {
                                                  if (onSelect) onSelect(track.id, item.id)
                                                  if (onSeek) onSeek(item.start)
                                                }
                                              }
                                            : undefined
                                        }
                              data-role={isTextTrack ? 'track-item' : undefined}
                              style={{
                                position: 'absolute',
                                left: startPx,
                                width: Math.max(4, widthPx),
                                top: 4,
                                bottom: 4,
                                borderRadius: 8,
                                        background: isTextTrack ? 'rgba(99, 102, 241, 0.8)' : item.color,
                                        boxShadow: isCurrentDragging
                                          ? '0 0 0 2px rgba(56, 189, 248, 0.9)'
                                          : '0 8px 18px rgba(15, 23, 42, 0.45)',
                                        outline: isSelected ? '2px solid rgba(99, 102, 241, 0.95)' : undefined,
                                        transform: isSelected ? 'translateY(-1px)' : undefined,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isTextTrack ? 'flex-start' : 'center',
                                fontSize: isTextTrack ? 12 : 11,
                                fontWeight: isTextTrack ? 500 : 600,
                                color: isTextTrack ? '#ede9fe' : '#0f172a',
                                textTransform: isTextTrack ? 'none' : 'uppercase',
                                letterSpacing: isTextTrack ? 0 : 0.4,
                                padding: isTextTrack ? '0 18px' : undefined,
                                overflow: 'hidden',
                                whiteSpace: isTextTrack ? 'nowrap' : undefined,
                                textOverflow: isTextTrack ? 'ellipsis' : undefined,
                                cursor: isTextTrack ? (isCurrentDragging ? 'grabbing' : 'pointer') : 'default',
                                userSelect: 'none',
                                zIndex: isTextTrack ? 2 : 1,
                              }}
                            >
                              {isTextTrack && onBeginDrag ? (
                                <>
                                  <span
                                    onPointerDown={beginDrag('start')}
                                    data-role="track-handle"
                                    style={{
                                      position: 'absolute',
                                      left: 0,
                                      top: 0,
                                      bottom: 0,
                                      width: 8,
                                      cursor: 'ew-resize',
                                      background: 'rgba(15, 23, 42, 0.3)',
                                    }}
                                  />
                                  <span style={{ flex: 1 }}>{item.label}</span>
                                  <span
                                    onPointerDown={beginDrag('end')}
                                    data-role="track-handle"
                                    style={{
                                      position: 'absolute',
                                      right: 0,
                                      top: 0,
                                      bottom: 0,
                                      width: 8,
                                      cursor: 'ew-resize',
                                      background: 'rgba(15, 23, 42, 0.3)',
                                    }}
                                  />
                                </>
                              ) : (
                                item.label
                              )}
                            </div>
                          )
                        })}
                  </div>
                )
              })}
            </div>

            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: playheadLeft,
                width: 2,
                background: 'rgba(56, 189, 248, 0.95)',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.6)',
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

type RemotionTimelineProps = {
  tracks: TimelineTrack[]
  duration: number
  currentTime: number
  fps?: number
  zoom: number
  onSeek: (seconds: number) => void
  onUpdateTrackItem?: (params: {
    trackId: string
    itemId: string
    start?: number
    end?: number
  }) => void
  onDeleteTrackItem?: (params: { trackId: string; itemId: string }) => void
}

type DragState = {
  trackId: string
  itemId: string
  mode: 'move' | 'start' | 'end'
  startClientX: number
  initialStart: number
  initialEnd: number
}

export function RemotionTimeline({ tracks, duration, currentTime, fps = 30, zoom, onSeek, onUpdateTrackItem, onDeleteTrackItem }: RemotionTimelineProps) {
  const [selected, setSelected] = useState<{ trackId: string; itemId: string } | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected && onDeleteTrackItem) {
        onDeleteTrackItem(selected)
        setSelected(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, onDeleteTrackItem])
  const playerRef = useRef<PlayerRef>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailCacheRef = useRef(new Map<string, string[]>())
  const [thumbnailMap, setThumbnailMap] = useState<Record<string, string[]>>({})
  const [containerWidth, setContainerWidth] = useState(1024)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [draggingItem, setDraggingItem] = useState<{ trackId: string; itemId: string } | null>(null)
  const isScrubbingRef = useRef(false)

  const safeFps = Math.max(1, Math.round(fps))
  const paddingWidth = LABEL_WIDTH + PADDING_X * 2

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      if (width > 0) {
        setContainerWidth(width)
      }
    }

    update()

    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      const observer = new ResizeObserver(() => update())
      observer.observe(containerRef.current)
      return () => observer.disconnect()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }

    return undefined
  }, [])

  const availableTimelineWidthRaw = Math.max(containerWidth - paddingWidth, 0)
  const basePxPerSecondRaw = duration > 0 ? availableTimelineWidthRaw / duration : availableTimelineWidthRaw
  const pxPerSecond = useMemo(() => {
    const zoomFactor = Math.max(0.4, Math.min(zoom / 40, 1))
    const base = basePxPerSecondRaw > 0 ? basePxPerSecondRaw : BASE_PIXEL_PER_SECOND * 0.5
    return Math.max(base * zoomFactor, 0.5)
  }, [basePxPerSecondRaw, zoom])

  const timelineWidth = duration > 0 ? pxPerSecond * duration : availableTimelineWidthRaw
  const totalRowsHeight = tracks.length > 0 ? tracks.length * ROW_HEIGHT + Math.max(0, tracks.length - 1) * ROW_GAP : ROW_HEIGHT
  const totalHeight = MARKER_HEIGHT + totalRowsHeight + PADDING_Y * 2
  const totalWidth = LABEL_WIDTH + timelineWidth + PADDING_X * 2
  const renderedWidth = Math.min(totalWidth, containerWidth)
  const scaleRatio = totalWidth > 0 ? renderedWidth / totalWidth : 1
  const durationInFrames = Math.max(1, Math.round(Math.max(0, duration) * safeFps))

  const handleBeginDrag = useCallback(
    ({ trackId, itemId, mode, clientX, start, end }: {
      trackId: string
      itemId: string
      mode: DragState['mode']
      clientX: number
      start: number
      end: number
    }) => {
      if (!onUpdateTrackItem) return
      setDragState({
        trackId,
        itemId,
        mode,
        startClientX: clientX,
        initialStart: start,
        initialEnd: end,
      })
      setDraggingItem({ trackId, itemId })
    },
    [onUpdateTrackItem],
  )

  useEffect(() => {
    let cancelled = false

    const loadThumbnails = async () => {
      const trackPromises = tracks.map(async (track) => {
        if (!(track.type === 'image' && track.assetSrc && track.thumbnails && track.thumbnails.length)) {
          return [track.id, undefined] as const
        }

        const cacheKey = `${track.assetSrc}|${track.thumbnails
          .map((thumb) => `${thumb.time}-${thumb.duration ?? ''}`)
          .join(',')}`
        const cached = thumbnailCacheRef.current.get(cacheKey)
        if (cached) {
          return [track.id, cached] as const
        }

        try {
          const images = await generateVideoThumbnails(track.assetSrc, track.thumbnails)
          if (!cancelled && images.length) {
            thumbnailCacheRef.current.set(cacheKey, images)
          }
          return [track.id, images] as const
        } catch (error) {
          return [track.id, []] as const
        }
      })

      const entries = await Promise.all(trackPromises)
      if (cancelled) return

      setThumbnailMap((prev) => {
        const next: Record<string, string[]> = {}
        for (const [trackId, images] of entries) {
          if (images && images.length) {
            next[trackId] = images as string[]
          }
        }
        return next
      })
    }

    loadThumbnails()

    return () => {
      cancelled = true
    }
  }, [tracks])

  useEffect(() => {
    if (!playerRef.current) return
    const frame = Math.min(durationInFrames - 1, Math.max(0, Math.round(currentTime * safeFps)))
    playerRef.current.seekTo(frame)
  }, [currentTime, durationInFrames, safeFps])

  const handleSeek = useCallback(
    (clientX: number) => {
      if (!containerRef.current || duration <= 0) return
      const rect = containerRef.current.getBoundingClientRect()
      const offsetX = clientX - rect.left
      const scaledOffset = scaleRatio > 0 ? offsetX / scaleRatio : offsetX
      const timelineX = scaledOffset - (LABEL_WIDTH + PADDING_X)
      const seconds = timelineX / pxPerSecond
      const clamped = Math.min(duration, Math.max(0, seconds))
      onSeek(clamped)
    },
    [duration, onSeek, pxPerSecond, scaleRatio],
  )

  useEffect(() => {
    if (!dragState || !onUpdateTrackItem) return

    const handlePointerMove = (event: PointerEvent) => {
      const deltaPx = (event.clientX - dragState.startClientX) / (scaleRatio || 1)
      const deltaSeconds = deltaPx / pxPerSecond
      const segmentLength = dragState.initialEnd - dragState.initialStart
      const minSegment = 0.1
      const totalDuration = duration > 0 ? duration : dragState.initialEnd

      let nextStart = dragState.initialStart
      let nextEnd = dragState.initialEnd

      if (dragState.mode === 'move') {
        nextStart = Math.max(0, Math.min(dragState.initialStart + deltaSeconds, totalDuration - segmentLength))
        nextEnd = Math.min(totalDuration, nextStart + segmentLength)
      } else if (dragState.mode === 'start') {
        nextStart = Math.max(0, Math.min(dragState.initialStart + deltaSeconds, dragState.initialEnd - minSegment))
        nextEnd = dragState.initialEnd
      } else if (dragState.mode === 'end') {
        nextEnd = Math.min(totalDuration, Math.max(dragState.initialEnd + deltaSeconds, dragState.initialStart + minSegment))
        nextStart = dragState.initialStart
      }

      onUpdateTrackItem({ trackId: dragState.trackId, itemId: dragState.itemId, start: nextStart, end: nextEnd })
    }

    const handlePointerUp = () => {
      setDragState(null)
      setDraggingItem(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp, { once: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [dragState, onUpdateTrackItem, pxPerSecond, scaleRatio, duration])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isScrubbingRef.current) return
      handleSeek(event.clientX)
    }

    const handlePointerUp = () => {
      isScrubbingRef.current = false
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [handleSeek])

  const handlePointerDownCapture = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return
      const target = event.target as HTMLElement
      const role = target.dataset.role
      if (role === 'track-item' || role === 'track-handle') {
        return
      }
      isScrubbingRef.current = true
      handleSeek(event.clientX)
    },
    [handleSeek],
  )

  return (
    <div ref={containerRef} className="relative rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 w-full">
      <div
        className="relative mx-auto"
        style={{ width: renderedWidth }}
        onPointerDownCapture={handlePointerDownCapture}
      >
        <Player
          ref={playerRef}
          component={TimelineComposition}
          inputProps={{
            tracks,
            durationInSeconds: duration,
            pxPerSecond,
            thumbnailMap,
            draggingItem,
            onBeginDrag: onUpdateTrackItem ? handleBeginDrag : undefined,
            onSeek,
            onSelect: (trackId: string, itemId: string) => setSelected({ trackId, itemId }),
            selected,
          }}
          durationInFrames={durationInFrames}
          compositionWidth={Math.ceil(totalWidth)}
          compositionHeight={totalHeight}
          fps={safeFps}
          controls={false}
          loop={false}
          autoPlay={false}
          showVolumeControls={false}
          clickToPlay={false}
          allowFullscreen={false}
          doubleClickToFullscreen={false}
          style={{ width: renderedWidth, height: totalHeight }}
          className="select-none"
        />
      </div>
    </div>
  )
}
