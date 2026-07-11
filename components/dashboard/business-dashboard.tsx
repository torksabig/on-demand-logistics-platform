'use client'

import { useMemo, useState } from 'react'
import {
  Plus,
  TrendingUp,
  ArrowUpRight,
  Search,
  MapPin,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import {
  orders as seedOrders,
  businessStats,
  weeklyVolume,
  statusMeta,
  type Order,
  type OrderStatus,
} from '@/lib/mock-data'
import { NewOrderDialog } from '@/components/dashboard/new-order-dialog'
import { cn } from '@/lib/utils'

const filters: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'in_transit', label: 'In transit' },
  { key: 'delivered', label: 'Delivered' },
]

export function BusinessDashboard() {
  const [orders, setOrders] = useState<Order[]>(seedOrders)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

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

  const maxVolume = Math.max(...weeklyVolume.map((d) => d.orders))

  function handleCreate(order: Order) {
    setOrders((prev) => [order, ...prev])
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Good morning, Nordic Coffee
          </h2>
          <p className="text-sm text-muted-foreground">
            Here is what is moving today, Saturday, July 11.
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

      {/* Stats */}
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
        {/* Volume chart */}
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

        {/* Live map panel */}
        <div className="flex flex-col rounded-2xl border border-border bg-primary p-5 text-primary-foreground">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Live map</h3>
            <span className="inline-flex items-center gap-1.5 text-xs text-primary-foreground/70">
              <span className="size-1.5 animate-pulse rounded-full bg-brand" />
              6 active
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
            <div className="absolute left-[22%] top-[30%] flex flex-col items-center">
              <MapPin className="size-5 text-brand" />
            </div>
            <div className="absolute left-[62%] top-[40%] flex flex-col items-center">
              <MapPin className="size-5 text-success" />
            </div>
            <div className="absolute left-[45%] top-[65%] flex flex-col items-center">
              <Package className="size-4 text-primary-foreground" />
            </div>
            <svg
              className="absolute inset-0 size-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M24 33 Q 45 18, 63 43"
                stroke="var(--color-brand)"
                strokeWidth="1"
                strokeDasharray="3 3"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <p className="mt-4 text-xs text-primary-foreground/60">
            2 pickups pending · 4 en route · ETA window 10:45–11:20
          </p>
        </div>
      </div>

      {/* Orders */}
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

        {/* Table (desktop) */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Route</th>
                <th className="px-5 py-3 font-medium">Courier</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">COD</th>
                <th className="px-5 py-3 text-right font-medium">ETA</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-border/60 last:border-0 hover:bg-secondary/50"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-mono text-xs font-semibold">{o.ref}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.items} items
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
                    {o.codAmount > 0 ? `$${o.codAmount.toFixed(2)}` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right text-muted-foreground">
                    {o.eta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards (mobile) */}
        <div className="divide-y divide-border/60 md:hidden">
          {filtered.map((o) => (
            <div key={o.id} className="flex flex-col gap-2 p-4">
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
                  {o.codAmount > 0 ? `COD $${o.codAmount.toFixed(2)}` : 'Prepaid'}{' '}
                  · ETA {o.eta}
                </span>
              </div>
            </div>
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
        onCreate={handleCreate}
      />
    </div>
  )
}
