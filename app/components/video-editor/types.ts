import { ReactNode } from 'react'

export type VideoSource = {
  url: string
  name: string
  size?: number
  duration?: number
  fps?: number
}

export type ToolbarItem = {
  id: string
  icon: ReactNode
  label: string
  active?: boolean
}

export type HeaderAction = {
  id: string
  label: string
  variant?: 'primary' | 'ghost'
  disabled?: boolean
}

export type HeaderInfo = {
  fileName?: string
  meta?: string
  actions?: HeaderAction[]
  avatars?: string[]
}

export type TimelineItem = {
  id: string
  label: string
  start: number
  end: number
  color: string
  type?: 'clip' | 'effect' | 'text'
  meta?: Record<string, any>
}

export type TimelineThumbnail = {
  id: string
  time: number
  duration: number
}

export type TimelineTrack = {
  id: string
  label: string
  type: 'video' | 'audio' | 'image' | 'text' | 'effect'
  items: TimelineItem[]
  accentColor?: string
  resourceName?: string
  thumbnails?: TimelineThumbnail[]
  assetSrc?: string
  fps?: number
}

export type TranscriptEntry = {
  id: string
  start: number
  end: number
  primaryText: string
  secondaryText?: string
}

export type VideoEditorProps = {
  videoSource: VideoSource | null
  toolbarItems: ToolbarItem[]
  headerInfo: HeaderInfo
  tracks: TimelineTrack[]
  transcripts: TranscriptEntry[]
  timelineDuration: number
  onUpload: (file: File) => void
  onRemoveVideo?: () => void
  onDurationChange?: (duration: number) => void
  onSeek?: (seconds: number) => void
  onUpdateTrackItem?: (params: {
    trackId: string
    itemId: string
    start?: number
    end?: number
  }) => void
  onUpdateTrackItemMeta?: (params: { trackId: string; itemId: string; meta: Record<string, any> }) => void
  onDeleteTrackItem?: (params: { trackId: string; itemId: string }) => void
  onApplyTranscripts?: (entries: TranscriptEntry[]) => void
}
