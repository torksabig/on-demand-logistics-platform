'use client'

import { useMemo, useState } from 'react'
import {
  MapPin,
  Navigation,
  Wallet,
  Package,
  Bike,
  Car,
  Truck,
  Clock,
  Check,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { jobs as seedJobs, courierStats, type Job } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const vehicleIcon = {
  bike: Bike,
  car: Car,
  van: Truck,
} as const

const vehicleFilters: { key: Job['vehicle'] | 'all'; label: string }[] = [
  { key: 'all', label: 'All vehicles' },
  { key: 'bike', label: 'Bike' },
  { key: 'car', label: 'Car' },
  { key: 'van', label: 'Van' },
]

const priorityTone: Record<
  Job['priority'],
  { label: string; tone: 'muted' | 'brand' | 'warning' }
> = {
  standard: { label: 'Standard', tone: 'muted' },
  express: { label: 'Express', tone: 'warning' },
  same_day: { label: 'ASAP', tone: 'brand' },
}

export function JobBoard() {
  const [vehicle, setVehicle] = useState<Job['vehicle'] | 'all'>('all')
  const [sort, setSort] = useState<'payout' | 'distance' | 'recent'>('payout')
  const [accepted, setAccepted] = useState<string[]>([])
  const [online, setOnline] = useState(true)

  const list = useMemo(() => {
    let l = seedJobs.filter(
      (j) => vehicle === 'all' || j.vehicle === vehicle,
    )
    l = [...l].sort((a, b) => {
      if (sort === 'payout') return b.payout - a.payout
      if (sort === 'distance') return a.distanceKm - b.distanceKm
      return a.postedMinsAgo - b.postedMinsAgo
    })
    return l
  }, [vehicle, sort])

  function toggleAccept(id: string) {
    setAccepted((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <div className="space-y-6">
      {/* Heading + availability */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Available jobs
          </h2>
          <p className="text-sm text-muted-foreground">
            {list.length} jobs near you · Market Square area
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOnline((v) => !v)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
            online
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-border bg-secondary text-muted-foreground',
          )}
        >
          <span
            className={cn(
              'size-2 rounded-full',
              online ? 'animate-pulse bg-success' : 'bg-muted-foreground',
            )}
          />
          {online ? 'Online — accepting jobs' : 'Offline'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {courierStats.map((s) => (
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

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {vehicleFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setVehicle(f.key)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                vehicle === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-8 rounded-lg border border-border bg-card px-2 text-xs font-medium text-foreground outline-none focus:border-brand"
          >
            <option value="payout">Highest payout</option>
            <option value="distance">Nearest</option>
            <option value="recent">Most recent</option>
          </select>
        </label>
      </div>

      {/* Job list */}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((job) => {
          const VIcon = vehicleIcon[job.vehicle]
          const isAccepted = accepted.includes(job.id)
          const p = priorityTone[job.priority]
          return (
            <div
              key={job.id}
              className={cn(
                'flex flex-col rounded-2xl border bg-card p-5 transition-colors',
                isAccepted ? 'border-success/50' : 'border-border',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                    <VIcon className="size-4.5" />
                  </span>
                  <div>
                    <p className="font-mono text-xs font-semibold">
                      {job.ref}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {job.business}
                    </p>
                  </div>
                </div>
                <StatusBadge label={p.label} tone={p.tone} />
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-4 items-center justify-center">
                    <span className="size-2 rounded-full border-2 border-brand" />
                  </span>
                  <p className="text-sm">{job.pickup}</p>
                </div>
                <div className="ml-2 h-3 border-l border-dashed border-border" />
                <div className="flex items-start gap-2.5">
                  <MapPin className="size-4 text-success" />
                  <p className="text-sm">{job.dropoff}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-y border-border/70 py-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="text-sm font-semibold">{job.distanceKm} km</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Window</p>
                  <p className="text-sm font-semibold">{job.window}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-sm font-semibold">{job.weightKg} kg</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="flex items-center gap-1 font-display text-xl font-bold text-foreground">
                    <Wallet className="size-4 text-brand" />${job.payout.toFixed(2)}
                  </p>
                  {job.codAmount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Collect COD ${job.codAmount.toFixed(2)}
                    </p>
                  )}
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {job.postedMinsAgo}m ago
                </span>
              </div>

              <Button
                size="lg"
                onClick={() => toggleAccept(job.id)}
                className={cn(
                  'mt-4 h-10',
                  isAccepted
                    ? 'bg-success text-success-foreground hover:bg-success/90'
                    : 'bg-brand text-brand-foreground hover:bg-brand/90',
                )}
              >
                {isAccepted ? (
                  <>
                    <Check className="size-4" />
                    Accepted
                  </>
                ) : (
                  <>
                    <Navigation className="size-4" />
                    Accept job
                  </>
                )}
              </Button>
            </div>
          )
        })}
      </div>

      {list.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-5 py-14 text-center">
          <Package className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No jobs match this vehicle type right now.
          </p>
        </div>
      )}
    </div>
  )
}
