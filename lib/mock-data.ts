export type OrderStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'

export type Vertical =
  | 'pharmacy'
  | 'flowers'
  | 'spare_parts'
  | 'groceries'
  | 'retail'

export type CodMethod = 'cash' | 'card' | 'prepaid'
export type CodStatus = 'pending' | 'collected' | 'reconciled'
export type ProofType = 'signature' | 'photo' | 'pin'

export type TimelineEvent = {
  label: string
  time: string
  done: boolean
  active?: boolean
}

export type Order = {
  id: string
  ref: string
  customer: string
  vertical: Vertical
  recipient: string
  recipientPhone: string
  pickup: string
  dropoff: string
  distanceKm: number
  status: OrderStatus
  courier: string | null
  payout: number
  codAmount: number
  codMethod: CodMethod
  codStatus: CodStatus
  proofType: ProofType
  proofCaptured: boolean
  createdAt: string
  eta: string
  items: number
  priority: 'standard' | 'express' | 'same_day'
  timeline: TimelineEvent[]
}

export type Job = {
  id: string
  ref: string
  business: string
  vertical: Vertical
  pickup: string
  dropoff: string
  distanceKm: number
  payout: number
  codAmount: number
  codMethod: CodMethod
  proofType: ProofType
  window: string
  vehicle: 'bike' | 'car' | 'van'
  weightKg: number
  priority: 'standard' | 'express' | 'same_day'
  postedMinsAgo: number
}

export type Notification = {
  id: string
  ref: string
  title: string
  detail: string
  time: string
  tone: 'brand' | 'success' | 'info' | 'warning'
  unread: boolean
}

export const statusMeta: Record<
  OrderStatus,
  { label: string; tone: 'muted' | 'brand' | 'info' | 'success' }
> = {
  pending: { label: 'Pending', tone: 'muted' },
  assigned: { label: 'Assigned', tone: 'info' },
  picked_up: { label: 'Picked up', tone: 'info' },
  in_transit: { label: 'In transit', tone: 'brand' },
  delivered: { label: 'Delivered', tone: 'success' },
}

export const verticalMeta: Record<
  Vertical,
  { label: string; short: string }
> = {
  pharmacy: { label: 'Pharmacy', short: 'Rx' },
  flowers: { label: 'Flowers & gifts', short: 'Flowers' },
  spare_parts: { label: 'Spare parts', short: 'Parts' },
  groceries: { label: 'Groceries', short: 'Grocery' },
  retail: { label: 'Retail', short: 'Retail' },
}

export const codMethodMeta: Record<CodMethod, { label: string }> = {
  cash: { label: 'Cash on delivery' },
  card: { label: 'Card on delivery' },
  prepaid: { label: 'Prepaid' },
}

export const proofMeta: Record<ProofType, { label: string }> = {
  signature: { label: 'Signature' },
  photo: { label: 'Photo' },
  pin: { label: 'PIN code' },
}

export function makeTimeline(status: OrderStatus, times: string[]): TimelineEvent[] {
  const steps = [
    'Order created',
    'Courier assigned',
    'Picked up',
    'In transit',
    'Delivered',
  ]
  const order: OrderStatus[] = [
    'pending',
    'assigned',
    'picked_up',
    'in_transit',
    'delivered',
  ]
  const currentIdx = order.indexOf(status)
  return steps.map((label, i) => ({
    label,
    time: i <= currentIdx ? times[i] ?? '—' : '—',
    done: i < currentIdx,
    active: i === currentIdx,
  }))
}

export const orders: Order[] = [
  {
    id: 'o1',
    ref: 'RL-4821',
    customer: 'Nordic Coffee Roasters',
    vertical: 'retail',
    recipient: 'Milan Jovanović',
    recipientPhone: '+381 64 111 2233',
    pickup: 'Warehouse 4, Industrial Park',
    dropoff: '112 Maple Street, Downtown',
    distanceKm: 6.2,
    status: 'in_transit',
    courier: 'Marko P.',
    payout: 14.5,
    codAmount: 89.0,
    codMethod: 'cash',
    codStatus: 'pending',
    proofType: 'signature',
    proofCaptured: false,
    createdAt: '08:42',
    eta: '11:20',
    items: 3,
    priority: 'express',
    timeline: makeTimeline('in_transit', ['08:42', '08:51', '09:34', '10:05']),
  },
  {
    id: 'o2',
    ref: 'RL-4822',
    customer: 'Bloom & Petal Florist',
    vertical: 'flowers',
    recipient: 'Ivana Petrović',
    recipientPhone: '+381 63 445 8890',
    pickup: 'Store 2, Market Square',
    dropoff: '9 Riverside Ave',
    distanceKm: 3.1,
    status: 'assigned',
    courier: 'Ana K.',
    payout: 9.0,
    codAmount: 0,
    codMethod: 'prepaid',
    codStatus: 'reconciled',
    proofType: 'photo',
    proofCaptured: false,
    createdAt: '09:05',
    eta: '10:45',
    items: 1,
    priority: 'same_day',
    timeline: makeTimeline('assigned', ['09:05', '09:12']),
  },
  {
    id: 'o3',
    ref: 'RL-4823',
    customer: 'TechParts Supply Co.',
    vertical: 'spare_parts',
    recipient: 'AutoFix Garage',
    recipientPhone: '+381 60 778 1290',
    pickup: 'Depot 1, North Gate',
    dropoff: '340 Commerce Blvd',
    distanceKm: 12.8,
    status: 'pending',
    courier: null,
    payout: 22.0,
    codAmount: 245.5,
    codMethod: 'card',
    codStatus: 'pending',
    proofType: 'signature',
    proofCaptured: false,
    createdAt: '09:18',
    eta: '—',
    items: 8,
    priority: 'standard',
    timeline: makeTimeline('pending', ['09:18']),
  },
  {
    id: 'o4',
    ref: 'RL-4824',
    customer: 'GreenLeaf Grocery',
    vertical: 'groceries',
    recipient: 'Sofija Marković',
    recipientPhone: '+381 62 334 5566',
    pickup: 'Store 7, West End',
    dropoff: '55 Oak Lane',
    distanceKm: 4.7,
    status: 'delivered',
    courier: 'Ivan D.',
    payout: 11.5,
    codAmount: 34.2,
    codMethod: 'cash',
    codStatus: 'reconciled',
    proofType: 'photo',
    proofCaptured: true,
    createdAt: '07:55',
    eta: '09:30',
    items: 5,
    priority: 'standard',
    timeline: makeTimeline('delivered', ['07:55', '08:01', '08:40', '09:05', '09:28']),
  },
  {
    id: 'o5',
    ref: 'RL-4825',
    customer: 'Urban Pharmacy',
    vertical: 'pharmacy',
    recipient: 'Nikola Ristić',
    recipientPhone: '+381 65 902 4471',
    pickup: 'Central Depot',
    dropoff: '78 Hill Road',
    distanceKm: 8.3,
    status: 'picked_up',
    courier: 'Lena V.',
    payout: 16.0,
    codAmount: 0,
    codMethod: 'prepaid',
    codStatus: 'reconciled',
    proofType: 'pin',
    proofCaptured: false,
    createdAt: '09:31',
    eta: '11:05',
    items: 2,
    priority: 'express',
    timeline: makeTimeline('picked_up', ['09:31', '09:38', '09:52']),
  },
  {
    id: 'o6',
    ref: 'RL-4826',
    customer: 'Nordic Coffee Roasters',
    vertical: 'retail',
    recipient: 'Đorđe Simić',
    recipientPhone: '+381 64 220 9931',
    pickup: 'Warehouse 4, Industrial Park',
    dropoff: '201 Elm Court',
    distanceKm: 5.5,
    status: 'delivered',
    courier: 'Marko P.',
    payout: 12.0,
    codAmount: 62.0,
    codMethod: 'card',
    codStatus: 'collected',
    proofType: 'signature',
    proofCaptured: true,
    createdAt: '07:10',
    eta: '08:40',
    items: 4,
    priority: 'standard',
    timeline: makeTimeline('delivered', ['07:10', '07:16', '07:52', '08:14', '08:38']),
  },
]

export const jobs: Job[] = [
  {
    id: 'j1',
    ref: 'RL-4830',
    business: 'TechParts Supply Co.',
    vertical: 'spare_parts',
    pickup: 'Depot 1, North Gate',
    dropoff: '340 Commerce Blvd',
    distanceKm: 12.8,
    payout: 22.0,
    codAmount: 245.5,
    codMethod: 'card',
    proofType: 'signature',
    window: '10:00 – 12:00',
    vehicle: 'van',
    weightKg: 18,
    priority: 'standard',
    postedMinsAgo: 4,
  },
  {
    id: 'j2',
    ref: 'RL-4831',
    business: 'Bloom & Petal Florist',
    vertical: 'flowers',
    pickup: 'Store 2, Market Square',
    dropoff: '9 Riverside Ave',
    distanceKm: 3.1,
    payout: 9.0,
    codAmount: 0,
    codMethod: 'prepaid',
    proofType: 'photo',
    window: 'ASAP',
    vehicle: 'bike',
    weightKg: 2,
    priority: 'same_day',
    postedMinsAgo: 7,
  },
  {
    id: 'j3',
    ref: 'RL-4832',
    business: 'GreenLeaf Grocery',
    vertical: 'groceries',
    pickup: 'Store 7, West End',
    dropoff: '55 Oak Lane',
    distanceKm: 4.7,
    payout: 11.5,
    codAmount: 34.2,
    codMethod: 'cash',
    proofType: 'photo',
    window: '11:00 – 13:00',
    vehicle: 'car',
    weightKg: 9,
    priority: 'standard',
    postedMinsAgo: 12,
  },
  {
    id: 'j4',
    ref: 'RL-4833',
    business: 'Urban Pharmacy',
    vertical: 'pharmacy',
    pickup: 'Central Depot',
    dropoff: '78 Hill Road',
    distanceKm: 8.3,
    payout: 16.0,
    codAmount: 0,
    codMethod: 'prepaid',
    proofType: 'pin',
    window: 'ASAP',
    vehicle: 'car',
    weightKg: 3,
    priority: 'express',
    postedMinsAgo: 15,
  },
  {
    id: 'j5',
    ref: 'RL-4834',
    business: 'City Books & Prints',
    vertical: 'retail',
    pickup: 'Store 3, Old Town',
    dropoff: '14 Garden Street',
    distanceKm: 2.4,
    payout: 7.5,
    codAmount: 21.0,
    codMethod: 'cash',
    proofType: 'signature',
    window: '13:00 – 15:00',
    vehicle: 'bike',
    weightKg: 4,
    priority: 'standard',
    postedMinsAgo: 22,
  },
  {
    id: 'j6',
    ref: 'RL-4835',
    business: 'Fresh Fish Market',
    vertical: 'groceries',
    pickup: 'Harbor Dock 2',
    dropoff: '88 Sunset Terrace',
    distanceKm: 15.1,
    payout: 26.5,
    codAmount: 118.0,
    codMethod: 'card',
    proofType: 'photo',
    window: 'ASAP',
    vehicle: 'van',
    weightKg: 22,
    priority: 'express',
    postedMinsAgo: 28,
  },
]

export const notifications: Notification[] = [
  {
    id: 'n1',
    ref: 'RL-4824',
    title: 'Delivered · proof captured',
    detail: 'Ivan D. completed delivery to 55 Oak Lane. Photo attached.',
    time: '2m ago',
    tone: 'success',
    unread: true,
  },
  {
    id: 'n2',
    ref: 'RL-4821',
    title: 'Out for delivery',
    detail: 'Marko P. is en route. Recipient notified by SMS.',
    time: '18m ago',
    tone: 'brand',
    unread: true,
  },
  {
    id: 'n3',
    ref: 'RL-4823',
    title: 'Awaiting courier',
    detail: 'Order posted to the network. 3 carriers nearby.',
    time: '31m ago',
    tone: 'info',
    unread: false,
  },
  {
    id: 'n4',
    ref: 'RL-4826',
    title: 'COD collected · €62.00',
    detail: 'Card on delivery captured. Reconciles in tonight’s payout.',
    time: '1h ago',
    tone: 'warning',
    unread: false,
  },
]

export const businessStats = [
  { label: 'Active orders', value: '18', delta: '+4 today', trend: 'up' as const },
  { label: 'On-time rate', value: '96.4%', delta: '+1.2%', trend: 'up' as const },
  { label: 'Proof captured', value: '100%', delta: 'last 200 orders', trend: 'flat' as const },
  { label: 'COD to reconcile', value: '€418', delta: '5 orders', trend: 'flat' as const },
]

export const courierStats = [
  { label: "Today's earnings", value: '€128.50', delta: '9 jobs', trend: 'up' as const },
  { label: 'Acceptance rate', value: '92%', delta: '+3%', trend: 'up' as const },
  { label: 'Rating', value: '4.9', delta: '412 reviews', trend: 'flat' as const },
  { label: 'COD in bag', value: '€284', delta: 'reconcile at 18:00', trend: 'flat' as const },
]

export const weeklyVolume = [
  { day: 'Mon', orders: 42 },
  { day: 'Tue', orders: 55 },
  { day: 'Wed', orders: 61 },
  { day: 'Thu', orders: 48 },
  { day: 'Fri', orders: 73 },
  { day: 'Sat', orders: 88 },
  { day: 'Sun', orders: 34 },
]
