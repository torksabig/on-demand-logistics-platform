import { AppShell } from '@/components/app-shell'
import { BusinessDashboard } from '@/components/dashboard/business-dashboard'

export default function DashboardPage() {
  return (
    <AppShell
      role="business"
      title="Overview"
      user={{ name: 'Nordic Coffee', sub: 'Business account' }}
    >
      <BusinessDashboard />
    </AppShell>
  )
}
