'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CreateOrderInput } from '@/lib/store'
import type { Order, Vertical, CodMethod, ProofType } from '@/lib/mock-data'

const priorities: { key: Order['priority']; label: string; hint: string }[] = [
  { key: 'standard', label: 'Standard', hint: 'Same day' },
  { key: 'express', label: 'Express', hint: '≤ 2 hours' },
  { key: 'same_day', label: 'ASAP', hint: 'Now' },
]

const verticals: { key: Vertical; label: string }[] = [
  { key: 'pharmacy', label: 'Pharmacy' },
  { key: 'flowers', label: 'Flowers' },
  { key: 'retail', label: 'Retail' },
  { key: 'groceries', label: 'Groceries' },
  { key: 'spare_parts', label: 'Spare parts' },
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
  onCreate: (input: CreateOrderInput) => void
}) {
  const [pickup, setPickup] = useState('Warehouse 4, Industrial Park')
  const [dropoff, setDropoff] = useState('')
  const [recipient, setRecipient] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('+387 6')
  const [vertical, setVertical] = useState<Vertical>('retail')
  const [items, setItems] = useState('1')
  const [cod, setCod] = useState('')
  const [codMethod, setCodMethod] = useState<CodMethod>('cash')
  const [proofType, setProofType] = useState<ProofType>('photo')
  const [priority, setPriority] = useState<Order['priority']>('standard')
  const [vehicle, setVehicle] = useState<'bike' | 'car' | 'van'>('car')
  const [weightKg, setWeightKg] = useState('5')
  const [window, setWindow] = useState('ASAP')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function reset() {
    setDropoff('')
    setRecipient('')
    setRecipientPhone('+387 6')
    setItems('1')
    setCod('')
    setPriority('standard')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onCreate({
      pickup,
      dropoff: dropoff || 'New delivery address',
      recipient: recipient || 'Customer',
      recipientPhone,
      vertical,
      items: Number(items) || 1,
      codAmount: cod ? Number(cod) : 0,
      codMethod: cod ? codMethod : 'prepaid',
      proofType,
      priority,
      vehicle,
      weightKg: Number(weightKg) || 5,
      window,
    })
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
        className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:rounded-2xl"
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
              className={fieldClass}
              required
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
              placeholder="112 Ferhadija, Centar"
              className={fieldClass}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="recipient" className="text-sm font-medium">
                Recipient
              </label>
              <input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Milan Jovanović"
                className={fieldClass}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <input
                id="phone"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className={fieldClass}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="vertical" className="text-sm font-medium">
              Vertical
            </label>
            <select
              id="vertical"
              value={vertical}
              onChange={(e) => setVertical(e.target.value as Vertical)}
              className={fieldClass}
            >
              {verticals.map((v) => (
                <option key={v.key} value={v.key}>
                  {v.label}
                </option>
              ))}
            </select>
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
                COD amount (€)
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
