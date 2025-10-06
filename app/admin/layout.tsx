import { ReactNode } from 'react'

import AdminShell from './components/AdminShell'

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Bảng điều khiển quản trị cho Dichthudong.com',
}

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return <AdminShell>{children}</AdminShell>
}

export default AdminLayout