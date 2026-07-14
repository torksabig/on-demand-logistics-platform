'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  acceptOrder,
  advanceStatus,
  capturePod,
  createOrder,
  getCarrierActiveOrders,
  getOrder,
  getOrderByToken,
  getOrders,
  getPendingJobs,
  updateGps,
  type CreateOrderInput,
  type DeliveryOrder,
} from '@/lib/store'

type StoreContextValue = {
  orders: DeliveryOrder[]
  refresh: () => void
  create: (input: CreateOrderInput) => DeliveryOrder
  accept: (id: string) => DeliveryOrder | null
  advance: (id: string) => DeliveryOrder | null
  pod: (id: string, name: string, photo?: string) => DeliveryOrder | null
  gps: (id: string, lat: number, lng: number) => DeliveryOrder | null
  pendingJobs: DeliveryOrder[]
  activeDeliveries: DeliveryOrder[]
  getById: (id: string) => DeliveryOrder | undefined
  getByToken: (token: string) => DeliveryOrder | undefined
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<DeliveryOrder[]>([])

  const refresh = useCallback(() => {
    setOrders(getOrders())
  }, [])

  useEffect(() => {
    refresh()
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'relay-store-v1') refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])

  const value = useMemo<StoreContextValue>(
    () => ({
      orders,
      refresh,
      create: (input) => {
        const order = createOrder(input)
        refresh()
        return order
      },
      accept: (id) => {
        const result = acceptOrder(id)
        refresh()
        return result
      },
      advance: (id) => {
        const result = advanceStatus(id)
        refresh()
        return result
      },
      pod: (id, name, photo) => {
        const result = capturePod(id, name, photo)
        refresh()
        return result
      },
      gps: (id, lat, lng) => {
        const result = updateGps(id, lat, lng)
        refresh()
        return result
      },
      pendingJobs: getPendingJobs(),
      activeDeliveries: getCarrierActiveOrders(),
      getById: getOrder,
      getByToken: getOrderByToken,
    }),
    [orders, refresh],
  )

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
