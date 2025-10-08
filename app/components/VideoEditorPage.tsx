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
    id: 'video-track',
    label: 'Video',
    type: 'video',
    items: [],
  },
  {
    id: 'music-track',
    label: 'Audio',
    type: 'audio',
    resourceName: 'BGM.mp3',
    items: [
      { id: 'music', label: 'BGM.mp3', start: 0, end: 60, color: '#10b981' },
      { id: 'voice', label: 'Voice.wav', start: 12, end: 48, color: '#22d3ee' },
      { id: 'sfx', label: 'SFX.mp3', start: 40, end: 60, color: '#14b8a6' },
    ],
  },
  {
    id: 'image-track',
    label: 'Image',
    type: 'image',
    resourceName: 'Logo.png',
    items: [
      { id: 'logo', label: 'Logo', start: 0, end: 18, color: '#f97316' },
      { id: 'chart', label: 'Chart.png', start: 26, end: 42, color: '#fb7185' },
    ],
  },
  {
    id: 'text-track',
    label: 'Text',
    type: 'text',
    items: [
      { id: 'txt1', label: 'Text', start: 0, end: 4, color: '#facc15' },
      { id: 'txt2', label: 'Text', start: 6, end: 10, color: '#facc15' },
      { id: 'txt3', label: 'Text', start: 12, end: 16, color: '#facc15' },
      { id: 'txt4', label: 'Text', start: 18, end: 22, color: '#facc15' },
    ],
  },
  {
    id: 'effect-track',
    label: 'Effect',
    type: 'effect',
    items: [
      { id: 'fade', label: 'Fade', start: 0, end: 6, color: '#c084fc' },
      { id: 'zoom', label: 'Zoom', start: 16, end: 24, color: '#a855f7' },
      { id: 'filter', label: 'Filter', start: 32, end: 40, color: '#d946ef' },
    ],
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
        track.type === 'video'
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
    if (!videoSource || !videoSource.url) {
      return
    }

    const durationSeconds = videoSource.duration ?? timelineDuration
    const fps = videoSource.fps ?? 30
    const totalDuration = Math.max(durationSeconds, 1)
    const thumbnailCount = Math.min(12, Math.max(6, Math.ceil(totalDuration / 8)))
    const segment = totalDuration / thumbnailCount
    const thumbnails = Array.from({ length: thumbnailCount }, (_, index) => ({
      id: `thumb-${index}`,
      time: Math.min(totalDuration, index * segment),
      duration: segment,
    }))

    setTracks((prev) =>
      prev.map((track) => {
        if (track.type !== 'video') return track
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
