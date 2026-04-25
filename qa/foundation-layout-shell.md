# QA — foundation layout shell

**Task ID:** 1.2
**Branch:** feature/foundation-layout-shell
**QA:** claude-qa
**Date:** 2026-04-24
**Verdict:** ✅ PASS (manual smoke — Playwright pending Epic 4.1)

---

## Flows expected (from `agents/qa.md`)

- F-02 nav links scroll to their sections
- F-07 keyboard nav, focus visible
- F-08 mobile nav opens/closes

## Smoke checks performed

| Check | Result | Method |
| --- | --- | --- |
| `npm run build` | ✅ | CLI |
| Page renders without console errors | ✅ | Manual, dev server |
| Nav logo scrolls to top via `#top` anchor | ✅ | Manual |
| Nav section links present and ordered (about → contact) | ✅ | DOM inspect |
| Hamburger visible below `md`, hidden ≥ `md` | ✅ | DevTools viewport toggle |
| Mobile drawer opens on tap, closes on link tap & Escape | ✅ | Manual |
| Footer links all have `aria-label` and point to profile.ts URLs | ✅ | DOM inspect |
| Focus ring visible on Tab through nav + footer | ✅ | Manual keyboard |
| No horizontal overflow at 360 / 768 / 1280 | ✅ | DevTools |
| Reduced-motion: section fade-in instantly snaps | ✅ | DevTools rendering emulator |

## Outstanding

- F-02/F-07/F-08 will be formalized as Playwright specs in Epic 4.1. This branch is manually verified.
- Reviewer S-1 (focus trap in mobile menu) is a SHOULD; deferred to pre-Epic 3.4.

## Regressions

None. Epic 1.1 visuals still correct.

---

🤖 QA by claude-qa
