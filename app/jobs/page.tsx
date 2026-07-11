import { AppShell } from '@/components/app-shell'
import { JobBoard } from '@/components/jobs/job-board'

export default function JobsPage() {
  return (
    <AppShell
      role="courier"
      title="Available jobs"
      user={{ name: 'Marko Petrov', sub: 'Courier · 4.9' }}
    >
      <JobBoard />
    </AppShell>
  )
}
