import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

const AiModelsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản Lý AI Model"
        description="Giám sát hiệu suất và phiên bản của các mô hình AI"
      />
      <EmptyState
        icon={<AiIcon />}
        title="Chưa có mô hình được cấu hình"
        description="Khi bạn thêm mô hình mới hoặc cập nhật phiên bản, thông tin sẽ được hiển thị tại đây."
        actionLabel="Thêm mô hình"
      />
    </div>
  )
}

const AiIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="7" />
    <path d="M9 9h6" />
    <path d="M9 15h6" />
    <path d="M7 12h10" />
    <path d="M12 5V3" />
    <path d="M12 21v-2" />
    <path d="M5 12H3" />
    <path d="M21 12h-2" />
  </svg>
)

export default AiModelsPage