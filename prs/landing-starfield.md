# PR stub — [landing] starfield — subtle drifting canvas backdrop

## Summary

- New `<Starfield />` client component: token-driven canvas that renders 90 / 140 / 190 / 330 stars depending on viewport width, drifting at ≤ 4 px/s with a low-amplitude twinkle. 30 FPS cap, debounced resize reseeds density.
- Pauses on `visibilitychange` (CPU goes to 0 when the tab is hidden), and renders once-statically under `prefers-reduced-motion: reduce`.
- Mounted in `app/page.tsx` as a `fixed inset-0 -z-10` layer with `aria-hidden="true"` and `pointer-events-none` so it never blocks content or focus.
- Zero new dependencies — pure 2D canvas; bundle delta is essentially nil.

## Task

- `STATUS.md` ID: **2.1**
- Branch: `feature/landing-starfield` (stacked on `feature/foundation-layout-shell`)

## Alignment Spec Coverage

Hits: §1.1 (tokens via `--ink` and `--accent-starlight`), §1.4 (reduced-motion → identity transform, no rAF), §3.3 (FPS cap, viewport-scaled density, pause on hidden), §3.5 (no third-party JS), §3.6 (hero h1 still in server HTML), §6.1–§6.6 (no cartoons, subtle texture, slow drift, 2D canvas only, starlight gold for highlight stars only), §7.1 + §7.5 (server-by-default; `'use client'` only for canvas hooks; no `any`/`console.log`).

Verified: [`reviews/landing-starfield.md`](../reviews/landing-starfield.md) — PASS with one bundle-watch suggestion and one EVENT_MODEL phrasing note.

## QA

- Manual smoke — F-01 (landing loads, hero LCP) and F-06 (reduced-motion static) both pass. Full Playwright lands in Epic 4.1.
- Report: [`qa/landing-starfield.md`](../qa/landing-starfield.md).

## Preview

Vercel preview URL auto-generates once the repo is connected.

## Notes / Suggestions to address before merge to `main` (non-blocking)

- [ ] S-1: Re-measure initial-route gzipped JS once Epic 2.2 (hero) lands; currently tracking close to the 150 kB ceiling. If we cross, lazy-load `<Section>` via `dynamic()` so framer-motion only loads when below-the-fold sections enter.
- [ ] N-1: Spec-owner clarification — `EVENT_MODEL.md` calls the reduced-motion branch `static gradient`, but the impl renders stars statically (one-shot) instead of swapping to a flat CSS gradient. Recommend the spec owner reword to `static (one-shot) render`.

## Test Plan

- [x] `npm run build` succeeds (clean static output)
- [x] `npm run dev` renders nav + hero placeholder + sections + footer + canvas without console errors
- [x] Reviewer §8 checklist green
- [x] Manual: `<canvas>` aria-hidden, pointer-events-none, doesn't take focus
- [x] Manual: `cancelAnimationFrame` on tab hidden, resumes on visible
- [x] Manual: reduced-motion → no rAF loop, identity-transform stars
- [ ] Playwright F-01 / F-06 — **pending Epic 4.1**

🤖 Developed with spec-driven agents (dev/reviewer/qa)
