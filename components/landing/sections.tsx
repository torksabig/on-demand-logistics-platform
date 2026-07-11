import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Package,
  MapPin,
  Wallet,
  Bell,
  Route,
  ShieldCheck,
  Clock,
  Star,
  CheckCircle2,
  Camera,
  BarChart3,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { verticalIcon } from '@/components/vertical-badge'
import { verticalMeta, type Vertical } from '@/lib/mock-data'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 text-xs font-medium text-primary-foreground/80">
            <span className="size-1.5 rounded-full bg-brand" />
            Last-mile delivery, built for SMEs
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            The trust layer for{' '}
            <span className="text-brand">local delivery</span>.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-primary-foreground/70 text-pretty sm:text-lg">
            Relay is a last-mile marketplace and operating system for small
            businesses. Match orders to vetted local couriers, track every
            parcel live, capture proof of delivery, and reconcile
            cash-on-delivery — the way delivery actually works here.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-11 bg-brand px-5 text-brand-foreground hover:bg-brand/90"
              render={<Link href="/dashboard" />}
            >
              Start shipping
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 border-primary-foreground/25 bg-transparent px-5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              render={<Link href="/brief" />}
            >
              Read the pitch
            </Button>
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-6">
            {[
              { v: '70%+', l: 'Orders paid COD' },
              { v: '100%', l: 'Proof of delivery' },
              { v: '1 city', l: 'Focused launch' },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-display text-2xl font-bold">{s.v}</dt>
                <dd className="text-xs text-primary-foreground/60">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-primary-foreground/15 shadow-2xl">
            <Image
              src="/hero-map.png"
              alt="Relay live tracking map showing delivery routes across a city"
              width={720}
              height={540}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-4 -left-4 hidden items-center gap-3 rounded-xl border border-border bg-card p-3 text-card-foreground shadow-xl sm:flex">
            <span className="flex size-9 items-center justify-center rounded-lg bg-success/15 text-success">
              <CheckCircle2 className="size-4.5" />
            </span>
            <div className="text-sm">
              <p className="font-semibold leading-tight">RL-4824 delivered</p>
              <p className="text-xs text-muted-foreground">
                Photo proof · COD €34.20
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const trustItems = [
  {
    icon: MapPin,
    title: 'Live tracking',
    body: 'Businesses and recipients follow every parcel on the map from pickup to doorstep with accurate ETAs.',
  },
  {
    icon: Bell,
    title: 'Proactive notifications',
    body: 'Automatic SMS and email at each stage — dispatched, out for delivery, delivered — so nobody has to call.',
  },
  {
    icon: Camera,
    title: 'Proof of delivery',
    body: 'Photo, signature, or PIN captured on every drop and attached to the order for zero-dispute delivery.',
  },
  {
    icon: Wallet,
    title: 'COD reconciliation',
    body: 'Cash and card-on-delivery collected securely and reconciled automatically into a single daily payout.',
  },
]

export function TrustLayer() {
  return (
    <section id="trust" className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            The trust layer
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            We don&apos;t just move parcels — we remove the doubt
          </h2>
          <p className="mt-4 text-primary-foreground/70 text-pretty">
            In markets where cash-on-delivery rules and trust is scarce, the
            winner is whoever makes every delivery verifiable. That is the core
            of Relay.
          </p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand text-brand-foreground">
                <t.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">
                {t.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/65">
                {t.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const features = [
  {
    icon: Route,
    title: 'Smart matching',
    body: 'Each order is matched to the nearest available courier or 3PL by vehicle, capacity, and rating.',
  },
  {
    icon: Building2,
    title: 'A marketplace, not a fleet',
    body: 'We aggregate the local couriers and 3PLs that already exist, giving SMEs one place to reach them all.',
  },
  {
    icon: BarChart3,
    title: 'Operating system for SMEs',
    body: 'Orders, tracking, notifications, COD, and analytics in one dashboard — no spreadsheets, no phone calls.',
  },
  {
    icon: ShieldCheck,
    title: 'Vetted network',
    body: 'Every courier and 3PL partner is verified, rated, and accountable for proof on every job.',
  },
]

export function Features() {
  return (
    <section id="platform" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          One platform
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          A marketplace and an operating system in one
        </h2>
        <p className="mt-4 text-muted-foreground text-pretty">
          Relay connects the demand from small businesses with the supply of
          local delivery — then runs the whole operation for both sides.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.title}
            className="group flex gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/40"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
              <f.icon className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const verticalCopy: Record<Vertical, string> = {
  pharmacy: 'Urgent medicine runs with PIN-verified handover.',
  flowers: 'Time-sensitive gifts with photo proof of the smile.',
  spare_parts: 'B2B parts to workshops with signed receipts.',
  groceries: 'Same-day essentials with cash or card on delivery.',
  retail: 'Everyday store orders shipped across town.',
}

export function Verticals() {
  const list = Object.keys(verticalMeta) as Vertical[]
  return (
    <section id="verticals" className="bg-secondary/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Built for local business
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            One network, every kind of delivery
          </h2>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v) => {
            const Icon = verticalIcon[v]
            return (
              <div
                key={v}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold">
                    {verticalMeta[v].label}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {verticalCopy[v]}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const steps = [
  {
    n: '01',
    title: 'Post a delivery',
    body: 'Enter pickup, dropoff, package size, COD amount, and proof type in seconds.',
  },
  {
    n: '02',
    title: 'Get matched',
    body: 'A nearby vetted courier or 3PL accepts and heads to your pickup point.',
  },
  {
    n: '03',
    title: 'Track, prove & reconcile',
    body: 'Watch it live, capture proof on delivery, and settle COD automatically.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          How it works
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Live in three steps
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-2xl bg-card p-7 shadow-sm">
            <span className="font-display text-4xl font-bold text-brand/25">
              {s.n}
            </span>
            <h3 className="mt-3 font-display text-xl font-semibold">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function CouriersSection() {
  return (
    <section id="couriers" className="bg-secondary/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 overflow-hidden rounded-2xl border border-border lg:order-1">
            <Image
              src="/courier.png"
              alt="A Relay courier with a parcel next to a delivery van"
              width={640}
              height={520}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              For couriers & 3PLs
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Fill your empty miles with steady work
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              Relay brings existing local couriers and 3PLs online. Browse
              nearby jobs, see the payout and COD up front, and accept the ones
              that fit your route — whether you run a bike, a car, or a fleet of
              vans.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { icon: Wallet, t: 'Transparent payouts and COD on every job' },
                { icon: Clock, t: 'Flexible hours — accept only what fits' },
                { icon: Star, t: 'Build a rating that unlocks premium jobs' },
              ].map((item) => (
                <li key={item.t} className="flex items-center gap-3 text-sm">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
                    <item.icon className="size-4" />
                  </span>
                  {item.t}
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="mt-8 h-11 bg-brand px-5 text-brand-foreground hover:bg-brand/90"
              render={<Link href="/jobs" />}
            >
              Browse available jobs
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CTA() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Own the last mile in your city
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70 text-pretty">
          Pay-as-you-go per delivery. No setup fees, no minimums — just reliable
          last-mile with proof on every parcel.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-11 bg-brand px-6 text-brand-foreground hover:bg-brand/90"
            render={<Link href="/dashboard" />}
          >
            Open dashboard
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 border-primary-foreground/25 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            render={<Link href="/brief" />}
          >
            Read the pitch
          </Button>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const cols = [
    { title: 'Product', links: ['Platform', 'Tracking', 'Proof of delivery', 'Pricing'] },
    { title: 'Company', links: ['Pitch', 'Careers', 'Partners', 'Contact'] },
    { title: 'Resources', links: ['Help center', 'API docs', 'Status', 'Blog'] },
  ]
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            The last-mile delivery marketplace and operating system for small
            businesses.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-sm font-semibold">{c.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Relay Logistics. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
