'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  Plus,
  TrendingUp,
  Search,
  MapPin,
  Package,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { weeklyVolume, statusMeta } from '@/lib/mock-data'
import { NewOrderDialog } from '@/components/dashboard/new-order-dialog'
import { useStore } from '@/components/store-provider'
import { computeStats } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/mock-data'

const filters: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'in_transit', label: 'In transit' },
  { key: 'delivered', label: 'Delivered' },
]

export function BusinessDashboard() {
  const { orders, create } = useStore()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const stats = useMemo(() => computeStats(orders), [orders])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchFilter = filter === 'all' || o.status === filter
      const matchQuery =
        query.trim() === '' ||
        o.ref.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase()) ||
        o.dropoff.toLowerCase().includes(query.toLowerCase())
      return matchFilter && matchQuery
    })
  }, [orders, filter, query])

  const activeCount = orders.filter((o) =>
    ['assigned', 'picked_up', 'in_transit'].includes(o.status),
  ).length

  const businessStats = [
    { label: 'Active orders', value: stats.activeOrders, delta: `${activeCount} in progress`, trend: 'up' as const },
    { label: 'On-time rate', value: stats.onTimeRate, delta: 'last 7 days', trend: 'up' as const },
    { label: 'Proof captured', value: stats.proofCaptured, delta: 'delivered orders', trend: 'flat' as const },
    { label: 'COD to reconcile', value: stats.codOutstanding, delta: 'pending collection', trend: 'flat' as const },
  ]

  const maxVolume = Math.max(...weeklyVolume.map((d) => d.orders))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Good morning, Nordic Coffee
          </h2>
          <p className="text-sm text-muted-foreground">
            Sarajevo · {orders.length} orders in your network
          </p>
        </div>
        <Button
          size="lg"
          className="h-10 bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="size-4" />
          New delivery
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {businessStats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-2xl font-bold">{s.value}</p>
            <p
              className={cn(
                'mt-1 inline-flex items-center gap-1 text-xs font-medium',
                s.trend === 'up' ? 'text-success' : 'text-muted-foreground',
              )}
            >
              {s.trend === 'up' && <TrendingUp className="size-3" />}
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">
                Delivery volume
              </h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <StatusBadge label="+12% vs last week" tone="success" dot={false} />
          </div>
          <div className="mt-6 flex h-44 items-end justify-between gap-2 sm:gap-4">
            {weeklyVolume.map((d) => (
              <div
                key={d.day}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-brand/85 transition-all hover:bg-brand"
                    style={{ height: `${(d.orders / maxVolume) * 100}%` }}
                    title={`${d.orders} orders`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-border bg-primary p-5 text-primary-foreground">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Live map</h3>
            <span className="inline-flex items-center gap-1.5 text-xs text-primary-foreground/70">
              <span className="size-1.5 animate-pulse rounded-full bg-brand" />
              {activeCount} active
            </span>
          </div>
          <div className="relative mt-4 flex-1 overflow-hidden rounded-xl border border-primary-foreground/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)]">
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage:
                  'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="absolute left-[22%] top-[30%]">
              <MapPin className="size-5 text-brand" />
            </div>
            <div className="absolute left-[62%] top-[40%]">
              <MapPin className="size-5 text-success" />
            </div>
          </div>
          <p className="mt-4 text-xs text-primary-foreground/60">
            {orders.filter((o) => o.status === 'pending').length} awaiting courier ·{' '}
            {activeCount} en route
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <h3 className="font-display text-base font-semibold">Recent orders</h3>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search orders…"
              className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm outline-none transition-colors focus:border-brand sm:w-56"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border px-5 py-3">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                filter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Route</th>
                <th className="px-5 py-3 font-medium">Courier</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">COD</th>
                <th className="px-5 py-3 text-right font-medium">Track</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-border/60 last:border-0 hover:bg-secondary/50"
                >
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/dashboard/orders/${o.id}`}
                      className="font-mono text-xs font-semibold hover:text-brand"
                    >
                      {o.ref}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {o.items} items · {o.recipient}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="max-w-[220px] truncate">{o.dropoff}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.distanceKm} km
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {o.courier ?? 'Unassigned'}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      label={statusMeta[o.status].label}
                      tone={statusMeta[o.status].tone}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium">
                    {o.codAmount > 0 ? `€${o.codAmount.toFixed(2)}` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/track/${o.trackToken}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
                    >
                      Track
                      <ExternalLink className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border/60 md:hidden">
          {filtered.map((o) => (
            <Link
              key={o.id}
              href={`/dashboard/orders/${o.id}`}
              className="flex flex-col gap-2 p-4 hover:bg-secondary/30"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold">{o.ref}</span>
                <StatusBadge
                  label={statusMeta[o.status].label}
                  tone={statusMeta[o.status].tone}
                />
              </div>
              <p className="text-sm">{o.dropoff}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{o.courier ?? 'Unassigned'}</span>
                <span>
                  {o.codAmount > 0 ? `COD €${o.codAmount.toFixed(2)}` : 'Prepaid'}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
            <Package className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No orders match your filters.
            </p>
          </div>
        )}
      </div>

      <NewOrderDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={create}
      />
    </div>
  )
}
