'use client'

import { usePathname } from 'next/navigation'

import { adminNavItems } from './navConfig'

const AdminTopBar = () => {
  const pathname = usePathname()

  const currentPageLabel = (() => {
    if (!pathname) return 'Dashboard'
    const match = adminNavItems.find((item) =>
      item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
    )
    return match?.label ?? 'Dashboard'
  })()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
      <div className="flex flex-col">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Admin</span>
        <span className="text-lg font-semibold text-slate-800">{currentPageLabel}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 shadow-sm sm:flex">
          <SearchIcon />
          <input
            aria-label="Search"
            className="w-32 border-0 bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
            placeholder="Tìm kiếm"
            type="search"
          />
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600"
          aria-label="Notifications"
        >
          <BellIcon />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
            AU
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span>Admin User</span>
            <span className="text-xs font-normal text-indigo-500">admin@dichthudong.com</span>
          </div>
        </div>
      </div>
    </header>
  )
}

const iconClass = 'h-5 w-5'

const BellIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 9a6 6 0 1 1 12 0v3.5c0 .8.3 1.5.9 2l1.1.9H4l1.1-.9c.6-.5.9-1.2.9-2z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
)

const SearchIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
)

export default AdminTopBar