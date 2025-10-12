 'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  className?: string
  selected?: { trackId: string; itemId: string } | null
  selectedMeta?: Record<string, any> | undefined
  onApplyToSelected?: (meta: Record<string, any>) => void
}

export function VideoSmallTool({ className = '', selected = null, selectedMeta, onApplyToSelected }: Props) {
  const [fontSize, setFontSize] = useState<number>(72)
  const [angle, setAngle] = useState<number>(0)
  const [selectedPresetId, setSelectedPresetId] = useState<string>('none')
  const debounceRef = useRef<number | undefined>(undefined)
  // default values for the tool controls
  const DEFAULT_FONT_SIZE = 72
  const DEFAULT_ANGLE = 0
  // When we programmatically set control values due to selection change, we want to
  // suppress the auto-apply effect once so we don't immediately apply those values.
  const suppressNextApplyRef = useRef(false)

  // Helper to apply (debounced) only when user changes controls
  const scheduleApply = (delay = 120) => {
    if (!selected || typeof onApplyToSelected !== 'function') return
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      onApplyToSelected({
        preset: selectedPreset.id,
        fontSize,
        angle,
        style: selectedPreset.style || {},
        className: selectedPreset.className,
      })
    }, delay)
  }

  const presets = [
    { id: 'none', label: 'None', className: 'bg-slate-800/80 text-slate-200' },
    { id: 'white', label: 'Text', className: 'bg-white text-black font-semibold' },
    { id: 'stroke', label: 'Text', className: 'bg-slate-800 text-white', style: { textShadow: '-2px -2px 0 #000, 2px 2px 0 #000' } },
    { id: 'white-stroke', label: 'Text', className: 'bg-white text-black', style: { textShadow: '-2px -2px 0 #333, 2px 2px 0 #333' } },
    { id: 'purple', label: 'Text', className: 'bg-violet-600 text-white' },
    { id: 'yellow', label: 'Text', className: 'bg-yellow-300 text-black' },
    { id: 'blue', label: 'Text', className: 'bg-sky-600 text-white' },
    { id: 'black-white', label: 'Text', className: 'bg-black text-white' },
    { id: 'green', label: 'Text', className: 'bg-black text-emerald-400' },
    { id: 'neon-pink', label: 'Text', className: 'bg-slate-800 text-pink-500', style: { textShadow: '0 0 6px rgba(255,20,147,0.65)' } },
    { id: 'neon-green', label: 'Text', className: 'bg-slate-800 text-emerald-400', style: { textShadow: '0 0 6px rgba(16,185,129,0.5)' } },
    { id: 'orange', label: 'Text', className: 'bg-slate-800 text-orange-400', style: { textShadow: '0 2px 0 rgba(0,0,0,0.6)' } },
  ]

  const selectedPreset = useMemo(() => presets.find((p) => p.id === selectedPresetId) || presets[0], [selectedPresetId])

  // When selection or selectedMeta changes, initialize or reset internal control state
  useEffect(() => {
    if (!selected) {
      // no selection: reset to defaults
      setFontSize(DEFAULT_FONT_SIZE)
      setAngle(DEFAULT_ANGLE)
      setSelectedPresetId('none')
      // suppress any auto-apply that might otherwise fire
      suppressNextApplyRef.current = true
      return
    }

    // If selectedMeta is provided, populate controls from it; otherwise reset
    // expected meta shape: { preset?: string, fontSize?: number, angle?: number, style?: object, className?: string }
    if (selectedMeta && typeof selectedMeta === 'object') {
      setSelectedPresetId(typeof selectedMeta.preset === 'string' ? selectedMeta.preset : 'none')
      setFontSize(typeof selectedMeta.fontSize === 'number' ? selectedMeta.fontSize : DEFAULT_FONT_SIZE)
      setAngle(typeof selectedMeta.angle === 'number' ? selectedMeta.angle : DEFAULT_ANGLE)
      // prevent the auto-apply effect from firing for this programmatic initialization
      suppressNextApplyRef.current = true
    } else {
      setSelectedPresetId('none')
      setFontSize(DEFAULT_FONT_SIZE)
      setAngle(DEFAULT_ANGLE)
      // still suppress apply caused by initialization
      suppressNextApplyRef.current = true
    }
  }, [selected, selectedMeta])
  
  // Clear any pending apply when selection changes
  useEffect(() => {
    window.clearTimeout(debounceRef.current)
  }, [selected])

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center gap-6 px-2">
        <label className="flex items-center gap-4 text-sm text-slate-200 w-full">
          <span className="whitespace-nowrap">Cỡ chữ:</span>
          <input
            type="range"
            min={8}
            max={500}
            value={fontSize}
            onChange={(e) => {
              setFontSize(Number(e.target.value))
              scheduleApply()
            }}
            className="flex-1"
          />
          <div className="ml-3 px-3 py-1 rounded-md bg-slate-800 text-white text-sm">{fontSize}</div>
        </label>

        <label className="flex items-center gap-4 text-sm text-slate-200 w-full">
          <span className="whitespace-nowrap">Góc chữ:</span>
          <input
            type="range"
            min={-360}
            max={360}
            value={angle}
            onChange={(e) => {
              setAngle(Number(e.target.value))
              scheduleApply()
            }}
            className="flex-1"
          />
          <div className="ml-3 px-3 py-1 rounded-md bg-slate-800 text-white text-sm">{angle}</div>
        </label>
      </div>

      <div className="px-2">
        <div className="flex flex-wrap gap-4">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={!selected}
              className={`px-4 py-2 rounded-md shadow-sm ${p.className} ${selected ? '' : 'opacity-60 cursor-not-allowed'} ${selectedPresetId === p.id ? 'ring-2 ring-sky-400' : ''}`}
              onClick={() => {
                if (!selected) return
                setSelectedPresetId(p.id)
                // immediate apply on click
                onApplyToSelected?.({ preset: p.id, fontSize, angle, style: p.style || {}, className: p.className })
              }}
              style={{ minWidth: 84, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span className="font-medium" style={{ ...(p.style as React.CSSProperties || {}), fontSize: 14, transform: 'none' }}>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoSmallTool
