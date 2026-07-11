**Project root:** /Users/teodorhiidenlampi/Desktop/MAIN AI/web-tools/on-demand-logistics-platform

# PRODUCT.md — B2B Last-Mile Marketplace for Balkan SMEs

---

## Pitch

> "[Startup name] helps local businesses book same-day and next-day pickup and delivery through one platform, while giving small logistics companies a steady stream of new orders, route efficiency, and digital tools they normally can't build themselves."

---

## 1. Target Users

**Primary — Merchants (demand side)**
Balkan SMEs in high-frequency delivery verticals: pharmacies, florists, and specialty retail (gifts, electronics, fashion). Businesses doing 5–100 deliveries/day with no in-house logistics. Located in a single launch city (TBD; Sarajevo, Skopje, or Tirana preferred for market size + digital gap).

**Secondary — Carriers (supply side)**
Local logistics SMEs and independent courier operators with 1–20 vehicles. Currently dependent on phone calls, spreadsheets, and WhatsApp for dispatch. Unable to build their own digital tools.

**Regional Context**
- Western Balkans e-commerce is growing but last-mile reliability is a primary barrier to trust and repeat purchase (OECD Digital Economy Outlook for Balkans).
- COD accounts for 60–80% of transactions in the region — cash collection is not optional, it is the baseline expectation (World Bank FCI data).
- SME digital adoption is low: most Balkan SMEs use no dedicated software for logistics coordination (OECD SME Policy Index 2022).

---

## 2. Core Job-to-be-Done

**For merchants:** Book a same-day or next-day pickup and delivery in under 2 minutes, with proof the order arrived and the cash was collected — without managing a courier fleet.

**For carriers:** Receive a steady, digital stream of matched pickup jobs in their operating area, with automated COD reconciliation and route context — without building software or chasing clients.

---

## 3. Must-Have Features (v1 MVP)

The minimum set required to complete one full delivery loop end-to-end:

| Feature | Description |
|---|---|
| **Merchant order posting** | Web form or simple dashboard: pickup address, drop address, parcel details, COD amount (if any), requested time window. |
| **Carrier job acceptance** | Mobile-first view for carriers: list of available jobs in their zone, one-tap accept. |
| **Area-based matching** | Route jobs to carriers operating in the pickup zone. No complex optimization — zone-level matching only for v1. |
| **COD + card support** | Carriers can collect cash on delivery; platform records amount and reconciles with merchant payout. Card-on-delivery via integration (or deferred if SDK unavailable). |
| **Live tracking** | Shareable tracking link for merchants and end-customers. GPS ping from carrier mobile app. |
| **Proof of Delivery (PoD)** | Carrier photo + recipient signature or name captured at drop-off. Stored and visible to merchant. |
| **WhatsApp/SMS notifications** | Automated status messages to merchant and end-customer at key events (picked up, en route, delivered, failed). WhatsApp preferred for regional penetration. |
| **Basic analytics dashboard** | Merchant view: deliveries completed, success rate, average delivery time, COD collected vs. outstanding. |

---

## 4. Nice-to-Haves (Deferred to v2+)

- Route optimization across multi-stop carrier routes
- Carrier earnings dashboard and payout automation
- Multi-city or cross-border dispatch
- Merchant API / Shopify / WooCommerce integration
- Rating and review system (merchant ↔ carrier)
- Bulk order import (CSV)
- SLA-based tiered service levels (express, standard, economy)
- Carrier fleet management (vehicle tracking, shift scheduling)
- In-app chat between merchant and carrier
- Return logistics workflow

---

## 5. Do NOT Build for v1

| Feature | Reason |
|---|---|
| Cross-border or multi-country dispatch | Regulatory complexity; kills focus before proving city-level PMF |
| Consumer-facing marketplace (C2C or B2C retail) | Different trust, UX, and liquidity problem — separate product |
| Own carrier fleet / employed drivers | Asset-heavy; contradicts marketplace model |
| Automated route optimization engine | Zone matching is sufficient for v1 density; full optimization requires data volume we won't have |
| Loyalty / rewards program | Premature; solve reliability first |
| Financial products (lending, BNPL) | Out of scope until transaction trust and data are established |
| Native iOS + Android apps (launch) | Progressive Web App or React Native thin shell sufficient for v1 carrier experience |

---

## 6. Monetization

**Take rate:** Platform fee per completed delivery (percentage of delivery price or flat fee). Charged to merchants. Transparent to carriers.

**SaaS fee:** Monthly subscription for merchant accounts above a volume threshold. Unlocks advanced analytics, priority matching, and dedicated support. Free tier for onboarding.

Do not charge carriers in v1 — supply-side friction kills marketplace cold starts.

---

## 7. Launch Strategy

- **Single city.** Prove unit economics and reliability before expanding.
- **Vertical focus.** Lead with pharmacies (high urgency, COD-heavy, repeat volume), then florists and specialty retail. Avoid generic e-commerce in v1 — verticals allow tight operational playbook.
- **Manual supply onboarding.** Recruit 5–10 carrier partners directly before launch. Do not rely on organic carrier acquisition in v1.
- **Merchant pilot.** 10–20 anchor merchants, co-designed workflows, weekly feedback loops.

---

## 8. Success Signal

**Primary:** 80%+ on-time delivery rate across 500 completed deliveries in the launch city within 90 days of go-live, with at least 3 active carrier partners and 10 active merchant accounts reordering weekly.

This proves: matching works, COD flow is trusted, and both sides see enough value to return.

---

## 9. Open Assumptions

1. **COD dominance is the norm, not a transition phase.** Product assumes COD is a permanent feature, not a workaround to be phased out.
2. **Carriers will use a mobile web app** (not a native app) if the UX is simple enough. If churn is high on the supply side, native app may need to be pulled forward.
3. **WhatsApp Business API access is achievable** in the launch market without prohibitive onboarding delays.
4. **Merchants will pay a SaaS fee once reliability is demonstrated.** If price sensitivity is extreme, the take-rate-only model may need to be the primary revenue mechanism.
5. **A single city has sufficient SME delivery volume** (5,000+ deliveries/month addressable) to reach carrier break-even without cross-subsidizing routes.
6. **Regulatory environment** for marketplace logistics in the target country does not require carrier licensing or employment classification that prevents the contractor model.

---

**Next: run pipeline-architect to turn this into a technical spec.**
