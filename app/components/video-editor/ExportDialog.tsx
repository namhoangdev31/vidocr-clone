'use client'

import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { VideoSource } from './types'

export type ExportSettings = {
  title: string
  resolution: 'Auto' | '2160p' | '1440p' | '1080p' | '720p' | '480p'
  framerate: 'Auto' | '24' | '25' | '30' | '50' | '60'
  codec: 'H.264' | 'H.265'
  bitrate: 'Thấp' | 'Trung Bình' | 'Cao'
  format: 'MP4' | 'MKV' | 'MOV'
}

export function ExportDialog({
  open,
  onClose,
  video,
  duration,
  onDownloadBackup,
  onDownloadSrt,
  onSave,
  onPublish,
  isRendering,
  progress,
  statusText,
  onCancelRender,
  outputUrl,
  onDownloadOutput,
}: {
  open: boolean
  onClose: () => void
  video: VideoSource | null
  duration?: number
  onDownloadBackup?: () => void
  onDownloadSrt?: () => void
  onSave?: (settings: ExportSettings) => void
  onPublish?: (settings: ExportSettings) => void
  isRendering?: boolean
  progress?: number
  statusText?: string
  onCancelRender?: () => void
  outputUrl?: string | null
  onDownloadOutput?: () => void
}) {
  const defaultTitle = useMemo(() => {
    if (!video?.name) return 'export.mp4'
    // ensure extension
    return video.name.match(/\.(mp4|mkv|mov)$/i) ? video.name : `${video.name}.mp4`
  }, [video?.name])

  const [settings, setSettings] = useState<ExportSettings>({
    title: defaultTitle,
    resolution: 'Auto',
    framerate: 'Auto',
    codec: 'H.264',
    bitrate: 'Trung Bình',
    format: 'MP4',
  })

  useEffect(() => {
    setSettings((s) => ({ ...s, title: defaultTitle }))
  }, [defaultTitle])

  const formatTime = (seconds?: number) => {
    const s = Math.max(0, Math.floor(((seconds || 0) * 100)))
    const hh = Math.floor(s / (3600 * 100))
    const mm = Math.floor((s % (3600 * 100)) / (60 * 100))
    const ss = Math.floor((s % (60 * 100)) / 100)
    const hs = s % 100
    return `${hh}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}.${String(hs).padStart(2, '0')}`
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-[min(960px,96vw)] max-h-[90vh] overflow-hidden rounded-xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
          <div className="font-medium">Xuất bản</div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6 p-6 overflow-auto">
          {/* Preview */}
          <div className="bg-slate-800/60 rounded-lg aspect-[9/16] md:aspect-[9/16] overflow-hidden flex items-center justify-center">
            {video?.url ? (
              <video
                src={video.url}
                className="w-full h-full object-cover"
                muted
                controls={false}
                autoPlay={false}
              />
            ) : (
              <div className="text-slate-400 text-sm">Không có video</div>
            )}
          </div>

          {/* Settings form */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 content-start ${isRendering ? 'opacity-70 pointer-events-none' : ''}` }>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Tiêu đề</span>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm outline-none focus:ring-2 ring-sky-500"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Độ phân giải</span>
              <select
                value={settings.resolution}
                onChange={(e) => setSettings({ ...settings, resolution: e.target.value as ExportSettings['resolution'] })}
                className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm"
              >
                {['Auto','2160p','1440p','1080p','720p','480p'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Tốc độ khung hình</span>
              <select
                value={settings.framerate}
                onChange={(e) => setSettings({ ...settings, framerate: e.target.value as ExportSettings['framerate'] })}
                className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm"
              >
                {['Auto','24','25','30','50','60'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Mã hóa</span>
              <select
                value={settings.codec}
                onChange={(e) => setSettings({ ...settings, codec: e.target.value as ExportSettings['codec'] })}
                className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm"
              >
                {['H.264','H.265'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Tốc độ Bit</span>
              <select
                value={settings.bitrate}
                onChange={(e) => setSettings({ ...settings, bitrate: e.target.value as ExportSettings['bitrate'] })}
                className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm"
              >
                {['Thấp','Trung Bình','Cao'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Định dạng</span>
              <select
                value={settings.format}
                onChange={(e) => setSettings({ ...settings, format: e.target.value as ExportSettings['format'] })}
                className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm"
              >
                {['MP4','MKV','MOV'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>

            {/* Suggestions */}
            <div className="sm:col-span-2 mt-2 grid grid-cols-1 gap-3">
              <div className="text-xs text-slate-400">Đề xuất tiêu đề:</div>
              <div className="text-sm text-slate-300 line-clamp-2">
                Sương Khói Mờ Ảo Trong Biệt Thự: Hành Trình Khám Phá Nghệ Thuật
              </div>
              <div className="text-xs text-slate-400">Đề xuất nội dung:</div>
              <div className="text-sm text-slate-400">
                Video này đưa bạn vào một không gian bí ẩn và tuyệt đẹp, nơi sương khói mờ ảo che khuất thế ngoại tình...
              </div>
            </div>
          </div>
        </div>

        {/* Progress area */}
        {isRendering && (
          <div className="px-6">
            <div className="mb-2 text-sm text-slate-300">Đang xuất video… {Math.round((progress ?? 0) * 100)}%</div>
            <div className="h-2 w-full bg-slate-800 rounded overflow-hidden">
              <div className="h-full bg-sky-500" style={{ width: `${Math.round((progress ?? 0) * 100)}%` }} />
            </div>
            {statusText && <div className="mt-2 text-xs text-slate-400">{statusText}</div>}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1">
                <span className="i-lucide-layout-grid" aria-hidden />
                {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDownloadBackup}
                className="rounded-md bg-emerald-700 hover:bg-emerald-600 text-white text-sm px-3 py-1.5 disabled:opacity-60"
                disabled={!onDownloadBackup}
              >
                Tải backup
              </button>
              <button
                type="button"
                onClick={onDownloadSrt}
                className="rounded-md bg-emerald-700 hover:bg-emerald-600 text-white text-sm px-3 py-1.5 disabled:opacity-60"
                disabled={!onDownloadSrt}
              >
                Tải .SRT
              </button>
              {outputUrl && (
                <button
                  type="button"
                  onClick={onDownloadOutput}
                  className="rounded-md bg-emerald-700 hover:bg-emerald-600 text-white text-sm px-3 py-1.5"
                >
                  Tải video
                </button>
              )}
              <button
                type="button"
                onClick={() => onSave?.(settings)}
                className="rounded-md bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-1.5 disabled:opacity-60"
                disabled={!!isRendering}
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => onPublish?.(settings)}
                className="rounded-md bg-sky-600 hover:bg-sky-500 text-white text-sm px-3 py-1.5 disabled:opacity-60"
                disabled={!!isRendering}
              >
                {isRendering ? 'Đang xuất…' : 'Xuất bản'}
              </button>
              {isRendering && (
                <button
                  type="button"
                  onClick={onCancelRender}
                  className="rounded-md bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-1.5"
                >
                  Hủy render
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm px-3 py-1.5"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
