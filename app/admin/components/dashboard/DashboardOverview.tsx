import DashboardMetrics from './DashboardMetrics'
import LatestUsersCard from './LatestUsersCard'
import QuickActionsCard from './QuickActionsCard'
import SystemStatusCard from './SystemStatusCard'

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <DashboardMetrics />
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <LatestUsersCard />
        <SystemStatusCard />
      </div>
      <QuickActionsCard />
    </div>
  )
}

export default DashboardOverview