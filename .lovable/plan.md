# Avtomaktab Kassa — Master Build Roadmap (tailored to this workspace)

Based on your uploaded master roadmap, the two earlier plans, and the approved Phase 1 work. Your roadmap stays the authority; this version maps it onto what already exists here. After approval I save it as the project roadmap file and work through it one phase at a time, stopping for your review after each phase.

## 1. Where we are
- Phase 1 (Foundation) done: Uzbek labels, soʻm formatting, dates, domain types, mock data and services, Money and StatusBadge, preview page. 13 tests passing, build OK.
- Git: Lovable's internal storage only; GitHub not linked. Check before large code grows (Project settings → Git).
- No backend, login, database, or real money writes. Stays that way through Phase 13.

## 2. The 5 color tokens and what each means (fixed for every screen)

| Token | Meaning in the app | Used for |
| --- | --- | --- |
| primary (dark blue) | Main actions, active navigation | Buttons, sidebar active item, links |
| success (green) | Real cash coming in, approved | Kirim amounts, "Tasdiqlangan", "Yopilgan" |
| warning (amber) | Needs attention, waiting | "Kutilmoqda", "Qisman yopilgan", under-30% warning |
| danger (red) | Money still owed, rejected, cash out | Qolgan qarz (always red + text label), "Rad etilgan", Chiqim |
| info (blue) | Internal movements that are not cash | Debt settlement, student credit, salary deduction, transit |

Rule: cash (success/danger) and internal settlement (info) never share a color, so a settlement can never look like new income. Colors always come with a text label, never color alone. Both light and dark versions already exist.

## 3. Phases (each ends with: files changed, tests, build, desktop + mobile screenshots, stop for approval)

2. **App shells and navigation** — admin sidebar (desktop), mentor bottom bar (mobile), mock role switcher marked "sinov uchun", pending / blocked / access-denied / session-expired / 404 pages. Empty placeholder pages for every nav item so no link is dead. Checked at 1440, 1024, 768, 375 px.
3. **Admin dashboard** — visible period, Kirim / Chiqim / kassa qoldig'i (success/danger), outstanding debt (danger), pending count (warning), recent operations, group status. Settlements shown as info, not counted as cash.
4. **Kassa daftari (ledger)** — table, search, date range by effective date, type filter, reset, empty state, detail drawer showing both dates; mock cash-entry form.
5. **Debts list and detail** — tabs by category, outstanding as main red figure, original/settled in details, settlement history; no delete/forgive.
6. **Settlement dialog (mock)** — full/partial, amount checks (empty, ≤0, over balance), three distinct methods, preview of remaining, double-submit guard, simulated failure/stale balance; one mock result updates debt, student credit and history.
7. **Students and account history** — list, profile, account ledger, admin backdated payment UI, exact under-30% rule.
8. **Groups and transfer** — card grid, unknown start date shown as "Nomaʼlum", create/edit, transfer preview (no client posting).
9. **Mentor workspace** — drafts form, select + batch send bar, own students, own debts; no school totals or transit debts.
10. **Pending requests and users** — approve / reject with comment, user approve/block, status flow DRAFT → PENDING → APPROVED | REJECTED only.
11. **Operation history** — admin audit drawer linking settlement → debt → student credit → history event.
12. **Polish and QA** — keyboard, contrast, focus, loading/empty/error states, all widths, Uzbek-only text.
13. **Release candidate** — audit that screens use services only, document the future backend contract, pass/fail report.

Production work (Money Rules, backend choice, database, Telegram login, bot, exports, launch) is a separate track, each needing its own approval. The 12 Money Rules questions in your roadmap section 6 stay open and are never guessed.

## 4. Working protocol
- One phase per approval; small focused changes; fix only verified defects between phases.
- Reference images: layout cues only; no English, dollars, or extra tabs.
- New rules you care about (amount limits, scoping, 30% rule, effective date) get a small test.

## 5. Approved clarifications
- Keep TanStack Start/Router, React, Vite, TypeScript, Tailwind v4. No framework migration, no v0/Next.js code.
- The five color meanings sit inside the full design system (spacing, typography, surfaces, borders, focus states, light/dark tokens), and that whole system stays as it is.
- The role switcher and mentor data scoping are demonstration only. They are not real security.
- GitHub stays deferred. Never call the project synced until the repository and branch are verified.
- Nothing new without separate approval: no backend, database, real login, money writes, or dependencies.

## Technical details
- Create `roadmap.md` at project root with this phase list as checkboxes, the clarifications, and a short status log (phase, files, tests/build, open issues, Git status: not verified).
- Save the token meanings and the design-system rule to project memory.
- Phase 2 does not start with this approval. I stop after saving and report files changed and any issues.
