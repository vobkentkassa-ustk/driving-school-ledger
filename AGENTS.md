<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules (Avtomaktab Kassa)
- Routing is TanStack Router file routes in `src/routes`; never add React Router or migrate frameworks — the template's architecture is fixed.
- Every user-facing string lives in `src/i18n/uz.ts` (Uzbek only) — so copy can be corrected in one place.
- Screens read data through typed async services (`src/mocks/services.ts` now, a real adapter later), never import mock arrays — so the backend can be swapped without touching screens.
- No authoritative money calculations or financial writes in the client; display server-supplied values — financial integrity belongs to the backend.
- Money and dates are formatted only via `src/lib/format.ts` — one consistent format.
- Colors come only from tokens in `src/styles.css` — keeps light/dark theming consistent.
- Workspaces are layout routes `/admin` and `/mentor` (src/components/shell); the role switcher is navigation only and grants nothing — real access control belongs to the backend.
- Per-page metadata uses `pageHead()` from `src/lib/head.ts` — consistent titles.
- Dashboard reads use a shared Query option primed by the route loader; its adapter supplies literal mock monetary totals and separate cash/internal DTOs so screens never calculate financial summaries.
