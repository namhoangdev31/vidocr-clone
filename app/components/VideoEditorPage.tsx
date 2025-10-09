'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
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

export default function VideoEditorPage() {
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null)
  const [timelineDuration, setTimelineDuration] = useState(60)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [tracks, setTracks] = useState<TimelineTrack[]>(() => cloneDefaultTracks())

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
  }

  useEffect(() => {
    const textTrackItems = DEFAULT_TRANSCRIPTS
      .map((entry, index) => ({
        id: `transcript-${index}`,
        label: entry.primaryText.length > 42 ? `${entry.primaryText.slice(0, 39)}…` : entry.primaryText,
        start: entry.start,
        end: entry.end,
        color: '#6366f1',
      }))
      .sort((a, b) => a.start - b.start)

    if (!videoSource || !videoSource.url) {
      setTracks((prev) =>
        prev.map((track) =>
          track.type === 'text'
            ? {
                ...track,
                items: textTrackItems,
              }
            : track,
        ),
      )
      return
    }

    const durationSeconds = videoSource.duration ?? timelineDuration
    const fps = videoSource.fps ?? 30
    const totalDuration = Math.max(durationSeconds, 1)
    const desiredSegmentSeconds = 2
    const thumbnailCount = Math.max(12, Math.min(48, Math.ceil(totalDuration / desiredSegmentSeconds)))
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

    setTracks((prev) =>
      prev.map((track) => {
        if (track.type === 'text') {
          return {
            ...track,
            items: textTrackItems,
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
      }),
    )
  }, [videoSource, timelineDuration])

  return (
    <div className="h-full">
      <VideoEditor
        videoSource={videoSource}
        toolbarItems={toolbarItems}
        headerInfo={headerInfo}
        tracks={tracks}
        transcripts={DEFAULT_TRANSCRIPTS}
        timelineDuration={timelineDuration}
        onUpload={handleUpload}
        onRemoveVideo={handleRemoveVideo}
        onDurationChange={(duration) => {
          setTimelineDuration(Math.round(duration))
          setVideoSource((prev) => (prev ? { ...prev, duration } : prev))
        }}
      />
    </div>
  )
}
