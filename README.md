# SlotLink — 1-Link Micro-Portal SaaS

Production Next.js (App Router) + TypeScript + PostgreSQL/Prisma + Paddle Merchant-of-Record starter.

## Quick Start
1. `cp .env.example .env` and set your PostgreSQL `DATABASE_URL` (Supabase/Neon/local).
2. `npm install`
3. `npm run db:push`
4. `npm run dev`

## Core Routes
- `/{slug}` — Public 1-link booking page
- `/p/{token}` — Zero-login Student Magic Portal
- `/dashboard` — Pro Dashboard
- `POST /api/bookings` — Atomic slot conflict check + student upsert + package credit
- `PATCH /api/bookings/{id}` — Complete (auto-deducts 1 hr) or cancel session
- `POST /api/webhooks/paddle` — HMAC-SHA256 verified Paddle subscription webhook
