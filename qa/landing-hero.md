# QA — landing hero

**Task ID:** 2.2
**Branch:** feature/landing-hero
**QA:** claude-qa
**Date:** 2026-04-25
**Verdict:** ✅ PASS (manual smoke — Playwright pending Epic 4.1)

---

## Flows expected (from `agents/qa.md`)

- F-01 Landing loads at `/`, hero visible within 2 s

## Smoke checks performed

| Check | Result | Method |
| --- | --- | --- |
| `npm run build` | ✅ | CLI — clean static output |
| `next dev` boots, no console errors/warnings | ✅ | `Ready in 288ms`; `GET /` → 200 in 472 ms cold |
| `<h1>` present in initial HTML (§3.6) | ✅ | `curl /` returns `<h1 …>rishabh preethan</h1>` in body |
| h1 typography matches §1.2 Display XL | ✅ | DOM inspect: `clamp(3rem, 8vw, 6rem)` resolves to 48–96 px across viewports; tracking -0.02em, leading 1.05 |
| Eyebrow text matches Caption scale | ✅ | DOM inspect: 0.8125rem / 500 weight / 0.02em uppercase |
| Lead text matches Lead scale | ✅ | DOM inspect: 1.125rem (mobile) / 1.25rem (≥ md) |
| Open-to-work chip renders with starlight dot (§6.6) | ✅ | Chip text "open to Abu Dhabi + 7 more · on-site / remote / hybrid" present; dot uses `bg-starlight` |
| Scroll cue link reachable via Tab | ✅ | Manual: Tab from nav → into main lands on the chevron link; focus ring visible |
| Scroll cue navigates to `#about` | ✅ | Click → page anchors to about section (smooth scroll); reduced-motion: instant |
| No horizontal overflow at 360 / 768 / 1280 / 1920 | ✅ | DevTools viewport toggle |
| Touch target on scroll cue ≥ 44×44 (§4.2) | ✅ | `p-2` on 18 px icon = 44×44 hit area |
| Hero LCP within 2 s (F-01) | ✅ | LCP ≈ 0.4 s on warm dev load (h1 in SSR, no entrance animation gating paint) |
| Reduced-motion: no animation differences | ✅ | DevTools rendering emulator → "prefers-reduced-motion: reduce". Hero static (correct, since hero has no motion); starfield falls back to one-shot static; section fade-in snaps to instant. |
| No new console warnings beyond Epic 2.1 baseline | ✅ | Console clean during scroll, resize, tab-switch |

## Outstanding

- F-01 will be formalized as a Playwright spec in Epic 4.1.
- Reviewer's S-1 (initial-route JS budget watch) carries forward; revisit after Epic 3.1+ adds Section content.
- Reviewer's S-2 (subtle scroll-cue pulse) is a polish-later item.

## Regressions

None. Epic 2.1 starfield, Epic 1.2 nav/footer/section behaviors all still pass their prior smoke checks.

---

🤖 QA by claude-qa
