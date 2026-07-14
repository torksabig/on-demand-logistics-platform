'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { StatusBadge } from '@/components/status-badge'
import { TrackingMap, TrackingTimeline } from '@/components/tracking/tracking-view'
import { useStore } from '@/components/store-provider'
import { statusMeta } from '@/lib/mock-data'

export default function TrackPage() {
  const { token } = useParams<{ token: string }>()
  const { orders } = useStore()
  const order = orders.find((o) => o.trackToken === token)

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <Logo />
        <p className="text-sm text-muted-foreground">Tracking link not found or expired.</p>
        <Link href="/" className="text-sm text-brand hover:underline">
          Go to Relay
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Logo />
          <StatusBadge
            label={statusMeta[order.status].label}
            tone={statusMeta[order.status].tone}
          />
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Delivery for {order.recipient.split(' ')[0]}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold">{order.ref}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.dropoff}
            {order.courier ? ` · Courier ${order.courier}` : ''}
          </p>
          {order.eta && order.eta !== '—' && (
            <p className="mt-2 text-sm font-medium text-brand">ETA {order.eta}</p>
          )}
        </div>

        <TrackingMap order={order} />

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-base font-semibold">Status updates</h2>
          <div className="mt-4">
            <TrackingTimeline order={order} />
          </div>
        </div>

        {order.status === 'delivered' && order.proofCaptured && (
          <div className="rounded-2xl border border-success/30 bg-success/5 p-5 text-sm">
            Delivered and signed by {order.podRecipientName}. Thank you for using Relay.
          </div>
        )}
      </main>
    </div>
  )
}
