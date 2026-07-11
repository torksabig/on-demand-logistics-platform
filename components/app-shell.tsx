'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  Map,
  Wallet,
  Settings,
  Bell,
  Menu,
  X,
  Search,
  ListChecks,
  Route,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'

type NavItem = { label: string; icon: typeof Package; active?: boolean }

const businessNav: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, active: true },
  { label: 'Orders', icon: Package },
  { label: 'Live map', icon: Map },
  { label: 'Payments', icon: Wallet },
  { label: 'Settings', icon: Settings },
]

const courierNav: NavItem[] = [
  { label: 'Available jobs', icon: ListChecks, active: true },
  { label: 'My routes', icon: Route },
  { label: 'Earnings', icon: Wallet },
  { label: 'Ratings', icon: Star },
  { label: 'Settings', icon: Settings },
]

export function AppShell({
  role,
  title,
  user,
  children,
}: {
  role: 'business' | 'courier'
  title: string
  user: { name: string; sub: string }
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const nav = role === 'business' ? businessNav : courierNav
  const switchTo =
    role === 'business'
      ? { href: '/jobs', label: 'Courier view' }
      : { href: '/dashboard', label: 'Business view' }

  return (
    <div className="flex min-h-screen bg-secondary/40">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/" aria-label="Relay home">
            <Logo variant="light" />
          </Link>
          <button
            type="button"
            className="text-sidebar-foreground/70 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => (
            <a
              key={item.label}
              href="#"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                item.active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <Link
            href={switchTo.href}
            className="flex items-center justify-center rounded-lg border border-sidebar-border px-3 py-2 text-xs font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent"
          >
            Switch to {switchTo.label}
          </Link>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-primary/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <h1 className="font-display text-lg font-semibold tracking-tight">
            {title}
          </h1>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search…"
                className="h-9 w-44 rounded-lg border border-border bg-card pl-8 pr-3 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>
            <button
              type="button"
              className="relative inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-4.5" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand" />
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card py-1 pl-1 pr-2.5">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                {user.name
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-xs font-semibold">{user.name}</span>
                <span className="block text-[10px] text-muted-foreground">
                  {user.sub}
                </span>
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
