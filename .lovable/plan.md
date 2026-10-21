# Driving School Accounting — Analysis and Frontend Roadmap

Planning only. Nothing is built until you approve.

## 1. Roles and screens

Roles: **Admin** (full accounting, approvals, ledger, debts, groups, users) and **Mentor** (drafts, submitting payment requests, own students, own debts). Plus non-data states: **Pending approval** and **Blocked**. An optional **Accountant** role (read-only plus export) is still an open question.

Admin, desktop-first:
- Boshqaruv paneli (Dashboard): KPIs, recent payments, revenue chart, group status
- Kutilayotgan so'rovlar (Pending requests): approve or reject with a comment. This screen is missing from the wireframes.
- Daftar (Ledger): filters kept in the URL, server-side table, action menu, Excel export
- Guruhlar (Groups): card grid, create/edit modal
- Qarzlar (Debts): 3 tabs and a settlement modal
- O'quvchi profili (Student profile) modal, Guruh almashtirish (group transfer) warning modal, Audit drawer
- Foydalanuvchilar (Users): approve or block mentors

Mentor, mobile-first:
- Qoralamalar (Drafts): form, selectable list, floating "send" bar
- Mening o'quvchilarim (My students), Mening qarzlarim (My debts)

Auth and system screens: Telegram login landing, Pending, Blocked, Access denied/404, Session expired.

## 2. Non-negotiable financial rules
- Money is stored as integer so'm (or NUMERIC(14,2)), and every amount must be > 0.
- Net amount and graduation date are derived (`gross − SUM(transits)`). They are never stored values that can drift out of sync.
- Payment status can only move DRAFT → PENDING → APPROVED | REJECTED, and the server enforces this. Approved payments cannot be changed except through an audited edit.
- Financial records are never hard-deleted. They use soft delete (`deleted_at`).
- A debt's status comes from the `debt_settlements` rows. Each settlement records who, when, and how much.
- Group transfers write a history row (old and new price, who, when). The server calculates the price difference.
- Every money calculation runs in SQL views or functions. The frontend only displays results.
- Batch submission is one transactional call. Financial actions wait for the server to confirm; they never update the screen ahead of it.
- Money is shown as `12 450 000 so'm` and dates as `DD.MM.YYYY HH:mm`, through one shared helper.

## 3. Security requirements
- Row-level security on every table. Mentors see only their own students, drafts, and debts, and cannot approve. Pending or blocked users get no data.
- Login is through Telegram only. The server checks Telegram's signature or a one-time token (single use, about 5 minutes). It never trusts a Telegram ID sent from the browser.
- Audit logs are written by database triggers and cannot be updated or deleted. They record where an action came from (web or bot).
- Privileged keys stay on the server only. Blocking a user ends their sessions immediately.
- Hiding things in the UI is only a convenience. Real protection comes from the database and the server.

## 4. Ambiguities to resolve before real money operations
1. Transit vs debt: does a transit reduce ledger revenue? When a debt is repaid, does it come back as new income, and on which date?
2. Who can create transits: Admin only, or can mentors propose them?
3. Is "remaining balance" calculated as contract minus approved **gross** or minus **net**?
4. Rejected payments: can the mentor edit and resubmit, or must they create a new draft?
5. Currency is UZS only? Are discounts or refunds needed?
6. Is an Accountant role needed?
7. Which events send bot notifications?
8. Expected volume: students, payments per month, mentors?
9. Uzbek Latin only? Russian later? Which apostrophe style: `o'` or `o‘`?
10. Conflicts between the references: the mockups show USD ($), "Card/Stripe", English labels, and a "Messages" tab, which is not in the spec. The spec wins: so'm, Uzbek labels, no Messages tab. The payment-method list still needs defining (cash, card, transfer?).
11. The dashboard mockup has a "To'lovni tasdiqlash" quick action. Approval should open the Pending requests screen; it should not approve inline.

## 5. Using the reference images
- Use them for layout and visual tone only: left sidebar, KPI cards, rounded cards with status pills, group card grid with a capacity bar, and a mobile drafts list with a bottom sheet form, sticky send bar, and bottom navigation.
- Do not copy their text, currency, sample names, or the extra nav items (Messages, Instructors, Settings). Every label comes from the Uzbek label file.
- Status colors: green = approved/active, amber = pending, red = rejected, grey = finished/draft. Defined as design tokens with light and dark themes.
- Do not embed the images as app assets.

## 6. Compatibility risks (important)
- **This project is TanStack Start (React 19 + Vite 7 + TypeScript + Tailwind v4 + shadcn/ui) with TanStack Router. It is not a plain Vite SPA with React Router.** React Router cannot be added. Routes are files in `src/routes`, and `/admin/*` and `/mentor/*` become route folders. It still meets the "React + Vite + TS + Tailwind + shadcn" direction.
- The hosting target is an edge runtime (Cloudflare-style Workers), not Vercel. The spec's `/api/*` Vercel functions would instead be TanStack server functions or server routes. This needs your decision before the backend phase. Do not create both.
- Pages are rendered on the server first, so browser-only libraries (charts, Excel) must load only in the browser.
- Lovable's backend is Lovable Cloud. The spec's separate dev and prod Supabase projects plus a Codex migration flow needs a decision before any tables exist. Nothing is connected in this phase.
- v0 or Next.js code will not be merged. It is used as visual reference only.
- Tailwind v4 is configured in `src/styles.css`, not in `tailwind.config.js`.

## 7. Implementation roadmap (small, reviewable steps)
1. **Foundation**: design tokens (light/dark), font with Uzbek characters, Uzbek label file, money/date formatters with tests, domain types, typed mock service.
2. **Shells**: Admin layout (sidebar + topbar) and Mentor layout (mobile bottom nav), mock role switcher, auth/system screens.
3. Admin Dashboard (mock data).
4. Groups grid and create/edit modal (UI only).
5. Ledger: URL filters, table, pagination (mock).
6. Pending requests review screen (mock approve/reject).
7. Mentor Drafts: form, selection, send bar (mock).
8. My students and My debts.
9. Debts tabs and settlement modal (UI only).
10. Student profile, group transfer modal, audit drawer.
11. Users page.
12. Polish: empty, loading, and error states, mobile review.

Later, each only after a separate review: Money Rules and schema v2, database and security rules, Telegram auth, server operations, bot, exports.

## 8. Proposed folder structure
```text
src/
  routes/                 file-based routes
    index.tsx             login landing
    pending.tsx  blocked.tsx  session-expired.tsx
    admin.tsx             AdminLayout (Outlet)
    admin/index.tsx  ledger.tsx  requests.tsx  groups.tsx  debts.tsx  users.tsx
    mentor.tsx            MentorLayout (Outlet)
    mentor/index.tsx (drafts)  students.tsx  debts.tsx
  features/               ledger, groups, debts, students, drafts, users, auth
    <feature>/components, hooks, queries.ts
  components/
    ui/                   shadcn
    shared/               KpiCard, StatusBadge, Money, DataTable, EmptyState, FilterBar
  layouts/                AdminSidebar, MentorBottomNav, Topbar
  mocks/                  data.ts, services.ts (typed, async, swappable)
  lib/                    format.ts (money/date), utils.ts
  i18n/uz.ts              all UI strings
  types/domain.ts         Payment, Student, Group, Debt, User, statuses
```

## 9. First build task: Foundation (step 1)
Scope:
- Design tokens in `src/styles.css`: neutral surfaces, a deep navy primary, plus success, warning, danger, and info. Light and dark versions.
- A font with Uzbek Latin support, loaded from the root head.
- `src/i18n/uz.ts` with nav, status, and common action labels.
- `src/lib/format.ts`: `formatMoney(12450000)` → `12 450 000 so'm`, plus `formatDate` and `formatDateTime`.
- `src/types/domain.ts` with the status unions (DRAFT/PENDING/APPROVED/REJECTED, debt and user statuses).
- `src/mocks/` with realistic Uzbek sample data and async mock services. No calculations beyond display.
- Shared `StatusBadge` and `Money` components.
- Replace the placeholder home page with a simple "foundation preview" page showing the tokens, badges, and formatted amounts, with real page titles.

Acceptance criteria:
- No database, real login, or backend connection is added.
- Every user-visible string comes from `uz.ts`. There is no English UI text.
- `formatMoney` and `formatDate` have passing unit tests: thousands separated by spaces, "so'm" suffix, `DD.MM.YYYY`.
- Each status shows its correct Uzbek label and color in both light and dark themes.
- No hardcoded colors in components; all colors come from tokens.
- Mock services return typed data through async functions, so they can be swapped later.
- The app builds cleanly, the home page no longer shows the placeholder, and page titles are app-specific.
- `AGENTS.md` records the rules: TanStack Router only, money logic never in the client, all strings in `uz.ts`.
