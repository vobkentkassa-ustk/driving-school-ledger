# Revised Plan: Driving School Accounting (Cashing), Frontend Phase

Planning only. No files change, and no backend is connected, until you approve this plan.

## 1. Verified repository architecture

Checked directly in this Lovable project's files (package.json, vite.config.ts, src/):

| Item | Verified value |
| --- | --- |
| Framework | TanStack Start `1.168.60` (React full-stack, server rendering) |
| React | `^19.2.0` |
| Build tool | **Vite `8.1.5`**, not Vite 7 as I said before. Configured through `@lovable.dev/vite-tanstack-config` |
| Routing | TanStack Router `1.170.41`: file-based routes in `src/routes/`, generated `routeTree.gen.ts`. No React Router |
| Styling | Tailwind CSS `^4.2.1`, configured in `src/styles.css`. No `tailwind.config.js` |
| UI kit | shadcn/ui, with 46 components already in `src/components/ui` |
| Data, forms, other | TanStack Query, react-hook-form, zod, date-fns, recharts, sonner |
| Server build target | nitro with **Cloudflare Workers** as the default target. Not Vercel |
| Entry points | `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx` (still the placeholder), `src/start.ts` (error handling and cross-site request protection), `src/server.ts` |
| Scripts | `dev`, `build`, `lint`, `format`, `test` (vitest), `test:watch` |
| Tests | Vitest + jsdom + Testing Library. One existing routing test, `src/test/app-routing.test.tsx` |
| Backend | None connected |

Unknowns I cannot resolve from here:
- **Git connection.** I cannot see whether this project is linked to a repository. I can only read Lovable's copy, which is a fresh template with no product code yet. You can check under Project settings → Git.
- **Conflict with the existing Cashing repository.** The Cashing plan describes an existing **Next.js** repository with admin and mentor screens. This Lovable project is not that repository and contains none of that code. Lovable cannot attach to an existing repository; connecting always creates a new one. So the options are:
  - **A.** Build fresh here on TanStack Start, using the Next.js repository as reference only. This is the recommended option and matches "do not migrate or merge v0 code".
  - **B.** Keep the Next.js repository as the real product and use Lovable only for design exploration.

  I will assume **A** unless you say otherwise.
- **The existing Next.js types and mock data are not visible here**, so the "adapt existing types" rule cannot apply yet. New types will follow the Cashing data contracts (section 6 of that plan).

All of the verified architecture stays as it is: no new router, no framework change, and no rewriting of unrelated files.

## 2. Integration implications (decisions deferred)
- The spec's Vercel `/api/*` functions map to TanStack server functions or routes running on Cloudflare Workers. Workers do not run Node-only libraries. In particular, ExcelJS and Telegram bot libraries need checking before the backend phase.
- Supabase is compatible in principle. Lovable Cloud gives one managed database. The spec's separate dev and prod projects plus a CLI migration flow from Codex is a different workflow, and you need to choose between them.
- Telegram login: minting sessions on the server is feasible inside server functions. The Telegram Login Widget needs a fixed HTTPS domain.
- The spec says Vercel hosting, but this template builds for Workers. Changing the target is possible later; it does not affect the frontend phase.
- **Nothing is connected** until you approve an architecture.

## 3. Authoritative specification and reconciliation
The Driving School project plan is the product authority. The Cashing plan adds stricter rules and data contracts, and I include them. Where the two overlap, the new data model holds both:
- Mentor payment requests: DRAFT → PENDING → APPROVED | REJECTED (main spec).
- Cash transactions, student account entries, debts, and settlements, including settlement methods (Cashing).

These must be tied together in the Money Rules before the backend phase. Open questions from the previous plan still apply, especially transit vs debt, remaining balance on gross vs net, the exact amounts and timing of the salary deduction (its direction is fixed by rule 6), and the apostrophe style.

## 4. Product acceptance criteria (cover the whole frontend phase)
1. No monthly tuition billing, recurring charges, automatic monthly invoices, or monthly scheduler anywhere: no screens, types, or services.
2. No debt-forgiveness or delete action on debts. Corrections only as an auditable adjustment or reversal type.
3. Settlement supports full and partial amounts. An amount that is empty, ≤ 0, or above the outstanding balance is rejected with an Uzbek error.
4. Settling a student-linked debt is one operation (`settleDebt`). Its result updates the debt, credits the linked student account (`debt_settlement_credit`), and adds a "Qarz yopildi" history entry. No second manual payment is needed.
5. An `organization_budget` settlement creates no cash-income transaction.
6. `salary_deduction` is a separate settlement method from `personal_repayment` in the types, the UI, and the mock results. **Corrected rule:** "A salary deduction keeps the related debt the mentor owes the organization in place. Where the original debt is student-related, it credits the linked student account. It is never treated as a personal cash repayment or as new cash income." In the frontend phase this rule appears only in the domain types and mock examples: an example mentor debt that stays open after a salary deduction, plus a linked `debt_settlement_credit` entry for the student, with no cash transaction. No real accounting calculation or financial write is built until the full Money Rules are approved.
7. `personal_repayment` is recorded as a cash repayment from the mentor and is never merged with `salary_deduction`.
7. Reports and filters use `effectiveDate`. `createdAt` is shown separately in details. A backdated entry does not appear in today's report.
8. The under-30% warning appears only when all of these hold: the contract is valid, the group start date is known, the start date is today or earlier, and the paid amount is below 30% of the contract. No warning for an unknown or future start.
9. Mentor mock services return only that mentor's own students and transactions and their personal debt. Never other mentors' data, organization or transit debts, or school-wide totals.
10. All visible text, errors, mock names, labels, and statuses are in Uzbek.
11. Remaining debt is shown in red as the main amount. The original total appears only in details.

Rules 3, 5, 7, 8, and 9 get unit tests against the mock services and helpers. They are presentation behavior until the server enforces them.

## 5. Corrected modular roadmap (frontend only, mock data)
1. **Foundation**: tokens, Uzbek labels, formatters, domain types, mock services, foundation preview. *This is the first task.*
2. App shells: Admin sidebar layout, Mentor mobile layout, mock role switcher, Pending/Blocked/404/Session-expired screens.
3. Admin dashboard.
4. Groups grid and group form, including start date (can be unknown) and contract price.
5. Students list and profile: account entries, under-30% warning.
6. Ledger / cash transactions: filters by effective date, details showing both dates.
7. Pending requests review (mock approve/reject).
8. Mentor drafts: form, selection, send bar.
9. Debts list and settlement dialog (rules 3–6).
10. Mentor "My students" and "My debts" (rule 9).
11. Group transfer modal, audit drawer, users page.
12. States and polish: loading, empty, error, mobile review.

Gated for later, each needing separate approval: Money Rules sign-off, architecture/backend choice, schema and security rules, Telegram login, server operations, bot, exports.

## 6. First task: exact files

Create:
- `src/i18n/uz.ts`: navigation, statuses (payment, debt, settlement method, user), common actions, validation errors, money/date words
- `src/lib/format.ts`: `formatMoney`, `formatDate`, `formatDateTime`
- `src/lib/format.test.ts`
- `src/types/domain.ts`: the types from Cashing section 6, plus `PaymentRequest` (DRAFT/PENDING/APPROVED/REJECTED), `Group` (startDate nullable), `Student`, `Mentor`, `User` (role and status)
- `src/mocks/data.ts`: realistic Uzbek sample data, including a partly settled debt, a future-start group, a group with an unknown start, and a backdated entry
- `src/mocks/services.ts`: async typed read functions (`listDebts`, `listCashTransactions`, `listGroups`, `listStudents`, `getStudentAccount`, `listMentorTransactions(mentorId)`). Read-only in this task.
- `src/mocks/services.test.ts`: mentor scoping (rule 9) and effective-date filtering (rule 7)
- `src/components/shared/StatusBadge.tsx`, `src/components/shared/Money.tsx`

Modify:
- `src/styles.css`: replace the default color values with project tokens (surface, primary, success, warning, danger, info) in light and dark
- `src/routes/__root.tsx`: font link, `lang="uz"`, app-specific default page title (no "Lovable App")
- `src/routes/index.tsx`: replace the placeholder with a small foundation preview (color tokens, status badges, formatted amounts and dates) with its own page title
- `AGENTS.md`: append rules (TanStack Router only; all UI strings in `uz.ts`; screens use services, never mock arrays directly; no authoritative money calculations in the client) and keep the Lovable block intact
- `src/test/app-routing.test.tsx`: only if the routing test checks the placeholder text

Not touched: router, start/server files, Vite config, shadcn components, package.json (no new dependencies).

## 7. First-task acceptance criteria
- Limited to tokens, Uzbek labels, formatters, domain types, read-only mock services, two shared components, and the preview page.
- `formatMoney(12450000)` returns `12 450 000 so'm`, `formatDate` returns `DD.MM.YYYY`, and `formatDateTime` returns `DD.MM.YYYY HH:mm`.
- Every status renders an Uzbek label with its token color in light and dark. No hardcoded colors in components.
- No English text is visible on the preview page.
- No backend, database, login, or financial write is added. No new packages.
- The types contain no monthly-billing or forgiveness concepts.

Verification steps:
1. `bunx vitest run` passes, including the format and service tests.
2. The latest build log shows "build OK".
3. A headless browser screenshot of `/` in light and dark themes, checked for Uzbek-only text and correct badges.
4. Search the code for `Lovable App`, monthly-billing terms, and color utilities like `bg-white` or `#`: no hits in new files.
