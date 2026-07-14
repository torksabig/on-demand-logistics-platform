# Relay — Balkan Last-Mile Logistics MVP

B2B last-mile marketplace + operating system for Balkan SMEs. Merchants post pickup/delivery jobs; local logistics companies accept, fulfill, and capture proof of delivery with COD support.

**Live demo:** Deployed on Vercel (see repo for URL after deploy).

## MVP features

- **Merchant dashboard** — post orders, view status, analytics, COD summary
- **Carrier job board** — zone-based pending jobs, one-tap accept
- **Active delivery flow** — status updates, GPS tracking, PoD capture
- **Public tracking link** — shareable `/track/[token]` for customers
- **COD support** — cash/card/prepaid recorded per order

## Quick start

```bash
pnpm install
pnpm dev
```

Open:
- Landing: http://localhost:3000
- Merchant dashboard: http://localhost:3000/dashboard
- Carrier jobs: http://localhost:3000/jobs

## Demo flow

1. Go to **Dashboard** → **New delivery** → create an order
2. Switch to **Courier view** → accept the pending job
3. Open **Start delivery** → advance status → capture PoD
4. Share the **tracking link** from the order row

> Data persists in browser localStorage for the demo. Connect Supabase (see `CLAUDE.md`) for production.

## Stack

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS 4 · shadcn/ui
- Vercel Analytics

## Docs

- `PRODUCT.md` — product strategy
- `CLAUDE.md` — full technical spec (Supabase backend plan)

## Deploy

```bash
pnpm build
vercel --prod
```

Or connect the GitHub repo to Vercel for automatic deploys.
