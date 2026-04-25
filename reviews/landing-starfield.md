# Review — landing starfield

**Task ID:** 2.1
**Branch:** feature/landing-starfield
**Reviewer:** claude-reviewer
**Date:** 2026-04-25
**Verdict:** ✅ PASS

---

## §8 Checklist

- [x] §1.1 Colors pulled from tokens — `readTokenColors()` reads `--ink` and `--accent-starlight` from the `:root` computed style. No hex literals in the component (re-grepped `src/components` and `src/app` after dev hygiene pass; clean).
- [x] §1.2 Typography matches scale — N/A (canvas, no text).
- [x] §1.4 Motion honors reduced-motion — `matchMedia('(prefers-reduced-motion: reduce)')` is read at mount and observed via `change`. When matched, `rAF` is cancelled and a one-shot `drawStatic()` paints the stars without drift or twinkle. Identity transform per §1.4 ✓. See note N-1 below regarding EVENT_MODEL phrasing.
- [x] §2.1 Contrast — N/A (decorative texture).
- [x] §2.2 Keyboard nav — canvas is `aria-hidden="true"` + `pointer-events-none` so it neither receives focus nor blocks tab order. Verified by manual Tab pass: focus moves nav → main → footer with no canvas stop.
- [x] §2.4 Alt text — `aria-hidden="true"` is correct for purely decorative content.
- [x] §2.7 Color is never the sole conveyor of information — N/A (no information conveyed).
- [x] §2.9 `prefers-reduced-motion` honored — see §1.4 above.
- [⚠️] §3.1 Build size — Next 16 + Turbopack no longer prints the per-route gzipped size table, so I sized the static asset folder instead: total `_next/static` JS gzips to **~222 kB** (essentially unchanged from 1.2's 220.7 kB; canvas adds no new dep, only a small client component). Initial-route share is still tracking close to the 150 kB ceiling. **Suggestion S-1 below.**
- [x] §3.3 Starfield budget —
  - FPS cap 30 ✓ (`MIN_FRAME_MS = 1000 / 30`, early-return inside `tick`).
  - `cancelAnimationFrame` on tab hidden ✓ (`onVisibility → stop()`).
  - Star count scales to viewport ✓: `densityFor` returns 90 / 140 / 190 / 330 (≤ 200 on ≤ 1280, ≤ 350 on > 1280).
- [x] §3.4 No client-side data fetching ✓.
- [x] §3.5 No third-party JS added ✓ (zero dependency delta — pure canvas).
- [x] §3.6 Hero h1 in server HTML — `page.tsx` is still a Server Component; the `<h1>` placeholder remains in initial HTML. Verified via `view-source`-style read of `page.tsx`.
- [x] §4 Responsive — canvas is `fixed inset-0 h-dvh w-screen`, redraws on debounced resize (150 ms) and reseeds density. No horizontal overflow at 360 / 768 / 1280 / 1920 (manual DevTools toggle).
- [x] §5 Claude-design — restrained texture, no decorative chrome added; passes §5.1 (no extra accent introduced — only `--ink` and `--accent-starlight` are used, and starlight is used sparingly for ~8% of stars per `r > 1.2` branch).
- [x] §6 Space-theme —
  - §6.1 no cartoons ✓
  - §6.2 subtle: alphas 0.35–0.85 with twinkle modulation 0.75–1.0; reads as texture ✓
  - §6.3 nebula desaturation handled by existing `bg-nebula` (untouched) ✓
  - §6.4 drift ≤ 12 px/s perceived: `vx ∈ ±4 px/s`, `vy ∈ ±1 px/s`, max magnitude ~4.1 px/s ✓
  - §6.5 2D canvas only, no rotating skybox, no 3D ✓
  - §6.6 starlight gold only on the 8% of larger stars; plasma purple unused (correct — §6.6 reserves plasma for hover-only) ✓
- [x] §7 Code conventions — `'use client'` only because of `useEffect` + canvas refs (§7.1); no inline framer-motion variants needed (canvas-internal animation, not framer-motion); no `any`, no `console.log`, no unused imports (greps clean).

---

## Spec Sections Hit

§1.1, §1.4, §3.3, §3.5, §3.6, §6.1–§6.6, §7.1, §7.5.

---

## Notes (non-blocking)

### N-1. EVENT_MODEL "static gradient" phrasing (§1.4 satisfied either way)

`EVENT_MODEL.md` describes the reduced-motion branch of the starfield state machine as `static gradient`. The implementation interprets this as "no animation, no rAF — render stars once and stop", which satisfies §1.4's MUST (`duration = 0`, transforms identity) and §6.2 (texture, not foreground). The literal reading would be "no stars at all, only the CSS nebula gradient on `<body>`".

Both readings are spec-compliant under §1.4. The current impl is the more visually consistent option (keeps the space-theme identity intact for reduced-motion users instead of falling back to a flat gradient). Recommend the spec owner clarify EVENT_MODEL to read `static (one-shot) render` rather than `static gradient` so future readers don't get confused.

---

## Suggestions (non-blocking)

### S-1. Initial-route JS budget watch (§3.1)

Total static JS is unchanged at ~222 kB gzipped (no new dep). The initial-route subset is still tracking close to the 150 kB ceiling — driven by framer-motion from 1.2. Once the real hero (2.2) lands, re-measure. If we cross 150 kB, the cheapest lever is `dynamic()` for `<Section>` so framer-motion only loads when below-the-fold sections enter.

### S-2. Optional jitter on `dt` clamp

`tick` clamps `dt` to `0.1 s`. Fine for FPS protection but could cause visible drift jumps if the tab wakes from being hidden mid-frame. Cheap fix: reset `lastTsRef.current = 0` inside `start()` (already done) — acknowledged. No action needed; recording for future reference.

---

## Approvals

PASS on all MUSTs (§1.1, §1.4, §3.3, §3.5, §3.6, §4, §6, §7). One SHOULD-level bundle watch, one EVENT_MODEL phrasing note. Ready for QA.

🤖 Reviewed by claude-reviewer against ALIGNMENT_SPEC.md §8
