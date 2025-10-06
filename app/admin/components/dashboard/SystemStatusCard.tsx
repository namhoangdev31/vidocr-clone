interface ServiceStatus {
  name: string
  uptime: string
  status: 'up' | 'warning' | 'down'
}

const services: ServiceStatus[] = [
  { name: 'AI Translation Service', uptime: '99.9%', status: 'up' },
  { name: 'Video Processing', uptime: '99.7%', status: 'up' },
  { name: 'Payment Gateway', uptime: '100%', status: 'up' },
  { name: 'File Storage', uptime: '98.2%', status: 'warning' },
  { name: 'API Gateway', uptime: '99.8%', status: 'up' },
]

const SystemStatusCard = () => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Trạng Thái Hệ Thống</h2>
        <p className="text-sm text-slate-500">Uptime của các dịch vụ cốt lõi</p>
      </header>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${statusDot(service.status)}`} aria-hidden />
              <span className="font-medium text-slate-800">{service.name}</span>
            </div>
            <span className="text-xs font-medium text-slate-500">Uptime: {service.uptime}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

const statusDot = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'up':
      return 'bg-emerald-500'
    case 'warning':
      return 'bg-amber-500'
    case 'down':
      return 'bg-rose-500'
    default:
      return 'bg-slate-300'
  }
}

export default SystemStatusCard