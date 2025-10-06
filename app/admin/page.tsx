import PageHeader from './components/PageHeader'
import DashboardOverview from './components/dashboard/DashboardOverview'

const filters = [
  { id: '7-days', label: '7 Ngày', active: true },
  { id: '30-days', label: '30 Ngày' },
  { id: '3-months', label: '3 Tháng' },
] as const

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Tổng quan hiệu suất hệ thống và người dùng"
        actions={filters.map((filter) => ({ ...filter }))}
      />
      <DashboardOverview />
    </div>
  )
}

export default AdminDashboardPage