'use client'

import { ToolbarItem } from './types'

type ToolbarProps = {
  items: ToolbarItem[]
}

export function Toolbar({ items }: ToolbarProps) {
  return (
    <aside className="w-16 bg-slate-950/80 border-r border-slate-800 flex flex-col items-center py-4 gap-3">
      {items.map((item) => (
        <button
          key={item.id}
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-slate-300 transition-colors ${
            item.active ? 'bg-slate-800 text-sky-400' : 'hover:bg-slate-800/80 hover:text-white'
          }`}
          title={item.label}
          type="button"
        >
          {item.icon}
        </button>
      ))}
    </aside>
  )
}
