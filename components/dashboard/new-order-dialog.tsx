'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Order } from '@/lib/mock-data'

const priorities: { key: Order['priority']; label: string; hint: string }[] = [
  { key: 'standard', label: 'Standard', hint: 'Same day' },
  { key: 'express', label: 'Express', hint: '≤ 2 hours' },
  { key: 'same_day', label: 'ASAP', hint: 'Now' },
]

const fieldClass =
  'h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-brand'

export function NewOrderDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (order: Order) => void
}) {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [items, setItems] = useState('1')
  const [cod, setCod] = useState('')
  const [priority, setPriority] = useState<Order['priority']>('standard')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function reset() {
    setPickup('')
    setDropoff('')
    setItems('1')
    setCod('')
    setPriority('standard')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const num = Math.floor(4827 + Math.random() * 900)
    const order: Order = {
      id: `o-${Date.now()}`,
      ref: `RL-${num}`,
      customer: 'Nordic Coffee Roasters',
      pickup: pickup || 'Warehouse 4, Industrial Park',
      dropoff: dropoff || 'New delivery address',
      distanceKm: Number((2 + Math.random() * 12).toFixed(1)),
      status: 'pending',
      courier: null,
      payout: Number((7 + Math.random() * 18).toFixed(1)),
      codAmount: cod ? Number(cod) : 0,
      createdAt: 'now',
      eta: '—',
      items: Number(items) || 1,
      priority,
    }
    onCreate(order)
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-order-title"
        className="relative z-10 w-full max-w-md rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2
            id="new-order-title"
            className="font-display text-lg font-semibold"
          >
            New delivery
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="pickup" className="text-sm font-medium">
              Pickup location
            </label>
            <input
              id="pickup"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Warehouse 4, Industrial Park"
              className={fieldClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="dropoff" className="text-sm font-medium">
              Dropoff address
            </label>
            <input
              id="dropoff"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="112 Maple Street, Downtown"
              className={fieldClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="items" className="text-sm font-medium">
                Items
              </label>
              <input
                id="items"
                type="number"
                min="1"
                value={items}
                onChange={(e) => setItems(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="cod" className="text-sm font-medium">
                COD amount ($)
              </label>
              <input
                id="cod"
                type="number"
                min="0"
                step="0.01"
                value={cod}
                onChange={(e) => setCod(e.target.value)}
                placeholder="0.00"
                className={fieldClass}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-sm font-medium">Priority</span>
            <div className="grid grid-cols-3 gap-2">
              {priorities.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPriority(p.key)}
                  className={cn(
                    'flex flex-col items-center gap-0.5 rounded-lg border px-2 py-2.5 text-center transition-colors',
                    priority === p.key
                      ? 'border-brand bg-brand/10'
                      : 'border-border hover:border-brand/40',
                  )}
                >
                  <span className="text-sm font-medium">{p.label}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {p.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="h-10 flex-1 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Create order
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
