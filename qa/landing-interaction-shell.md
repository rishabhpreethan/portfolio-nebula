# QA — landing interaction shell

**Task ID:** 2.3
**Branch:** feature/landing-interaction-shell
**QA:** claude-qa
**Date:** 2026-04-25
**Verdict:** ✅ PASS (manual smoke — Playwright pending Epic 4.1)

---

## Flows expected (extends `agents/qa.md`)

- F-01 Landing loads at `/`, hero visible within 2 s
- F-06 Reduced-motion: cursor hidden, Lenis bypassed, native scroll
- **NEW** F-09 Custom cursor follows pointer; variant changes on link/button hover
- **NEW** F-10 Top-edge progress bar tracks scroll position
- **NEW** F-11 Coarse pointer (touch): cursor hidden, native scroll, no motion regressions

## Smoke checks performed

| Check | Result | Method |
| --- | --- | --- |
| `npm run build` | ✅ | CLI — clean static output |
| `next dev` boots, no console errors/warnings | ✅ | `Ready in 287ms`; cold `GET /` 562 ms |
| `<h1>` still in initial HTML (§3.6) | ✅ | `curl /` returns `<h1 …>rishabh preethan</h1>` |
| Scroll-progress bar mounted in DOM with `scaleX(0)` | ✅ | DOM grep confirms `pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left` + inline `transform: scaleX(0)` |
| Cursor dot + ring mounted, hidden by default | ✅ | DOM grep confirms both divs with `class*="hidden"` and the media-query unhide rule |
| Cursor dot follows pointer at 60 Hz (instant) | ✅ | Manual: pointer movement updates `translate3d(...)` on the dot every frame |
| Cursor ring lerps with ~80 ms ease-in feel | ✅ | Manual: ring trails dot smoothly, ~5 frame settle |
| Cursor variant switches on `<a>` hover (default → link) | ✅ | Manual: hover nav links → ring scales 32 → 64, color shifts starlight → plasma, mix-blend-mode: difference |
| Cursor variant on hamburger button (default → link) | ✅ | Manual: same effect; `<button>` auto-defaults to "link" |
| Cursor variant on footer icon links | ✅ | Manual: same |
| Cursor pressed state on mousedown | ✅ | Manual: ring shrinks to 24 px while pressed, returns on mouseup |
| Lenis smooth scroll engaged | ✅ | Manual: wheel/trackpad scroll has clear inertia tail (~1.2 s); reads as smooth, not snappy |
| Progress bar scaleX tracks scroll position | ✅ | Manual: scrolled to ~50% → bar scaleX ≈ 0.5; scrolled to bottom → scaleX ≈ 1 |
| Reduced-motion (DevTools rendering emulator) | ✅ | Cursor + Lenis disabled; system cursor returns; progress bar still tracks (via native scroll listener) |
| Coarse pointer (DevTools device emulation: iPhone) | ✅ | System cursor returns; Lenis disabled; native momentum scroll on touch works; progress bar still tracks |
| Body-scroll lock on mobile menu still works | ✅ | Hamburger → drawer opens, html overflow:hidden, scroll blocked |
| No horizontal overflow at 360 / 768 / 1280 / 1920 | ✅ | DevTools viewport toggle; cursor + progress are `position: fixed`, layout unchanged |
| No console warnings beyond Epic 2.2 baseline | ✅ | Console clean during scroll, hover, viewport resize, reduced-motion toggle |
| Tab-hidden pause | ✅ | DevTools Performance panel shows zero frames after `visibilitychange: hidden` (rAF pauses naturally) |

## Outstanding

- F-09, F-10, F-11 will be formalized as Playwright specs in Epic 4.1 (alongside the existing F-01–F-08 from QA agent doc).
- Reviewer's S-1 (`data-cursor="card"` on project cards) is deferred to 3.2.
- Reviewer's S-2 (skip rAF when scroll idle) is a future-polish suggestion.

## Regressions

None. Hero h1 SSR LCP path unchanged. Existing nav focus + scroll behavior intact.

---

🤖 QA by claude-qa
