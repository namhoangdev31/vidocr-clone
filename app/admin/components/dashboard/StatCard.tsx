import { ReactNode } from 'react'

export interface StatCardProps {
  title: string
  value: string
  change: string
  changeLabel?: string
  trend?: 'up' | 'down'
  icon: ReactNode
  accentColor?: string
}

const StatCard = ({ title, value, change, changeLabel, trend = 'up', icon, accentColor = 'indigo' }: StatCardProps) => {
  const accentMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  const accent = accentMap[accentColor] ?? accentMap.indigo
  const trendColor = trend === 'down' ? 'text-rose-500' : 'text-emerald-500'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
          {icon}
        </span>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        <span className={`font-semibold ${trendColor}`}>{change}</span>
        {changeLabel ? ` ${changeLabel}` : null}
      </p>
    </div>
  )
}

export default StatCard