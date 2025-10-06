interface LatestUser {
  name: string
  email: string
  plan: 'Free' | 'Pro' | 'Premium'
  status: 'Hoạt Động' | 'Tạm Dừng' | 'Cảnh Báo'
  joinedAt: string
}

const users: LatestUser[] = [
  { name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', plan: 'Pro', status: 'Hoạt Động', joinedAt: '2024-01-15' },
  { name: 'Trần Thị B', email: 'tranthib@email.com', plan: 'Premium', status: 'Hoạt Động', joinedAt: '2024-01-14' },
  { name: 'Lê Hoàng C', email: 'lehoangc@email.com', plan: 'Free', status: 'Tạm Dừng', joinedAt: '2024-01-13' },
  { name: 'Phạm Minh D', email: 'phamminhd@email.com', plan: 'Pro', status: 'Hoạt Động', joinedAt: '2024-01-12' },
  { name: 'Hoàng Thu E', email: 'hoangthue@email.com', plan: 'Premium', status: 'Hoạt Động', joinedAt: '2024-01-11' },
]

const LatestUsersCard = () => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Users Mới Nhất</h2>
          <p className="text-sm text-slate-500">Danh sách người dùng đăng ký gần đây</p>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          Xem tất cả
        </button>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="py-2 pr-4">User</th>
              <th className="px-4 py-2">Gói</th>
              <th className="px-4 py-2">Trạng Thái</th>
              <th className="px-4 py-2">Ngày Tham Gia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.email} className="text-slate-600">
                <td className="py-3 pr-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{user.name}</span>
                    <span className="text-xs text-slate-400">{user.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <PlanBadge plan={user.plan} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3 text-slate-500">{user.joinedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const PlanBadge = ({ plan }: { plan: LatestUser['plan'] }) => {
  const map: Record<LatestUser['plan'], string> = {
    Free: 'bg-slate-100 text-slate-600',
    Pro: 'bg-indigo-50 text-indigo-600',
    Premium: 'bg-violet-50 text-violet-600',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[plan]}`}>
      {plan}
    </span>
  )
}

const StatusBadge = ({ status }: { status: LatestUser['status'] }) => {
  const map: Record<LatestUser['status'], { dot: string; text: string }> = {
    'Hoạt Động': { dot: 'bg-emerald-500', text: 'text-emerald-600' },
    'Tạm Dừng': { dot: 'bg-amber-500', text: 'text-amber-600' },
    'Cảnh Báo': { dot: 'bg-rose-500', text: 'text-rose-600' },
  }

  const styles = map[status]

  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium ${styles.text}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} aria-hidden />
      {status}
    </span>
  )
}

export default LatestUsersCard