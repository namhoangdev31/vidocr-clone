import { ReactNode } from 'react'

import AdminSidebar from './AdminSidebar'
import AdminTopBar from './AdminTopBar'

interface AdminShellProps {
  children: ReactNode
}

const AdminShell = ({ children }: AdminShellProps) => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default AdminShell