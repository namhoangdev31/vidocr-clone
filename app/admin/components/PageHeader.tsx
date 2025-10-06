import { ReactNode } from 'react'

interface PageHeaderAction {
  id: string
  label: string
  active?: boolean
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: PageHeaderAction[]
  extra?: ReactNode
}

const PageHeader = ({ title, description, actions, extra }: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {description ? <p className="text-sm text-slate-500">{description}</p> : null}
        </div>
        {extra ? <div className="flex items-center gap-3">{extra}</div> : null}
      </div>
      {actions && actions.length ? (
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                action.active
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                  : 'border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600'
              }`}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export type { PageHeaderAction }
export default PageHeader