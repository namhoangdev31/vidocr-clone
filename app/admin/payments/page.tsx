import { Banknote } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

const PaymentsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản Lý Payment"
        description="Theo dõi giao dịch và cấu hình cổng thanh toán"
      />
      <EmptyState
        icon={<Banknote />}
        title="Chưa có báo cáo nào"
        description="Khi hệ thống bắt đầu ghi nhận giao dịch, dữ liệu doanh thu và lỗi thanh toán sẽ hiển thị tại đây."
        actionLabel="Cấu hình cổng"
      />
    </div>
  )
}

export default PaymentsPage