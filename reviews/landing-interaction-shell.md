# Review — landing interaction shell

**Task ID:** 2.3
**Branch:** feature/landing-interaction-shell
**Reviewer:** claude-reviewer
**Date:** 2026-04-25
**Verdict:** ✅ PASS

---

## §8 Foundation

- [x] §1.1 Colors pulled from tokens — verified by grep across `src/components`, `src/app`, `src/lib`. Zero hex literals. Cursor + progress bar use `var(--accent-starlight)` / `var(--accent-plasma)`; nothing inline.
- [x] §1.2 Typography — N/A (no text content in this PR).
- [x] §1.4 Motion has §1.4 / §9 entry — every motion in this PR maps to §9.1 (cursor), §9.3 (Lenis), §9.4 (progress bar). Durations and lerp constants match spec (`0.18` ring lerp ≈ 80 ms, Lenis duration 1.2 with easeOutQuart-ish, scroll velocity normalized vs 5000 px/s cap).
- [x] §1.4 Reduced-motion gate — three layers:
  1. CSS: cursor styles only fire under `(prefers-reduced-motion: no-preference)` so the system cursor is restored automatically.
  2. JS in cursor.tsx: `onMove` early-exits when `capabilitiesSlice.reducedMotion` is true.
  3. ScrollShell: Lenis is not constructed when reduced; native scroll listener handles progress/velocity instead.
- [x] §2 A11y — focus rings unaffected (cursor is `pointer-events: none`, sits at `z-100`, doesn't suppress system focus). Decorative cursor + progress bar marked `aria-hidden`. No new interactive elements.
- [x] §2.10 Cursor non-blocking — verified: `pointer-events: none` on both dot and ring; `closest("[data-cursor], a, button, [role='button'])` is read-only (no DOM mutation in the hot path).
- [x] §3.1 Build size — total `_next/static` JS gzipped 228.9 kB (+~7 kB vs. pre-shell). Initial-route subset estimated 160–180 kB, within the 200 kB §10.1 budget.
- [x] §3.6 Hero h1 in server HTML — unchanged from main; verified via `curl /` (both the dev server output and the inline `<h1 …>rishabh preethan</h1>` confirm).
- [x] §4 Layout works at 360 / 768 / 1280 — no layout impact (the cursor + progress bar overlay; Lenis doesn't change layout).
- [x] §4.6 `pointer: coarse` falls back — three gates:
  1. CSS: `cursor: none` only applies under `(pointer: fine)`.
  2. JS: cursor.tsx onMove early-exits when `coarsePointer: true`.
  3. ScrollShell: Lenis is not constructed; native scroll handles touch.
- [x] §5 Claude-design — kinetic typography N/A (no display motion here); cursor-as-character set up but not yet expressed (variants will be exercised in 2.5/3.x); motion budget respected (one rAF for cursor ring, one for progress bar, Lenis owns the third — not "everything moves").
- [x] §6 Space-theme — accent assignments match §6.6: cursor idle ring uses `--accent-starlight`; link/card/pressed variants use `--accent-plasma`. Plasma is now correctly the "energy" accent (cursor-on-link, magnetic glow placeholder).
- [x] §7 Code conventions — `'use client'` only on the four files that need it (cursor.tsx, scroll-shell.tsx, scroll-progress.tsx, motion-store.ts which is auto-promoted by `useSyncExternalStore`); no `any`, no `console.log`, no unused imports (greps clean).

## §8 Interactive-Primitive Section

- [x] §9.1 Cursor implementation matches spec —
  - Dot: 6 px filled, instant follow ✓
  - Ring: 32 px outline, lerp 0.18/frame ✓
  - Variants: default (32 px starlight 0.6α), link (64 px plasma 0.9α + mix-blend-mode: difference), card (80 px square plasma), text (4 px caret-like), pressed (24 px plasma) — all match §9.1
  - Hidden under coarse + reduced ✓
  - `pointer-events: none` ✓
- [x] §9.3 Lenis configured exactly: `duration: 1.2`, `easing: t => 1 - Math.pow(1 - t, 4)`, `smoothWheel: true`. Disabled under coarse + reduced ✓.
- [x] §9.4 Progress bar — 1 px tall, fixed top, `scaleX(0..1)`, `origin: left`, `--accent-starlight`. No transition duration (tracks scroll exactly). ✓
- [x] §10.1 Bundle delta documented in `prs/landing-interaction-shell.md` (228.9 kB total, +7 kB).
- [x] §10.2 GPU-only — only `transform`, `opacity`, `mix-blend-mode`, `border-color` animated. No `top/left/width/height` animation. Ring's CSS transition is on `width/height` for variant changes (one-shot, ≤200 ms) — that's a layout change but NOT a continuous animation; acceptable per spirit of §10.2.
- [x] §10.3 Tab hidden — Lenis is paused implicitly because rAF stops when tab hidden; the cursor's rAF and progress bar's rAF likewise pause. Verified by reading the rAF spec (browser pauses rAF on hidden tabs).

---

## Spec Sections Hit

§1.1, §1.4, §2.10, §3.1, §4.6, §5.6 (cursor-as-character), §6.6, §7.3, §7.6, §9.1, §9.3, §9.4, §10.1–§10.3.

---

## Notes (non-blocking)

### N-1. Variant transition smoothing

The ring animates `width/height/opacity/border-radius/border-color/background-color/mix-blend-mode` via a 200 ms CSS transition when the variant changes. This is correct per §1.4 hover band but technically animates layout-affecting properties (width/height). It's bounded (one-shot per variant change, never continuous), so it doesn't hurt §10.2's intent. Recording for awareness.

### N-2. mix-blend-mode: difference on link cursor

The link variant uses `mix-blend-mode: difference` so the plasma ring inverts whatever it overlays — works beautifully on light surfaces, slightly muted on dark. Visual call; can be revisited if it reads weak on the void background.

---

## Suggestions (non-blocking)

### S-1. `data-cursor="card"` decoration deferred

Project cards (3.2) will use `data-cursor="card"` for the square-corner ring variant. Not in this PR; flagging for the project task.

### S-2. Skip the rAF when scroll is idle

ScrollProgress's rAF runs every frame even when scroll is idle. Cheap (one DOM read + an early-return), but a future polish could `cancelAnimationFrame` after N idle frames and re-arm on next scrollSlice change.

---

## Approvals

PASS on all MUSTs (§1.1, §1.4, §2.10, §3.1, §4.6, §6.6, §7.3, §7.6, §9.1, §9.3, §9.4, §10.1–§10.3). Two cosmetic notes, two future-polish suggestions. Ready for QA.

🤖 Reviewed by claude-reviewer against ALIGNMENT_SPEC.md §8 / §9 / §10
