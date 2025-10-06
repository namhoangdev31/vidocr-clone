'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { adminNavItems } from './navConfig'

const AdminSidebar = () => {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }

    return pathname?.startsWith(href)
  }

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
          QI
        </div>
        <div>
          <p className="text-lg font-semibold">Dichthudong.com</p>
          <p className="text-xs text-slate-500">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {adminNavItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 ${
                  active ? 'bg-white text-indigo-600 shadow-sm' : 'bg-slate-100'
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default AdminSidebar