import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
}

const EmptyState = ({ icon, title, description, actionLabel }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      {icon ? <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">{icon}</div> : null}
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p> : null}
      {actionLabel ? (
        <button
          type="button"
          className="mt-6 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default EmptyState