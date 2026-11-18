# SlotLink — End-to-End Architecture & User Flow Diagrams

> [!NOTE]
> Every route in **SlotLink** is strictly role-isolated into three interfaces backed by one PostgreSQL system of record: **Public SaaS Marketing & Onboarding** (`/`, `/login`), **White-Label Client Surfaces** (`/[slug]`, `/p/[token]`, `/notes/[slug]`), and the **Educator Studio Workspace** (`/dashboard`).

---

## 1. End-to-End System & Role Isolation Map

```mermaid
flowchart LR
  Visitor["New Educator (Visitor)"] -->|"Explores pricing & sample link"| Landing["Landing Page (/)"]
  Visitor -->|"Clicks Create Studio"| Signup["Create Studio (/login?mode=signup)"]
  Signup -->|"POST /api/auth/signup"| AuthTx["Prisma Transaction (User + 3 Services)"]
  AuthTx -->|"Sets HMAC session cookie"| Dashboard["Pro Studio Dashboard (/dashboard)"]

  Tutor["Returning Educator"] -->|"Email or Google OAuth"| Login["Sign In (/login)"]
  Login --> Dashboard
  Dashboard -->|"Copies personal 1-Link"| Booking["White-Label Booking (/[slug])"]
  Dashboard -->|"Copies private passbook"| Passbook["Client Passbook (/p/[token])"]

  Client["New Client / Parent"] -->|"Opens slotlink.app/[slug]"| Booking
  Booking -->|"GET /api/availability"| FreeBusy["DB Conflicts + Google FreeBusy"]
  Booking -->|"POST /api/bookings"| BookingTx["Prisma Transaction (Upsert Student + Add Pack Hours + Create Booking)"]
  BookingTx -->|"Generates 128-bit magic link"| Passbook

  ReturningClient["Returning Client (?token=...)"] -->|"2-Tap Credit Redemption"| Booking
  Passbook -->|"Opens attached link"| StudySheet["Study Packet (/notes/[slug])"]
```

---

## 2. Flow 1 — 60-Second Tutor Onboarding & Studio Activation

```mermaid
flowchart TD
  Start["Tutor visits /login?mode=signup"] --> Form["Enter Name, Email, Specialty Tagline, Handle (/slug), 1h & 5-Pack Prices"]
  Form --> Submit["POST /api/auth/signup"]
  Submit --> Validate{"Zod + Reserved Slug + Uniqueness Check"}
  Validate -->|"400 / 409 Conflict"| ShowErr["Show inline handle/email validation message"]
  Validate -->|"Valid"| CreateTx["Prisma Transaction"]
  CreateTx --> CreateUser["Create User (TRIAL tier, work hours 13:00-20:00 UTC)"]
  CreateTx --> SeedServices["Create 3 starter Services (15m Intro Free, 1-on-1 Session, 5-Session Pack)"]
  CreateUser --> Cookie["Set signed HTTP-only slotlink_session cookie"]
  SeedServices --> Cookie
  Cookie --> LandDash["Redirect to /dashboard (3-Tab Workspace)"]
  LandDash --> Checklist{"Has clients or bookings?"}
  Checklist -->|"No (Empty Studio)"| QuickStart["Show Studio Quick-Start Bar: Copy /[slug], + Quick-Book First Client, Edit Services"]
  Checklist -->|"Yes (Active Studio)"| LiveQueue["Show Next Up Priority + Schedule & Queue"]
```

---

## 3. Flow 2 — Public 1-Link Booking & 2-Tap Credit Redemption

```mermaid
sequenceDiagram
  autonumber
  actor Client as "Client / Parent"
  participant Page as "/[slug] (BookingClient)"
  participant Avail as "GET /api/availability"
  participant Book as "POST /api/bookings"
  participant DB as "PostgreSQL (Prisma)"

  Client->>Page: "Opens /[slug] (or /[slug]?token=sl_...)"
  Page->>Avail: "Fetch open slots for selected service & date"
  Avail->>DB: "Query work hours, confirmed bookings & Google FreeBusy"
  Avail-->>Page: "Return timezone-aware openSlots[]"

  alt Returning client (?token= present & hoursRemaining > 0)
    Note over Page: "Collapses Name/Email into compact verified badge (2-Tap Credit Mode)"
    Client->>Page: "Step 01-02: Pick 1-on-1 slot -> Click Confirm (Use 1 Pack Hr)"
  else New visitor
    Client->>Page: "Step 01-03: Pick Service/Pack -> Date & Slot -> Name & Email"
  end

  Page->>Book: "POST booking payload + magicToken (if prefilled)"
  Book->>DB: "Check slot collision -> Transaction (upsert Student + credits + Booking)"
  DB-->>Book: "Return booking + 128-bit magicToken"
  Book-->>Page: "201 Created -> Render Booking Pass Ticket (.ics download + Copy Magic Link)"
```

---

## 4. Flow 3 — Prepaid Hour-Pack & Session Lifecycle State Machine

```mermaid
stateDiagram-v2
  [*] --> PackActive: "Client books 5-Session Pack (+5 hrs credited)"
  PackActive --> Confirmed: "Session scheduled (Booking CONFIRMED)"
  Confirmed --> Completed: "Tutor clicks Mark Done (Atomic -1 hr & notes saved)"
  Confirmed --> Confirmed: "Client reschedules (>= 24h before start)"
  Confirmed --> Cancelled: "Client cancels (>= 24h) or Tutor cancels (slot reopened)"
  Cancelled --> Confirmed: "Client books new slot with existing balance"
  Completed --> LowBalanceAlert: "hoursRemaining <= 1 hr"
  Completed --> PackActive: "hoursRemaining > 1 hr"
  LowBalanceAlert --> PackActive: "Client books new pack or Tutor adds +5 hr Pack"
```

---

## 5. Flow 4 — Zero-Login Client Passbook Self-Serve Loop (`/p/[token]`)

```mermaid
flowchart TD
  OpenPortal["Client opens private link /p/[magicToken]"] --> AuthToken{"128-bit Token Exists?"}
  AuthToken -->|"No"| NotFound["Render custom 404 screen"]
  AuthToken -->|"Yes"| RenderPassbook["Render White-Label Client Passbook"]
  RenderPassbook --> TopCard["Pack Balance Meter (5-block visual bar + hours remaining)"]
  TopCard -->|"Balance <= 1 hr"| LowWarn["Low Balance Banner -> Book / Renew Pack on /[slug]?token=..."]
  RenderPassbook --> Spotlight{"Has Next Upcoming Confirmed Session?"}
  Spotlight -->|"Yes"| NextCard["Next Session Spotlight Card"]
  NextCard -->|"Before call"| JoinMeet["Join Google Meet / Copy Meet / Download .ics"]
  NextCard -->|"Schedule changed (>= 24h)"| ReschedDrawer["Inline Reschedule Date & Slot Picker (PATCH /api/portal/[token]/bookings/[id])"]
  NextCard -->|"Cancel (>= 24h)"| CancelAction["Cancel & Reopen Tutor Slot"]
  RenderPassbook --> Vault["Study Vault & Homework Archive -> View Tutor Notes & Homework Link"]
```

---

## 6. UX Friction Audit & Streamlining Summary

| Flow & Route | Friction Found Before | Streamlined Experience Implemented |
| :--- | :--- | :--- |
| **Tutor Studio (`/dashboard`)** | Long vertical stack showing Queue, full Clients table, and Settings/Preview cards mixed together; raw `toLocaleString()` timestamps with seconds; no student pack balance visible on session rows. | Split into **3 focused workspace tabs** (`Schedule & Queue`, `Clients & Pack Balances`, `Services & Settings`), added a **Studio Quick-Start Bar** for new studios, clean formatted timestamps, and live student balance pills (`X hrs left` + `Passbook ↗`) directly inside session cards. |
| **Client Booking (`/[slug]`)** | Returning students opening `/[slug]?token=...` still had to stare at full Name & Email form fields after already being identified; long step transitions without inline selection pills. | Added compact **Returning Client Credit Mode**: Step 03 collapses Name & Email into a single verified identity pill (`Booking as Alex Rivera · Edit`), turning returning credit bookings into a **2-tap flow** while adding inline step summary badges on Steps 01–03. |
| **Client Passbook (`/p/[token]`)** | Next upcoming session sat inside the mixed chronological history list beneath the Study Vault, forcing clients about to join a call to hunt for their Meet link. | Promoted a dedicated **Next Upcoming Session Spotlight** card directly beneath the passbook balance card with immediate **Join Google Meet**, **Reschedule**, **.ics**, and **Cancel** buttons. |
