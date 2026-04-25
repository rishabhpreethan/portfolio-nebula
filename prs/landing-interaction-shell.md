# PR stub — [landing] interaction shell — cursor + Lenis + scroll progress + motion-store

## Summary

The substrate the rest of the cinematic phase composes against. **One** `pointermove`, **one** `scroll` listener for the whole app — every downstream cinematic component (reactive starfield, hero parallax, magnetic chips, project tilt, section reveals) reads from the slices in `motion-store.ts` instead of attaching its own listener.

- **`src/lib/motion-store.ts`** — tiny `Slice<T>` primitive (subscribe/get/set/patch) backing four global slices: `cursorSlice` (x/y/variant/pressed/visible), `scrollSlice` (progress/velocity/direction), `parallaxSlice` (normalized -1..1 from viewport center), `capabilitiesSlice` (reducedMotion/coarsePointer). High-frequency consumers (cursor follow, ring lerp, parallax, gravity-well) read via `slice.get()` inside their own rAF loop and write to the DOM directly to avoid 60 Hz React re-renders. Low-frequency consumers use the `useSlice()` `useSyncExternalStore` adapter.
- **`src/components/cursor.tsx`** (§9.1) — 6 px dot (instant follow) + 32 px ring (lerp 0.18/frame ≈ 80 ms ease-in). Variants: `default` / `link` / `card` / `text` / `pressed`. Variant detection uses `elementFromPoint` + `closest("[data-cursor], a, button, [role='button']")` — explicit `data-cursor` wins, otherwise `<a>`/`<button>` auto-default to `link` so every existing interactive element triggers the variant for free. Hidden under `pointer:coarse` and `prefers-reduced-motion: reduce` (CSS + JS gates). Strict `pointer-events: none` (§2.10).
- **`src/components/scroll-shell.tsx`** (§9.3) — Lenis v1 with `duration: 1.2`, `easing: t => 1 - (1-t)^4`, `smoothWheel: true`. Disabled under reduced-motion / coarse pointer (native scroll fallback). Even when bypassed, this component owns the single global scroll listener and writes progress + velocity into `scrollSlice`. Velocity normalized 0..1 against a 5000 px/s cap; decays at `0.92/frame` (~80 ms half-life) for smooth tails.
- **`src/components/scroll-progress.tsx`** (§9.4) — 1 px top-edge bar in `--accent-starlight`, `scaleX(scroll/max)`, `origin: left`. Reads `scrollSlice` in its own rAF loop and writes the DOM directly.
- **`src/app/layout.tsx`** — mounts `<ScrollShell>` wrapping `<ScrollProgress>` + `<Cursor>` + `children` at the root.
- **`src/app/globals.css`** — hides system cursor on `(pointer: fine) and (prefers-reduced-motion: no-preference)`; restores text caret on inputs/textareas/contenteditable.
- **`package.json`** — adds `lenis ^1.3` (recorded in `ARCHITECTURE.md` "Allowed Dependencies").

## Task

- `STATUS.md` ID: **2.3**
- Branch: `feature/landing-interaction-shell` (off `main` after the cinematic spec amendments + 4-PR merge)

## Bundle delta

- Total `_next/static` JS gzipped: **228.9 kB** (+ ~7 kB vs. pre-shell 221.9 kB).
  - Lenis: ~5 kB
  - Cursor + ScrollShell + ScrollProgress + motion-store: ~2 kB combined
- Initial-route subset estimated 160–180 kB, within §10.1 200 kB budget.

## Alignment Spec Coverage

Hits: §1.1 (tokens), §1.4 (motion vocabulary entries match exactly), §2.10 (cursor non-blocking), §3.1 / §10.1 (budget), §4.6 (coarse-pointer fallback), §5.6 (cursor-as-character), §6.6 (accent assignments), §7.3 / §7.6 (motion-store contract), §9.1 / §9.3 / §9.4 (interaction primitives), §10.1–§10.3 (bundle / GPU-only / tab-pause).

Verified: [`reviews/landing-interaction-shell.md`](../reviews/landing-interaction-shell.md) — PASS, two cosmetic notes + two future-polish suggestions.

## QA

- Manual smoke — F-01 (landing loads), F-06 (reduced-motion), F-09 (cursor follow + variant), F-10 (progress bar tracks), F-11 (coarse pointer fallback) all pass. Full Playwright lands in Epic 4.1.
- Report: [`qa/landing-interaction-shell.md`](../qa/landing-interaction-shell.md).

## Test Plan

- [x] `npm run build` succeeds (clean static output)
- [x] `npm run dev` runs without console errors/warnings
- [x] Cursor dot + ring mount on `pointer: fine`, hidden on coarse + reduced-motion
- [x] Cursor variant switches on `<a>`/`<button>` hover (default → link)
- [x] Lenis smooth scroll engaged on desktop; native scroll on touch / reduced
- [x] Progress bar `scaleX` tracks scroll position
- [x] Hero h1 still in initial HTML (§3.6 unchanged)
- [x] Reviewer §8 / §9 / §10 checklist green
- [ ] Playwright F-09 / F-10 / F-11 — **pending Epic 4.1**

🤖 Developed with spec-driven agents (dev/reviewer/qa)
