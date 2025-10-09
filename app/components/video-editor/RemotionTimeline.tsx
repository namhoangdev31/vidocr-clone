'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
}

const TimelineComposition: React.FC<TimelineCompositionProps> = ({ tracks, durationInSeconds, pxPerSecond }) => {
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
                      background: 'rgba(30, 41, 59, 0.55)',
                      border: '1px solid rgba(148, 163, 184, 0.18)',
                      overflow: 'hidden',
                    }}
                  >
                    {track.items.map((item) => {
                      const startPx = interpolate(item.start, [0, durationInSeconds || 1], [0, timelineWidth])
                      const widthPx = interpolate(
                        item.end - item.start,
                        [0, durationInSeconds || 1],
                        [0, timelineWidth],
                        { extrapolateRight: 'clamp' },
                      )
                      return (
                        <div
                          key={item.id}
                          style={{
                            position: 'absolute',
                            left: startPx,
                            width: Math.max(4, widthPx),
                            top: 4,
                            bottom: 4,
                            borderRadius: 8,
                            background: item.color,
                            boxShadow: '0 8px 18px rgba(15, 23, 42, 0.45)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#0f172a',
                            textTransform: 'uppercase',
                            letterSpacing: 0.4,
                          }}
                        >
                          {item.label}
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
}

export function RemotionTimeline({ tracks, duration, currentTime, fps = 30, zoom, onSeek }: RemotionTimelineProps) {
  const playerRef = useRef<PlayerRef>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(1024)

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

  const availableTimelineWidth = Math.max(240, containerWidth - paddingWidth)
  const basePxPerSecond = duration > 0 ? availableTimelineWidth / duration : availableTimelineWidth
  const pxPerSecond = useMemo(() => {
    const zoomFactor = Math.max(0.5, Math.min(zoom / 40, 1))
    return basePxPerSecond * zoomFactor
  }, [basePxPerSecond, zoom])

  const timelineWidth = duration > 0 ? pxPerSecond * duration : availableTimelineWidth
  const totalRowsHeight = tracks.length > 0 ? tracks.length * ROW_HEIGHT + Math.max(0, tracks.length - 1) * ROW_GAP : ROW_HEIGHT
  const totalHeight = MARKER_HEIGHT + totalRowsHeight + PADDING_Y * 2
  const totalWidth = LABEL_WIDTH + timelineWidth + PADDING_X * 2
  const durationInFrames = Math.max(1, Math.round(Math.max(0, duration) * safeFps))

  useEffect(() => {
    if (!playerRef.current) return
    const frame = Math.min(durationInFrames - 1, Math.max(0, Math.round(currentTime * safeFps)))
    playerRef.current.seekTo(frame)
  }, [currentTime, durationInFrames, safeFps])

  const handleSeek = useCallback(
    (clientX: number) => {
      if (!overlayRef.current || duration <= 0) return
      const rect = overlayRef.current.getBoundingClientRect()
      const offsetX = clientX - rect.left
      const timelineX = offsetX - (LABEL_WIDTH + PADDING_X)
      const seconds = timelineX / pxPerSecond
      const clamped = Math.min(duration, Math.max(0, seconds))
      onSeek(clamped)
    },
    [duration, onSeek, pxPerSecond],
  )

  return (
    <div ref={containerRef} className="relative rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 w-full">
      <div className="relative mx-auto" style={{ width: Math.min(totalWidth, containerWidth) }}>
        <Player
          ref={playerRef}
          component={TimelineComposition}
          inputProps={{ tracks, durationInSeconds: duration, pxPerSecond }}
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
          style={{ width: Math.min(totalWidth, containerWidth), height: totalHeight }}
          className="select-none"
        />
        <div
          ref={overlayRef}
          className="absolute inset-0 cursor-pointer"
          onPointerDown={(event) => {
            event.preventDefault()
            overlayRef.current?.setPointerCapture(event.pointerId)
            handleSeek(event.clientX)
          }}
          onPointerMove={(event) => {
            if (event.buttons & 1) {
              handleSeek(event.clientX)
            }
          }}
          onPointerUp={(event) => {
            overlayRef.current?.releasePointerCapture(event.pointerId)
          }}
        />
      </div>
    </div>
  )
}
