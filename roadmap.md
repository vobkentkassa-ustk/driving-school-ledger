# Avtomaktab Kassa — Roadmap

Approved 24.10.2026. Each phase ends with: files changed, tests, build, desktop + mobile screenshots, then stop for approval.

## Clarifications (approved)
- Keep TanStack Start/Router, React, Vite, TypeScript, Tailwind v4. No framework migration, no v0/Next.js code.
- Five financial color meanings (primary actions, success cash-in/approved, warning pending, danger owed/rejected/cash-out, info internal non-cash). The full design system stays as it is: spacing, typography, surfaces, borders, focus states, light/dark tokens.
- Role switcher and mentor data scoping are demonstration only, not real security.
- GitHub deferred. Never call the project synced until the repository and branch are verified.
- No backend, database, real login, financial writes, or new dependencies without separate approval.

## Phases
- [x] 1. Foundation
- [x] 2. App shells and navigation
- [x] 3. Admin dashboard
- [x] 4. Kassa daftari (ledger)
- [ ] 5. Debts list and detail (in progress)
- [ ] 6. Settlement dialog (mock)
- [ ] 7. Students and account history
- [ ] 8. Groups and transfer
- [ ] 9. Mentor workspace
- [ ] 10. Pending requests and users
- [ ] 11. Operation history
- [ ] 12. Polish and QA
- [ ] 13. Release candidate and backend contract

Separate production track (each needs its own approval): Money Rules, backend choice, database, Telegram login, bot, exports, launch. The 12 Money Rules questions stay open.

## Status log
- 24.10.2026: Phase 1 accepted. 13 tests passing, build OK. Roadmap saved. Git: not verified (GitHub not linked). Open: apostrophe style, English text on the emergency server-error page, no dark-mode toggle, Money Rules questions.
- 25.10.2026: Phase 2 built. Home page = role chooser; design preview moved to /dizayn. Admin shell (sidebar, phone menu) with 7 placeholder pages; mentor shell (bottom bar) with 3 placeholder pages; 4 status pages. Demo role switch is navigation only, no security. 28 tests passing, build OK. Git: not verified.
- 26.10.2026: Phase 3 built; stopped for review. October 1–26 demonstration snapshot: cash in 3 300 000 soʻm, cash out 500 000 soʻm, opening balance 1 500 000 soʻm, closing balance 4 300 000 soʻm, outstanding debt 5 000 000 soʻm, 1 pending request. Internal settlements remain separate and excluded from cash totals. Files: dashboard page/query, admin index route, domain DTO, Uzbek labels, mock snapshot/services, dashboard tests, AGENTS.md and roadmap.md. 31 tests passed; automatic build OK. Browser: role chooser → dashboard → ledger/requests/groups; light/dark and 1440/1024/768/375 widths verified, no overflow or runtime errors. No backend, real auth, financial writes, dependencies or architecture changes. GitHub remains unverified; Phase 4 waits for approval.
- 27.10.2026: Phase 4 completed; stopped for review. Cash-only ledger with URL search/date/type filters, reset, empty state, detail sheet showing effective date and creation time, and an unsaved entry preview. Files: src/components/ledger/{query.ts,CashLedgerPage.tsx,LedgerDetails.tsx,CashEntryForm.tsx}, src/routes/admin.daftar.tsx, src/lib/ledger.ts, src/mocks/{services.ts,ledger.test.ts}, src/types/domain.ts, src/i18n/uz.ts, src/components/ui/sheet.tsx (Uzbek close label), AGENTS.md, roadmap.md. All 36 tests passed; automatic build OK at 07:01:59 UTC. Browser verified date/search/type filtering, empty/reset, backdated details, invalid form input, valid preview and unchanged 4 ledger rows; light/dark and 1440/1024/768/384/375 widths, no overflow or runtime errors. No backend, database, authentication, financial writes, dependencies or architecture changes. Limitations: demo form never saves; exports and real accounting remain deferred; GitHub unverified. Phase 5 waits for approval.
