import { ReactNode } from 'react'
import { UserPlus, Bolt, FileDown, Bell } from 'lucide-react'

interface QuickAction {
  title: string
  description: string
  icon: ReactNode
  accent: string
}

const actions: QuickAction[] = [
  {
    title: 'Thêm User Mới',
    description: 'Tạo tài khoản thủ công cho khách hàng',
    icon: <UserPlus />,
    accent: 'bg-indigo-50 text-indigo-600',
  },
  {
    title: 'Cấu Hình AI',
    description: 'Điều chỉnh mô hình AI theo nhu cầu',
    icon: <Bolt />,
    accent: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Xuất Báo Cáo',
    description: 'Tải xuống thống kê trong kỳ',
    icon: <FileDown />,
    accent: 'bg-violet-50 text-violet-600',
  },
  {
    title: 'Gửi Thông Báo',
    description: 'Thông báo đến toàn bộ người dùng',
    icon: <Bell />,
    accent: 'bg-amber-50 text-amber-600',
  },
]

const QuickActionsCard = () => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Thao Tác Nhanh</h2>
        <p className="text-sm text-slate-500">Lựa chọn hành động được dùng thường xuyên</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            className="flex items-start gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-indigo-200 hover:shadow"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.accent}`}>
              {action.icon}
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">{action.title}</span>
              <span className="text-xs text-slate-500">{action.description}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default QuickActionsCard