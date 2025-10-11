'use client'

import { useState } from 'react'
import { TranscriptEntry } from './types'

type TranscriptPanelProps = {
  entries: TranscriptEntry[]
  currentTime: number
  onSeek: (seconds: number) => void
  height?: number | null
  onApplyTranscripts?: (entries: TranscriptEntry[]) => void
  onUpdateEntry?: (entryId: string, changes: { primaryText?: string }) => void
}

const formatRange = (start: number, end: number) => {
  const toLabel = (value: number) => {
    const minutes = Math.floor(value / 60)
    const seconds = Math.floor(value % 60)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${toLabel(start)} - ${toLabel(end)}`
}

export function TranscriptPanel({ entries, currentTime, onSeek, height, onApplyTranscripts, onUpdateEntry }: TranscriptPanelProps) {
  const style: React.CSSProperties | undefined = height ? { height: `${height}px` } : undefined
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftPrimary, setDraftPrimary] = useState<string>('')
  

  const beginEdit = (entry: TranscriptEntry) => {
    setEditingId(entry.id)
  setDraftPrimary(entry.primaryText)
  }

  const cancelEdit = () => {
    setEditingId(null)
  setDraftPrimary('')
  }

  const saveEdit = (entryId: string) => {
    if (typeof onUpdateEntry === 'function') {
      onUpdateEntry(entryId, { primaryText: draftPrimary })
    }
    cancelEdit()
  }

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
            <div
              key={entry.id}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                isActive
                  ? 'border-sky-500 bg-sky-500/10 text-sky-100'
                  : 'border-slate-800 bg-slate-900/60 text-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <button type="button" onClick={() => onSeek(entry.start)} className="text-left flex-1">
                  <span className="text-xs uppercase tracking-wide text-slate-400">
                    {formatRange(entry.start, entry.end)}
                  </span>
                  {editingId === entry.id ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-md p-2 text-sm text-slate-100 resize-none"
                        rows={2}
                        value={draftPrimary}
                        onChange={(e) => setDraftPrimary(e.target.value)}
                        placeholder="Primary text"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="mt-2 text-sm font-medium leading-relaxed">{entry.primaryText}</p>
                    </>
                  )}
                </button>

                {editingId === entry.id ? (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(entry.id)}
                      className="px-3 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-white/90 text-xs"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => beginEdit(entry)}
                      className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-white/90 text-xs"
                    >
                      Sửa
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
