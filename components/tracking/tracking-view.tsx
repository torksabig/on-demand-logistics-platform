'use client'

import { statusMeta } from '@/lib/mock-data'
import type { DeliveryOrder } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export function TrackingTimeline({ order }: { order: DeliveryOrder }) {
  return (
    <ol className="space-y-4">
      {order.timeline.map((event, i) => (
        <li key={i} className="flex gap-3">
          <span
            className={cn(
              'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border',
              event.done
                ? 'border-success bg-success text-success-foreground'
                : event.active
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-border bg-secondary text-muted-foreground',
            )}
          >
            {event.done ? <Check className="size-3.5" /> : <span className="size-2 rounded-full bg-current" />}
          </span>
          <div>
            <p
              className={cn(
                'text-sm font-medium',
                event.active ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {event.label}
            </p>
            <p className="text-xs text-muted-foreground">{event.time}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function TrackingMap({ order }: { order: DeliveryOrder }) {
  const lat = order.lastLat ?? 43.8563
  const lng = order.lastLng ?? 18.4131

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-primary">
      <div className="aspect-[16/10] w-full">
        <iframe
          title="Delivery map"
          className="size-full border-0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02}%2C${lat - 0.015}%2C${lng + 0.02}%2C${lat + 0.015}&layer=mapnik&marker=${lat}%2C${lng}`}
          loading="lazy"
        />
      </div>
      <div className="absolute left-4 top-4 rounded-lg bg-background/95 px-3 py-2 text-xs shadow">
        <p className="font-semibold">{order.ref}</p>
        <p className="text-muted-foreground">
          {statusMeta[order.status].label}
          {order.courier ? ` · ${order.courier}` : ''}
        </p>
      </div>
    </div>
  )
}
