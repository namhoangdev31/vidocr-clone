import { CircleDollarSign, Crown, SquarePlay, User } from 'lucide-react'
import StatCard from './StatCard'

const iconClass = 'h-5 w-5'

const DashboardMetrics = () => {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Tổng Users"
        value="12,847"
        change="+12%"
        changeLabel="so với kỳ trước"
        icon={<User />}
        accentColor="indigo"
      />
      <StatCard
        title="Users Trả Phí"
        value="3,249"
        change="+8%"
        changeLabel="so với kỳ trước"
        icon={<Crown />}
        accentColor="emerald"
      />
      <StatCard
        title="Doanh Thu"
        value="$84,329"
        change="+23%"
        changeLabel="so với kỳ trước"
        icon={<CircleDollarSign />}
        accentColor="violet"
      />
      <StatCard
        title="Videos Processed"
        value="45,892"
        change="+18%"
        changeLabel="so với kỳ trước"
        icon={<SquarePlay />}
        accentColor="amber"
      />
    </section>
  )
}

export default DashboardMetrics