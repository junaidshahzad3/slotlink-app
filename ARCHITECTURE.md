# SlotLink — Architecture & Engineering Design

## 1. Layered Architecture
- **Presentation Layer (`src/app/**`, `src/components/**`):** Next.js 15 App Router Server Components fetch initial state directly via Prisma (`/[slug]`, `/p/[token]`, `/dashboard`), passing typed DTOs (`src/types/domain.ts`) into focused Client Components (`BookingClient`, `PortalClient`, `DashboardClient`).
- **API & Validation Layer (`src/app/api/**`):** Every mutating route validates input payloads with **Zod** schemas and enforces ownership (`getAuthenticatedPro()`, HMAC-SHA256 `verifyPaddleSignature()`, `CRON_SECRET`, or 128-bit `magicToken`).
- **Domain & Integration Layer (`src/lib/**`):**
  - `prisma.ts`: Singleton Prisma client preventing connection exhaustion in serverless/edge environments.
  - `auth.ts`: Stateless HMAC-SHA256 signed HTTP-only session cookies with `timingSafeEqual`.
  - `google-calendar.ts`: OAuth2 refresh-token exchange, FreeBusy conflict querying, Google Meet link generation, and event deletion.
  - `email.ts`: Transactional HTML emails via Resend REST API.
  - `plan-limits.ts`: Pure functions enforcing 14-day trial expiry and `$12 Solo` vs `$19 Pro` feature gates.

## 2. Concurrency & Data Integrity
- **Atomic Booking & Package Credits:** `POST /api/bookings` verifies slot conflicts and runs a single `prisma.$transaction` to upsert the `Student`, increment `hoursRemaining` + `totalPaidCents`, and insert the `Booking`.
- **Atomic Session Completion:** `PATCH /api/bookings/[id]` transitions `CONFIRMED -> COMPLETED` and decrements `hoursRemaining` (`WHERE hoursRemaining > 0`) inside a single transaction so double-clicks never double-deduct hours.
