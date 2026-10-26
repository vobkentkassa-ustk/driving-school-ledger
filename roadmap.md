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
- [ ] 3. Admin dashboard (authorized 26.10.2026; in progress)
- [ ] 4. Kassa daftari (ledger)
- [ ] 5. Debts list and detail
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
