import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản Lý User"
        description="Theo dõi trạng thái người dùng và quản lý quyền truy cập"
      />
      <EmptyState
        icon={<UsersIcon />}
        title="Chưa có bộ lọc nào được áp dụng"
        description="Sử dụng các công cụ lọc và tìm kiếm để bắt đầu quản lý người dùng. Bạn có thể phân loại theo plan, trạng thái hoặc ngày đăng ký."
        actionLabel="Tạo bộ lọc"
      />
    </div>
  )
}

const UsersIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="8" cy="10" r="3" />
    <circle cx="16" cy="10" r="3" />
    <path d="M4 21v-1a5 5 0 0 1 5-5h0" />
    <path d="M15 15h1a5 5 0 0 1 5 5v1" />
  </svg>
)

export default UsersPage