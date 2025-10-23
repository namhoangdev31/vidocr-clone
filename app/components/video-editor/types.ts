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

export type AudioLayer = {
  id: string;
  trackId: string;
  label: string;
  volume: number; // 0-1
  muted: boolean;
  items: TimelineItem[];
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
  audioLayers?: AudioLayer[]; // For multi-track audio
}

export type TranscriptEntry = {
  id: string
  start: number
  end: number
  primaryText: string
  secondaryText?: string
}

export type FrameSettings = {
  enabled: boolean;
  style: 'border' | 'rounded' | 'shadow';
  color: string;
  width: number;
}

export type LogoSettings = {
  enabled: boolean;
  url: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size: number;
  opacity: number;
}

export type VideoEditorState = {
  tracks: TimelineTrack[];
  frameSettings?: FrameSettings;
  logoSettings?: LogoSettings;
  audioLayers?: AudioLayer[];
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
  onHeaderAction?: (actionId: string) => void
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
