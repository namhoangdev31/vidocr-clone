import { ReactNode } from 'react'
import { Bot, CircleDollarSign, LayoutDashboard, User } from 'lucide-react'

export type AdminNavItem = {
  href: string
  label: string
  icon: ReactNode
}

export const adminNavItems: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/admin/users', label: 'Quản Lý User', icon: <User /> },
  { href: '/admin/payments', label: 'Quản Lý Payment', icon: <CircleDollarSign /> },
  { href: '/admin/ai-models', label: 'Quản Lý AI Model', icon: <Bot /> },
]