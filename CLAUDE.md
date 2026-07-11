**Project root:** /Users/teodorhiidenlampi/Desktop/MAIN AI/web-tools/on-demand-logistics-platform

# CLAUDE.md — Relay: B2B Last-Mile Marketplace (MVP Technical Spec)

Master spec for the MVP build. Every downstream agent (Builder, QA, Security, Deploy) reads this file. Product context lives in `PRODUCT.md`. This document is the source of truth for stack, schema, endpoints, auth, realtime, notifications, scope, and build order.

---

## 1. Product summary

**Relay** is a B2B last-mile delivery marketplace connecting Balkan SME merchants (pharmacies, florists, specialty retail) with local courier companies. Merchants post pickup/delivery jobs in under 2 minutes; carriers accept matched jobs in their zone; the platform handles COD reconciliation, live tracking, proof of delivery, and WhatsApp/SMS notifications end-to-end. Single-city launch (**Sarajevo** default). Monetization: take rate per delivery + merchant SaaS tier. Carriers are free in v1.

- **Merchant (demand):** SME doing 5–100 deliveries/day, no in-house logistics.
- **Carrier (supply):** Local logistics SME / courier operator, 1–20 vehicles.
- **End customer:** Recipient — not a platform account holder; receives tracking link + notifications only.

---

## 2. Stack decision

**Keep the existing scaffold. Add Supabase as the backend.** Rationale: the scaffold is well-built (Next.js 16 app router, React 19, Tailwind 4, shadcn-style components, branded "Relay" UI, realistic data shapes in `lib/mock-data.ts`). We wire the same components to a real backend rather than rebuild.

| Layer | Choice | One-line justification |
|---|---|---|
| Frontend | **Next.js 16 (app router) + React 19 + TS** | Already scaffolded; server actions remove a separate API tier for a solo team. |
| Styling / UI | **Tailwind CSS 4 + shadcn/ui + lucide** | Already in place; keep `components/ui`, `app-shell`, landing, dashboard, job-board. |
| Backend / DB | **Supabase (Postgres + Auth + Realtime + Storage + RLS)** | One managed service covers auth, DB, row-level security, realtime GPS pings, and PoD file storage — ideal for a small team. Avoids standing up FastAPI + separate auth + separate storage. Overrides the pipeline default (FastAPI) for good reason: realtime + storage + RLS are core here and Supabase gives all three natively. |
| Data access | **Server actions + `@supabase/ssr`** | Mutations via server actions (service-role where needed); reads via RLS-scoped client. Realtime + Storage via browser client. |
| Notifications | **WhatsApp Business Cloud API (Meta) + Twilio SMS fallback** | WhatsApp is the regional default; SMS covers non-WhatsApp recipients and template-approval gaps. |
| Maps / tracking | **MapLibre GL + OpenStreetMap tiles (or Mapbox token)** | Free/cheap map render for tracking link; carrier GPS via browser Geolocation API. |
| Background jobs | **Supabase Edge Functions + `pg_cron`** | COD reconciliation batch, notification dispatch, stale-order sweeps — no separate worker infra. |
| Deploy | **Vercel (frontend) + Supabase (managed backend)** | Zero-ops for a solo/small team; Railway not needed since Supabase hosts DB/functions. |
| Payments (take rate/SaaS) | **Stripe (deferred billing wiring; ledger built in v1)** | Record fees in DB from day one; automate Stripe payout/subscription post-PMF. |

**Carrier app = mobile-first PWA** (same Next.js app, `/carrier/*` routes, installable, uses Geolocation + camera). No native app in v1 (per PRODUCT §5).

---

## 3. MVP feature scope

### Ships in v1 (the full delivery loop, end-to-end)
1. **Org accounts + auth** — merchant orgs and carrier orgs, role-based, invite teammates.
2. **Merchant order posting** — wire existing `new-order-dialog` to real create; pickup/drop, parcel, COD amount+method, time window, vertical, recipient + phone.
3. **Zone matching** — order routed to carriers whose service zones cover the pickup zone. Manual zone polygons/areas per city; no route optimization.
4. **Carrier job board + one-tap accept** — wire existing `job-board`; only shows jobs in carrier's zones; first-accept-wins with atomic claim.
5. **Delivery lifecycle** — status machine: `pending → assigned → picked_up → in_transit → delivered` (+ `failed`, `cancelled`).
6. **Live tracking** — carrier PWA posts GPS pings; shareable public tracking link (tokenized, no login) for merchant + end customer with live map + status timeline.
7. **Proof of Delivery** — carrier captures photo + recipient name/signature/PIN at drop; stored in Supabase Storage; visible to merchant.
8. **COD ledger** — record COD amount, method (cash/card/prepaid), collection at delivery, and reconciliation status per order; merchant payout summary.
9. **WhatsApp/SMS notifications** — automated messages at key events (posted, accepted, picked up, en route, delivered, failed) to merchant + end customer; WhatsApp first, SMS fallback.
10. **Basic analytics** — merchant dashboard: deliveries completed, on-time rate, avg delivery time, COD collected vs outstanding (wire existing `businessStats`/`weeklyVolume`).
11. **Platform fee capture** — take-rate + SaaS fee recorded per delivery in a fees ledger (no live Stripe charge required for pilot; can invoice manually).

### Cut from MVP (stubbed or deferred — per PRODUCT §4/§5)
- Cross-border / multi-city dispatch (schema supports `city_id`, but one city active).
- Own fleet / employed drivers.
- Automated route optimization / multi-stop sequencing.
- Native iOS/Android apps (PWA only).
- Card-on-delivery live SDK — **record `card` as a COD method; treat as manual/terminal for pilot**. No card SDK integration in v1.
- Live Stripe subscription billing + automated carrier payouts (ledger only).
- Ratings/reviews, in-app chat, returns, CSV bulk import, Shopify/Woo integration, tiered SLAs, carrier earnings automation, loyalty.

---

## 4. File / folder structure

Additions are marked **NEW**; existing files are wired, not replaced. `[stub]` = ships as minimal placeholder in v1.

```
on-demand-logistics-platform/
├── CLAUDE.md
├── PRODUCT.md
├── .env.example                              # NEW
├── middleware.ts                             # NEW — Supabase session refresh + route guards
├── package.json                              # add deps (see §9)
├── app/
│   ├── layout.tsx                            # existing (branding, fonts)
│   ├── page.tsx                              # existing landing
│   ├── globals.css                           # existing
│   ├── (auth)/
│   │   ├── login/page.tsx                    # NEW
│   │   ├── signup/page.tsx                   # NEW — role picker: merchant | carrier
│   │   └── callback/route.ts                 # NEW — Supabase auth callback
│   ├── onboarding/page.tsx                   # NEW — create org, pick city/zones
│   ├── dashboard/                            # MERCHANT (existing shell)
│   │   ├── page.tsx                          # existing — wire to real orders
│   │   ├── orders/[id]/page.tsx              # NEW — order detail, timeline, PoD, COD
│   │   ├── payments/page.tsx                 # NEW — COD ledger + fees [stub-lite]
│   │   └── analytics/page.tsx                # NEW — analytics [wire businessStats]
│   ├── carrier/                              # CARRIER PWA (rename/extend /jobs)
│   │   ├── jobs/page.tsx                     # move from app/jobs — available jobs in zone
│   │   ├── active/[id]/page.tsx              # NEW — active delivery: status, GPS, PoD capture
│   │   └── earnings/page.tsx                 # NEW [stub] — COD-in-bag + payout summary
│   ├── track/[token]/page.tsx               # NEW — PUBLIC tracking link (no auth)
│   ├── jobs/page.tsx                         # existing → redirect to /carrier/jobs
│   └── api/
│       ├── gps/route.ts                      # NEW — carrier GPS ping ingest (POST)
│       └── webhooks/
│           └── whatsapp/route.ts             # NEW — Meta delivery-status webhook
├── actions/                                  # NEW — server actions grouped by domain
│   ├── auth.ts
│   ├── orders.ts
│   ├── jobs.ts
│   ├── tracking.ts
│   ├── pod.ts
│   ├── cod.ts
│   └── notifications.ts
├── components/                               # existing — wire to real data
│   ├── app-shell.tsx                         # existing — make nav role-aware/functional
│   ├── dashboard/business-dashboard.tsx      # existing — accept props from server
│   ├── dashboard/new-order-dialog.tsx        # existing — submit to createOrder action
│   ├── jobs/job-board.tsx                    # existing — real jobs + accept action
│   ├── tracking/                             # NEW
│   │   ├── tracking-map.tsx                  # MapLibre live marker
│   │   └── tracking-timeline.tsx
│   ├── pod/pod-capture.tsx                   # NEW — photo + signature/PIN
│   └── ui/…                                  # existing shadcn primitives
├── lib/
│   ├── mock-data.ts                          # existing — keep TYPES, retire mock arrays
│   ├── utils.ts                              # existing
│   ├── supabase/                             # NEW
│   │   ├── client.ts                         # browser client
│   │   ├── server.ts                         # server client (@supabase/ssr)
│   │   └── service.ts                        # service-role client (server-only)
│   ├── types.ts                              # NEW — DB row types (generated + hand)
│   ├── zones.ts                              # NEW — zone lookup / point-in-zone
│   ├── notifications/
│   │   ├── whatsapp.ts                       # NEW — Meta Cloud API client
│   │   ├── sms.ts                            # NEW — Twilio client
│   │   └── templates.ts                      # NEW — message templates per event
│   └── auth.ts                               # NEW — getSession, requireRole helpers
└── supabase/                                 # NEW
    ├── migrations/
    │   ├── 0001_init.sql                     # tables + relationships
    │   ├── 0002_rls.sql                      # row-level security policies
    │   ├── 0003_functions.sql                # claim_job(), reconcile helpers
    │   └── 0004_seed_sarajevo.sql            # city + zones + demo data
    ├── functions/
    │   ├── notify/index.ts                   # dispatch WhatsApp/SMS on event
    │   └── cod-reconcile/index.ts            # nightly COD batch (pg_cron trigger)
    └── config.toml
```

---

## 5. Database schema (Postgres / Supabase)

DDL below is the intent for `0001_init.sql`. All tables have `created_at timestamptz default now()`. Money stored as `numeric(10,2)`; currency `BAM` (Bosnian mark) default for Sarajevo. Enums mirror `lib/mock-data.ts` where possible so UI types stay stable.

```sql
-- ---------- enums ----------
create type org_type       as enum ('merchant','carrier');
create type user_role      as enum ('owner','admin','dispatcher','driver','member');
create type order_status   as enum ('pending','assigned','picked_up','in_transit','delivered','failed','cancelled');
create type vertical       as enum ('pharmacy','flowers','spare_parts','groceries','retail');
create type cod_method     as enum ('cash','card','prepaid');
create type cod_status     as enum ('pending','collected','reconciled','disputed');
create type proof_type     as enum ('signature','photo','pin');
create type priority       as enum ('standard','express','same_day');
create type vehicle_type   as enum ('bike','car','van');
create type ledger_kind    as enum ('cod_collected','payout_due','platform_fee','saas_fee','adjustment');
create type notif_channel  as enum ('whatsapp','sms');
create type notif_status   as enum ('queued','sent','delivered','failed');

-- ---------- geography ----------
create table cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,                    -- 'Sarajevo'
  country text not null default 'BA',
  currency char(3) not null default 'BAM',
  timezone text not null default 'Europe/Sarajevo',
  is_active boolean not null default true
);

create table zones (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id),
  name text not null,                    -- 'Centar', 'Novo Sarajevo'
  -- v1: simple named areas; store optional GeoJSON polygon for later point-in-zone
  boundary jsonb,                        -- GeoJSON polygon (nullable in v1)
  is_active boolean not null default true
);

-- ---------- orgs & users ----------
create table organizations (
  id uuid primary key default gen_random_uuid(),
  type org_type not null,
  name text not null,
  city_id uuid references cities(id),
  vertical vertical,                     -- merchants only
  phone text,
  saas_tier text not null default 'free',      -- 'free' | 'pro'
  take_rate_bps int not null default 1500,     -- platform fee, basis points
  created_at timestamptz not null default now()
);

-- links a Supabase auth user to an org with a role
create table memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  role user_role not null default 'member',
  unique (user_id, org_id)
);

-- carrier service coverage (which zones a carrier serves)
create table carrier_zones (
  carrier_org_id uuid not null references organizations(id) on delete cascade,
  zone_id uuid not null references zones(id) on delete cascade,
  primary key (carrier_org_id, zone_id)
);

-- ---------- orders (merchant-facing) ----------
create table orders (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,                    -- 'RL-4821'
  merchant_org_id uuid not null references organizations(id),
  city_id uuid not null references cities(id),
  pickup_zone_id uuid references zones(id),
  vertical vertical not null,
  status order_status not null default 'pending',
  priority priority not null default 'standard',

  pickup_address text not null,
  pickup_lat double precision,
  pickup_lng double precision,
  dropoff_address text not null,
  dropoff_lat double precision,
  dropoff_lng double precision,
  distance_km numeric(6,2),

  recipient_name text not null,
  recipient_phone text not null,               -- E.164, drives notifications
  items int not null default 1,
  weight_kg numeric(6,2),
  vehicle vehicle_type,
  time_window text,                            -- 'ASAP' | '10:00 – 12:00'

  cod_amount numeric(10,2) not null default 0,
  cod_method cod_method not null default 'cash',
  cod_status cod_status not null default 'pending',
  payout numeric(10,2),                        -- carrier fee
  platform_fee numeric(10,2),                  -- take rate applied

  created_at timestamptz not null default now(),
  eta timestamptz
);
create index on orders (status);
create index on orders (merchant_org_id, created_at desc);
create index on orders (pickup_zone_id, status);

-- ---------- deliveries (carrier-facing assignment/execution) ----------
create table deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references orders(id) on delete cascade,
  carrier_org_id uuid references organizations(id),
  driver_user_id uuid references auth.users(id),
  accepted_at timestamptz,
  picked_up_at timestamptz,
  delivered_at timestamptz,
  failed_reason text,
  track_token text unique not null default encode(gen_random_bytes(16),'hex'),  -- public link
  last_lat double precision,
  last_lng double precision,
  last_ping_at timestamptz
);
create index on deliveries (carrier_org_id);
create index on deliveries (track_token);

-- ordered status/event history (drives timeline + notifications)
create table delivery_events (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references deliveries(id) on delete cascade,
  status order_status not null,
  note text,
  actor_user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index on delivery_events (delivery_id, created_at);

-- high-frequency GPS pings (kept lean; prune post-delivery in v2)
create table gps_pings (
  id bigint generated always as identity primary key,
  delivery_id uuid not null references deliveries(id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  recorded_at timestamptz not null default now()
);
create index on gps_pings (delivery_id, recorded_at desc);

-- ---------- proof of delivery ----------
create table pod_artifacts (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references deliveries(id) on delete cascade,
  proof_type proof_type not null,
  storage_path text,                           -- Supabase Storage (photo/signature)
  recipient_name text,
  pin_code text,
  captured_at timestamptz not null default now()
);

-- ---------- COD / fee ledger ----------
create table cod_ledger (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  carrier_org_id uuid references organizations(id),
  merchant_org_id uuid not null references organizations(id),
  kind ledger_kind not null,
  amount numeric(10,2) not null,               -- signed
  currency char(3) not null default 'BAM',
  status cod_status not null default 'pending',
  reconciled_at timestamptz,
  created_at timestamptz not null default now()
);
create index on cod_ledger (merchant_org_id, status);
create index on cod_ledger (carrier_org_id, status);

-- ---------- notifications ----------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  channel notif_channel not null,
  to_phone text not null,
  template text not null,                       -- 'order_picked_up' etc.
  status notif_status not null default 'queued',
  provider_message_id text,
  error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
create index on notifications (order_id);
create index on notifications (status);
```

**Relationships (summary):** `organizations` 1—* `memberships` *—1 `auth.users`; carrier `organizations` *—* `zones` via `carrier_zones`; `orders` 1—1 `deliveries` 1—* `delivery_events` / `gps_pings` / `pod_artifacts`; `orders` 1—* `cod_ledger` / `notifications`. `orders.ref` = display ref (`RL-####`) preserving existing UI.

---

## 6. API surface (server actions + routes)

Server actions are default (in `actions/*`); HTTP routes only where an external system or public consumer needs them. Auth column: **y** = requires session + role check via `requireRole`.

### Auth / org — `actions/auth.ts`
| Action | Input | Output | Auth |
|---|---|---|---|
| `signUp` | email, password, role(merchant\|carrier) | session | n |
| `signIn` | email, password | session | n |
| `signOut` | — | ok | y |
| `createOrg` | name, type, city_id, vertical? | org | y |
| `inviteMember` | org_id, email, role | membership | y (owner/admin) |
| `setCarrierZones` | zone_ids[] | ok | y (carrier) |

### Orders (merchant) — `actions/orders.ts`
| Action | Input | Output | Auth |
|---|---|---|---|
| `createOrder` | pickup, dropoff, recipient{name,phone}, vertical, items, weight, cod{amount,method}, priority, time_window | order (+ derived zone, payout, platform_fee) | y (merchant) |
| `listOrders` | filters{status,range} | order[] | y (merchant) |
| `getOrder` | id | order + delivery + events + pod + cod | y (merchant) |
| `cancelOrder` | id | order | y (merchant) |

### Jobs (carrier) — `actions/jobs.ts`
| Action | Input | Output | Auth |
|---|---|---|---|
| `listAvailableJobs` | — (scoped to carrier zones) | job[] | y (carrier) |
| `acceptJob` | order_id | delivery (atomic claim via `claim_job()`) | y (carrier) |
| `listMyDeliveries` | status | delivery[] | y (carrier) |
| `updateDeliveryStatus` | delivery_id, status(picked_up\|in_transit\|delivered\|failed), note? | delivery + event (fires notification) | y (driver) |

### Tracking — `actions/tracking.ts` + `app/api/gps/route.ts`
| Endpoint | Input | Output | Auth |
|---|---|---|---|
| `POST /api/gps` | delivery_id, lat, lng | ok (updates `deliveries.last_*`, inserts `gps_pings`) | y (driver, token) |
| `getPublicTracking` (server) | track_token | status, timeline, last position, ETA — **no PII beyond first name** | n (public) |
| Realtime channel | `deliveries:track_token` | live `last_lat/last_lng` + status | n (public, anon key + RLS) |

### PoD — `actions/pod.ts`
| Action | Input | Output | Auth |
|---|---|---|---|
| `uploadPod` | delivery_id, file(photo/signature)\|pin, recipient_name | pod_artifact (Storage signed upload) | y (driver) |

### COD / fees — `actions/cod.ts`
| Action | Input | Output | Auth |
|---|---|---|---|
| `recordCodCollected` | order_id, amount, method | cod_ledger row | y (driver) |
| `getCodSummary` | org scope | totals: collected, outstanding, reconciled, fees | y (merchant/carrier) |
| `reconcileCod` | ledger_ids[] | updated rows | y (admin) — also nightly Edge Function |

### Notifications — `actions/notifications.ts` + webhook
| Endpoint | Input | Output | Auth |
|---|---|---|---|
| `enqueueNotification` (internal) | order_id, event | notification row | y (system) |
| `POST /api/webhooks/whatsapp` | Meta payload | 200 (updates `notifications.status`) | signature-verified |

---

## 7. Auth model

- **Supabase Auth** (email/password v1; magic link optional). One `auth.users` row per person.
- **Org accounts:** a person belongs to one or more `organizations` via `memberships`. An org is either `merchant` or `carrier`. Roles: `owner`, `admin`, `dispatcher` (merchant), `driver` (carrier), `member`.
- **Active org context:** stored in session/cookie; all scoped queries filter by the active `org_id`.
- **Access rules (enforced by RLS in `0002_rls.sql`, not just app code):**
  - Merchant members: read/write only their org's `orders`, and read-only related `deliveries`/`events`/`pod`/`cod_ledger`.
  - Carrier members: read `orders` that are `pending` **and** in one of their `carrier_zones`; read/write `deliveries` assigned to their org; write `delivery_events`, `pod_artifacts`, `gps_pings`, COD collection.
  - Drivers: restricted to deliveries where `driver_user_id = auth.uid()`.
  - **Public tracking:** `track/[token]` uses anon key; RLS exposes only status, timeline, last position, recipient first name for the matching `track_token`. No auth, no full PII.
  - Service-role client (`lib/supabase/service.ts`) used only in server actions/Edge Functions for cross-org writes (fee ledger, notifications) — never shipped to browser.
- **Route guards:** `middleware.ts` refreshes session and redirects: unauth → `/login`; merchant → `/dashboard`; carrier → `/carrier/jobs`; no org → `/onboarding`.

---

## 8. Realtime & tracking approach

1. **Carrier GPS capture:** carrier PWA on an active delivery uses `navigator.geolocation.watchPosition`; throttle to one ping every ~15s (or ~100m moved). Posts to `POST /api/gps` with the delivery's `track_token` for auth.
2. **Storage:** each ping updates `deliveries.last_lat/last_lng/last_ping_at` (cheap latest-position read) and appends to `gps_pings` (history, pruned in v2).
3. **Fan-out:** enable **Supabase Realtime** on `deliveries`. Merchant order page and public `track/[token]` page subscribe to the row and re-render marker + status on change. No websocket server to run.
4. **Shareable tracking link:** `track/[token]` is public and tokenized (`deliveries.track_token`, 128-bit). Rendered with MapLibre GL + OSM tiles, a status timeline (from `delivery_events`), ETA, and courier first name only. The link is included in WhatsApp/SMS to the end customer.
5. **ETA (v1, simple):** straight-line distance ÷ assumed avg speed, refined on `picked_up`. No routing engine.
6. **Map:** MapLibre GL JS + free OSM raster tiles for v1; swap to a Mapbox/MapTiler token if rate limits bite (env var ready).

---

## 9. Notification integration plan

**Events → messages** (`lib/notifications/templates.ts`), sent to merchant contact and/or end-customer `recipient_phone`:

| Event | Recipient(s) | Template |
|---|---|---|
| Order posted | merchant | `order_created` |
| Carrier accepted | merchant | `order_accepted` |
| Picked up | merchant + customer | `order_picked_up` (+ tracking link) |
| En route | customer | `order_en_route` (+ tracking link) |
| Delivered | merchant + customer | `order_delivered` (+ PoD confirmation) |
| Failed | merchant | `order_failed` |

**Delivery mechanism:**
- **Primary — WhatsApp Business Cloud API (Meta).** Pre-approved message templates (required for business-initiated messages). Store `provider_message_id`; consume delivery receipts via `POST /api/webhooks/whatsapp` (signature-verified) to update `notifications.status`.
- **Fallback — Twilio SMS.** Used when: WhatsApp send fails, number not on WhatsApp, or template not yet approved. Same template text, plain SMS.
- **Dispatch path:** status change → `enqueueNotification` inserts a `queued` row → Supabase Edge Function `notify` (invoked on insert or via `pg_cron` sweep) sends and updates status. Decoupling send from the request keeps status actions fast and retryable.
- **Phone format:** all numbers normalized to **E.164** on order create (mock data currently has `+381 …`; Sarajevo default is `+387`).
- **Pilot fallback:** if WhatsApp Business onboarding is delayed (PRODUCT assumption §3), ship SMS-only via Twilio; WhatsApp becomes a config flip once templates are approved.

---

## 10. Environment variables (`.env.example`)

```bash
# --- Supabase ---
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=              # server-only, never exposed to client
SUPABASE_JWT_SECRET=

# --- App ---
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_CITY=Sarajevo
NEXT_PUBLIC_DEFAULT_CURRENCY=BAM

# --- Maps ---
NEXT_PUBLIC_MAP_STYLE_URL=             # OSM/MapLibre style; optional Mapbox/MapTiler
NEXT_PUBLIC_MAP_TILE_TOKEN=            # optional, if using a tiled provider

# --- WhatsApp Business Cloud API (Meta) ---
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=                    # webhook signature verification

# --- Twilio SMS fallback ---
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# --- Stripe (deferred billing; keys staged) ---
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# --- Feature flags ---
NOTIFICATIONS_PROVIDER=sms             # sms | whatsapp | both  (pilot may start 'sms')
```

---

## 11. Build order (ruthlessly trimmed for 90-day success signal)

Success signal (PRODUCT §8): 500 completed deliveries, 80%+ on-time, 3+ carriers, 10+ merchants reordering. Build the **delivery loop first**, monetization/analytics last.

**Phase 0 — Backend foundation (build first)**
1. Supabase project, `0001_init.sql` + `0002_rls.sql` + `0004_seed_sarajevo.sql` (city + zones + demo orgs).
2. `lib/supabase/*` clients, `lib/types.ts`, `middleware.ts`.
3. Auth: signup/login, `createOrg`, onboarding (pick role, city, carrier zones). Role-based redirects.

**Phase 1 — The core loop (the thing that must work)**
4. `createOrder` wired to existing `new-order-dialog`; merchant dashboard reads real `listOrders`.
5. Zone matching (`lib/zones.ts`) + `listAvailableJobs` scoped to carrier zones; wire `job-board`.
6. `acceptJob` via atomic `claim_job()` (`0003_functions.sql`); `updateDeliveryStatus` state machine + `delivery_events`.
7. Carrier active-delivery page: status buttons + `pod-capture` (`uploadPod`) + `recordCodCollected`.
→ **Milestone: one delivery goes pending → delivered with PoD + COD recorded.**

**Phase 2 — Trust layer (drives repeat use)**
8. GPS ping `/api/gps` + `deliveries.last_*`; Realtime.
9. Public `track/[token]` page: MapLibre map + timeline + ETA.
10. Notifications: templates + Twilio SMS first, `enqueueNotification` on each status change; add WhatsApp + webhook once templates approved.

**Phase 3 — Operator visibility (proves the numbers)**
11. Merchant analytics (on-time rate, avg time, completed) from real data.
12. COD summary + fee ledger (take rate on delivered orders); `payments` page. Manual reconciliation button + nightly `cod-reconcile` Edge Function.

**Phase 4 — Ship**
13. PWA manifest + installability for carrier routes; mobile QA on the carrier flow.
14. Deploy to Vercel + Supabase; seed Sarajevo zones; onboard pilot carriers/merchants.

**Explicitly not in the build:** route optimization, native apps, card SDK, live Stripe billing/payout automation, ratings, chat, multi-city — all deferred (§3 cuts).

---

## Spec summary (5 bullets)
- **Keep the Next.js 16 scaffold; add Supabase** (Postgres + Auth + Realtime + Storage + RLS) as the single backend — no separate API/worker tier for a small team.
- **Two org types (merchant/carrier)** with role-based membership and RLS-enforced access; end customers get tokenized public tracking, not accounts.
- **11-table schema** covering orgs, zones, orders, deliveries, GPS pings, PoD, COD/fee ledger, and notifications — enums mirror existing `lib/mock-data.ts` types so the UI stays stable.
- **Realtime tracking via Supabase Realtime + carrier PWA Geolocation**; notifications via WhatsApp Cloud API with Twilio SMS fallback (pilot can start SMS-only).
- **Build the delivery loop first**; analytics, COD reconciliation, and monetization are recorded from day one but automated last.

## Assumptions (correct at Gate 1)
1. Launch city = **Sarajevo**, currency **BAM**, timezone **Europe/Sarajevo**; existing mock `+381` phones are placeholder → normalize to `+387`.
2. **Supabase replaces the pipeline-default FastAPI backend** (justified by native realtime/storage/RLS). If you require FastAPI, say so at Gate 1.
3. **Carrier experience = installable PWA** in the same Next.js app (no native/React Native shell in v1).
4. **Card-on-delivery is recorded as a COD method only** — no card terminal/SDK integration in v1.
5. **Stripe billing/payout automation is deferred**; fees + COD are tracked in a ledger and can be invoiced/reconciled manually during the pilot.
6. **Notifications may launch SMS-only** (Twilio) if WhatsApp Business onboarding lags; WhatsApp is a config flip.
7. **Zones are named areas** (optional GeoJSON polygons) with manual carrier↔zone assignment; no automated geocoding required for v1 (addresses can be free-text + optional lat/lng).
8. Reuse existing UI: `app-shell`, `business-dashboard`, `new-order-dialog`, `job-board`, landing sections, and `lib/mock-data.ts` **types** (mock data arrays retired).

**Gate 1: review CLAUDE.md and approve before I hand off to the Builder.**
