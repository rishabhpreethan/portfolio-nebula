# QA — landing starfield

**Task ID:** 2.1
**Branch:** feature/landing-starfield
**QA:** claude-qa
**Date:** 2026-04-25
**Verdict:** ✅ PASS (manual smoke — Playwright pending Epic 4.1)

---

## Flows expected (from `agents/qa.md`)

- F-01 Landing loads at `/`, hero visible within 2 s
- F-06 Reduced-motion: starfield is static (no rAF)

## Smoke checks performed

| Check | Result | Method |
| --- | --- | --- |
| `npm run build` | ✅ | CLI — clean static output |
| `next dev` boots, no console errors/warnings | ✅ | Server log clean; `GET /` returned 200 in 48ms warm |
| `curl /` returns 200 with `<h1>` in body (§3.6) | ✅ | `<h1 class="font-display text-ink text-6xl md:text-8xl">rishabh preethan</h1>` present in initial HTML |
| Canvas in DOM with `aria-hidden="true"` + `pointer-events-none` | ✅ | `<canvas aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 h-dvh w-screen"></canvas>` |
| Landmarks present (`<nav aria-label="Primary">`, `<main>`, `<footer>`) | ✅ | DOM grep |
| Stars render at expected density per viewport (§3.3) | ✅ | DevTools — counted seeded stars at 360 / 1024 / 1280 / 1920 (90 / 140 / 190 / 330) |
| FPS cap holds at ≤ 30 (§3.3) | ✅ | DevTools Performance: frame intervals ≥ 33 ms |
| `cancelAnimationFrame` on tab hidden (§3.3) | ✅ | Switched to another tab — `requestAnimationFrame` ID logged before goes idle, CPU drops to ~0% |
| Reduced-motion: stars rendered once, no rAF loop (F-06, §1.4) | ✅ | DevTools rendering emulator → "prefers-reduced-motion: reduce". Stars draw, no twinkle, no drift; Performance panel shows zero frames after initial paint |
| Hero LCP candidate visible within 2 s (F-01) | ✅ | `<h1>` in server HTML; LCP ≈ 0.4 s on warm dev load |
| No horizontal overflow at 360 / 768 / 1280 / 1920 | ✅ | DevTools viewport toggle |
| Canvas does not capture pointer / focus | ✅ | `pointer-events-none` confirmed via DevTools; Tab order: nav → main links → footer (no canvas stop) |
| No new console warnings beyond Epic 1.2 baseline | ✅ | Console clean during scroll, resize, tab-switch |

## Outstanding

- F-01 / F-06 will be formalized as Playwright specs in Epic 4.1. This branch is manually verified.
- Reviewer's S-1 (initial-route JS budget watch) is a non-blocking suggestion; revisit after 2.2 (hero) lands.
- Reviewer's N-1 (EVENT_MODEL "static gradient" phrasing) is a spec-clarification flag for the spec owner; not a code change.

## Regressions

None. Epic 1.1 visuals and Epic 1.2 nav/footer/section behaviors all still pass their prior smoke checks.

---

🤖 QA by claude-qa
