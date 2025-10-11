'use client'

import { TranscriptEntry } from './types'

type TranscriptPanelProps = {
  entries: TranscriptEntry[]
  currentTime: number
  onSeek: (seconds: number) => void
  height?: number | null
}

const formatRange = (start: number, end: number) => {
  const toLabel = (value: number) => {
    const minutes = Math.floor(value / 60)
    const seconds = Math.floor(value % 60)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${toLabel(start)} - ${toLabel(end)}`
}

export function TranscriptPanel({ entries, currentTime, onSeek, height }: TranscriptPanelProps) {
  const style: React.CSSProperties | undefined = height ? { height: `${height}px` } : undefined

  return (
    // Stretch to parent's height so it matches center column; inner list scrolls when content overflows
    <aside style={style} className="w-80 border-l border-slate-800 bg-slate-950/80 flex flex-col">
      <div className="px-5 py-4 border-b border-slate-800 flex-shrink-0">
        <h3 className="text-sm font-semibold text-white">Transcript ({entries.length})</h3>
        <p className="text-xs text-slate-400 mt-1">Click a caption to seek the timeline.</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 px-4 py-4 min-h-0">
        {entries.map((entry) => {
          const isActive = currentTime >= entry.start && currentTime <= entry.end
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSeek(entry.start)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                isActive
                  ? 'border-sky-500 bg-sky-500/10 text-sky-100'
                  : 'border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="text-xs uppercase tracking-wide text-slate-400">
                {formatRange(entry.start, entry.end)}
              </span>
              <p className="mt-2 text-sm font-medium leading-relaxed">{entry.primaryText}</p>
              {entry.secondaryText && (
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{entry.secondaryText}</p>
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
