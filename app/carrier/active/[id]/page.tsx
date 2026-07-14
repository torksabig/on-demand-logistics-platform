'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Package,
  Phone,
  Wallet,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { StatusBadge } from '@/components/status-badge'
import { PodCapture } from '@/components/pod/pod-capture'
import { useStore } from '@/components/store-provider'
import { statusMeta } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

const nextStatusLabel: Record<string, string> = {
  assigned: 'Mark picked up',
  picked_up: 'Start transit',
  in_transit: 'Complete delivery',
}

export default function ActiveDeliveryPage() {
  const { id } = useParams<{ id: string }>()
  const { orders, advance, pod, gps } = useStore()
  const order = orders.find((o) => o.id === id)

  useEffect(() => {
    if (!order || order.status === 'delivered') return
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        gps(order.id, pos.coords.latitude, pos.coords.longitude)
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 15000 },
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [order, gps])

  if (!order) {
    return (
      <AppShell
        role="courier"
        title="Delivery"
        user={{ name: 'Marko Petrov', sub: 'Courier · 4.9' }}
      >
        <p className="text-sm text-muted-foreground">Delivery not found.</p>
        <Link href="/jobs" className="mt-4 text-sm text-brand hover:underline">
          Back to jobs
        </Link>
      </AppShell>
    )
  }

  const canAdvance = ['assigned', 'picked_up', 'in_transit'].includes(
    order.status,
  )
  const showPod = order.status === 'in_transit'

  function handleAdvance() {
    advance(order.id)
  }

  function handlePod(name: string, photo?: string) {
    pod(order.id, name, photo)
    advance(order.id)
  }

  return (
    <AppShell
      role="courier"
      title={order.ref}
      user={{ name: 'Marko Petrov', sub: 'Courier · 4.9' }}
    >
      <div className="space-y-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to jobs
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">{order.ref}</h2>
            <p className="text-sm text-muted-foreground">{order.customer}</p>
          </div>
          <StatusBadge
            label={statusMeta[order.status].label}
            tone={statusMeta[order.status].tone}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Package className="mt-0.5 size-4 text-brand" />
                <div>
                  <p className="text-xs text-muted-foreground">Pickup</p>
                  <p className="text-sm font-medium">{order.pickup}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Dropoff</p>
                  <p className="text-sm font-medium">{order.dropoff}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Recipient</p>
                  <p className="text-sm font-medium">
                    {order.recipient} · {order.recipientPhone}
                  </p>
                </div>
              </div>
              {order.codAmount > 0 && (
                <div className="flex items-start gap-2">
                  <Wallet className="mt-0.5 size-4 text-warning" />
                  <div>
                    <p className="text-xs text-muted-foreground">COD to collect</p>
                    <p className="text-sm font-semibold">
                      €{order.codAmount.toFixed(2)} ({order.codMethod})
                    </p>
                  </div>
                </div>
              )}
            </div>

            {canAdvance && !showPod && (
              <Button
                size="lg"
                className="h-10 w-full bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={handleAdvance}
              >
                <Navigation className="size-4" />
                {nextStatusLabel[order.status]}
              </Button>
            )}

            <Link
              href={`/track/${order.trackToken}`}
              target="_blank"
              className="block text-center text-xs text-brand hover:underline"
            >
              Open customer tracking link
            </Link>
          </div>

          {showPod ? (
            <PodCapture onCapture={handlePod} />
          ) : order.status === 'delivered' ? (
            <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
              <p className="font-medium text-success">Delivery complete</p>
              {order.proofCaptured && (
                <p className="mt-1 text-sm text-muted-foreground">
                  PoD captured for {order.podRecipientName}
                </p>
              )}
              {order.podPhotoDataUrl && (
                <img
                  src={order.podPhotoDataUrl}
                  alt="Proof of delivery"
                  className="mt-3 max-h-48 rounded-lg border border-border"
                />
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">
                GPS tracking active. Customer can follow progress on the tracking link.
              </p>
              {order.lastLat && order.lastLng && (
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {order.lastLat.toFixed(4)}, {order.lastLng.toFixed(4)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
