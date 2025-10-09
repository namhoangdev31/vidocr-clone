'use client'

import Image from 'next/image'
import { HeaderInfo } from './types'

function AvatarStack({ avatars }: { avatars?: string[] }) {
  if (!avatars || avatars.length === 0) {
    return (
      <div className="flex -space-x-2">
        <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-sm font-semibold text-white border border-slate-900">
          TT
        </div>
        <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-sm font-semibold text-white border border-slate-900">
          NT
        </div>
      </div>
    )
  }

  return (
    <div className="flex -space-x-2">
      {avatars.slice(0, 3).map((src, index) => (
        <div key={`${src}-${index}`} className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-900 bg-slate-800">
          <Image src={src} alt="member" fill sizes="36px" className="object-cover" />
        </div>
      ))}
    </div>
  )
}

type HeaderProps = {
  info: HeaderInfo
}

export function EditorHeader({ info }: HeaderProps) {
  return (
    <header className="h-20 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <AvatarStack avatars={info.avatars} />
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-slate-400">Current Project</span>
          {info.fileName && (
            <span className="text-sm text-slate-400">{info.fileName}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {info.meta && <span className="text-sm text-slate-400">{info.meta}</span>}
        {(info.actions || []).map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={action.disabled}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              action.variant === 'primary'
                ? 'bg-sky-500 hover:bg-sky-400 text-white disabled:bg-slate-700 disabled:text-slate-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:text-slate-500'
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </header>
  )
}
