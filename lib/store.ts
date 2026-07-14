import {
  orders as seedOrders,
  jobs as seedJobs,
  type Order,
  type OrderStatus,
  type Vertical,
  type CodMethod,
  type ProofType,
  makeTimeline,
} from '@/lib/mock-data'

export type DeliveryOrder = Order & {
  trackToken: string
  vehicle: 'bike' | 'car' | 'van'
  weightKg: number
  window: string
  lastLat?: number
  lastLng?: number
  podRecipientName?: string
  podPhotoDataUrl?: string
}

export type CreateOrderInput = {
  pickup: string
  dropoff: string
  recipient: string
  recipientPhone: string
  vertical: Vertical
  items: number
  codAmount: number
  codMethod: CodMethod
  proofType: ProofType
  priority: Order['priority']
  vehicle: DeliveryOrder['vehicle']
  weightKg: number
  window: string
}

const STORAGE_KEY = 'relay-store-v1'

function randomToken() {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('')
}

function orderToDelivery(order: Order): DeliveryOrder {
  const job = seedJobs.find((j) => j.ref === order.ref)
  return {
    ...order,
    trackToken: order.id.replace('o', 'tk'),
    vehicle: job?.vehicle ?? 'car',
    weightKg: job?.weightKg ?? 5,
    window: job?.window ?? 'ASAP',
  }
}

function seedDeliveries(): DeliveryOrder[] {
  return seedOrders.map(orderToDelivery)
}

function load(): DeliveryOrder[] {
  if (typeof window === 'undefined') return seedDeliveries()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedDeliveries()
    return JSON.parse(raw) as DeliveryOrder[]
  } catch {
    return seedDeliveries()
  }
}

function save(orders: DeliveryOrder[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function getOrders(): DeliveryOrder[] {
  return load()
}

export function getOrder(id: string): DeliveryOrder | undefined {
  return load().find((o) => o.id === id)
}

export function getOrderByToken(token: string): DeliveryOrder | undefined {
  return load().find((o) => o.trackToken === token)
}

export function getPendingJobs(): DeliveryOrder[] {
  return load().filter((o) => o.status === 'pending')
}

export function getCarrierActiveOrders(courier = 'Marko P.'): DeliveryOrder[] {
  return load().filter(
    (o) =>
      o.courier === courier &&
      ['assigned', 'picked_up', 'in_transit'].includes(o.status),
  )
}

export function createOrder(input: CreateOrderInput): DeliveryOrder {
  const orders = load()
  const num = Math.floor(4800 + Math.random() * 900)
  const now = new Date()
  const time = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const order: DeliveryOrder = {
    id: `o-${Date.now()}`,
    ref: `RL-${num}`,
    customer: 'Nordic Coffee Roasters',
    vertical: input.vertical,
    recipient: input.recipient,
    recipientPhone: input.recipientPhone,
    pickup: input.pickup,
    dropoff: input.dropoff,
    distanceKm: Number((2 + Math.random() * 12).toFixed(1)),
    status: 'pending',
    courier: null,
    payout: Number((7 + Math.random() * 18).toFixed(1)),
    codAmount: input.codAmount,
    codMethod: input.codMethod,
    codStatus: input.codAmount > 0 ? 'pending' : 'reconciled',
    proofType: input.proofType,
    proofCaptured: false,
    createdAt: time,
    eta: '—',
    items: input.items,
    priority: input.priority,
    timeline: makeTimeline('pending', [time]),
    trackToken: randomToken(),
    vehicle: input.vehicle,
    weightKg: input.weightKg,
    window: input.window,
  }

  orders.unshift(order)
  save(orders)
  return order
}

export function acceptOrder(
  id: string,
  courier = 'Marko P.',
): DeliveryOrder | null {
  const orders = load()
  const idx = orders.findIndex((o) => o.id === id && o.status === 'pending')
  if (idx === -1) return null

  const time = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const order = orders[idx]
  const updated: DeliveryOrder = {
    ...order,
    status: 'assigned',
    courier,
    eta: '45 min',
    timeline: makeTimeline('assigned', [order.createdAt, time]),
  }
  orders[idx] = updated
  save(orders)
  return updated
}

const statusFlow: OrderStatus[] = [
  'pending',
  'assigned',
  'picked_up',
  'in_transit',
  'delivered',
]

export function advanceStatus(id: string): DeliveryOrder | null {
  const orders = load()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return null

  const order = orders[idx]
  const currentIdx = statusFlow.indexOf(order.status)
  if (currentIdx === -1 || currentIdx >= statusFlow.length - 1) return null

  const nextStatus = statusFlow[currentIdx + 1]
  const time = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const times = order.timeline
    .filter((t) => t.done || t.active)
    .map((t) => t.time)
  times.push(time)

  const updated: DeliveryOrder = {
    ...order,
    status: nextStatus,
    eta: nextStatus === 'delivered' ? 'Done' : '25 min',
    codStatus:
      nextStatus === 'delivered' && order.codAmount > 0
        ? 'collected'
        : order.codStatus,
    timeline: makeTimeline(nextStatus, times),
  }
  orders[idx] = updated
  save(orders)
  return updated
}

export function capturePod(
  id: string,
  recipientName: string,
  photoDataUrl?: string,
): DeliveryOrder | null {
  const orders = load()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return null

  const updated: DeliveryOrder = {
    ...orders[idx],
    proofCaptured: true,
    podRecipientName: recipientName,
    podPhotoDataUrl: photoDataUrl,
  }
  orders[idx] = updated
  save(orders)
  return updated
}

export function updateGps(
  id: string,
  lat: number,
  lng: number,
): DeliveryOrder | null {
  const orders = load()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return null

  const updated: DeliveryOrder = {
    ...orders[idx],
    lastLat: lat,
    lastLng: lng,
  }
  orders[idx] = updated
  save(orders)
  return updated
}

export function computeStats(orders: DeliveryOrder[]) {
  const active = orders.filter((o) =>
    ['pending', 'assigned', 'picked_up', 'in_transit'].includes(o.status),
  ).length
  const delivered = orders.filter((o) => o.status === 'delivered')
  const onTimeRate =
    delivered.length > 0
      ? `${Math.round((delivered.length / orders.length) * 100 * 0.96)}%`
      : '—'
  const codOutstanding = orders
    .filter((o) => o.codStatus === 'pending' || o.codStatus === 'collected')
    .reduce((sum, o) => sum + o.codAmount, 0)

  return {
    activeOrders: String(active),
    onTimeRate,
    proofCaptured: delivered.length
      ? `${Math.round((delivered.filter((o) => o.proofCaptured).length / delivered.length) * 100)}%`
      : '—',
    codOutstanding: `€${codOutstanding.toFixed(0)}`,
  }
}
