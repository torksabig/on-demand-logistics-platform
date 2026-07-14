'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ExternalLink, MapPin, Phone, Wallet } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { StatusBadge } from '@/components/status-badge'
import { TrackingMap, TrackingTimeline } from '@/components/tracking/tracking-view'
import { useStore } from '@/components/store-provider'
import { statusMeta, verticalMeta, codMethodMeta } from '@/lib/mock-data'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <AppShell
        role="business"
        title="Order"
        user={{ name: 'Nordic Coffee', sub: 'Business account' }}
      >
        <p className="text-sm text-muted-foreground">Order not found.</p>
        <Link href="/dashboard" className="mt-4 text-sm text-brand hover:underline">
          Back to dashboard
        </Link>
      </AppShell>
    )
  }

  return (
    <AppShell
      role="business"
      title={order.ref}
      user={{ name: 'Nordic Coffee', sub: 'Business account' }}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">{order.ref}</h2>
            <p className="text-sm text-muted-foreground">
              {verticalMeta[order.vertical].label} · {order.recipient}
            </p>
          </div>
          <StatusBadge
            label={statusMeta[order.status].label}
            tone={statusMeta[order.status].tone}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <TrackingMap order={order} />
            <Link
              href={`/track/${order.trackToken}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
            >
              Share tracking link
              <ExternalLink className="size-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-base font-semibold">Delivery details</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Route</dt>
                    <dd>
                      {order.pickup} → {order.dropoff}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Recipient</dt>
                    <dd>
                      {order.recipient} · {order.recipientPhone}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Wallet className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">COD</dt>
                    <dd>
                      {order.codAmount > 0
                        ? `€${order.codAmount.toFixed(2)} · ${codMethodMeta[order.codMethod].label} · ${order.codStatus}`
                        : 'Prepaid'}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-base font-semibold">Timeline</h3>
              <div className="mt-4">
                <TrackingTimeline order={order} />
              </div>
            </div>

            {order.proofCaptured && (
              <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
                <h3 className="font-display text-base font-semibold">Proof of delivery</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Received by {order.podRecipientName}
                </p>
                {order.podPhotoDataUrl && (
                  <img
                    src={order.podPhotoDataUrl}
                    alt="Proof of delivery"
                    className="mt-3 max-h-48 rounded-lg border border-border"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
