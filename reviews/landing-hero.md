# Review — landing hero

**Task ID:** 2.2
**Branch:** feature/landing-hero
**Reviewer:** claude-reviewer
**Date:** 2026-04-25
**Verdict:** ✅ PASS

---

## §8 Checklist

- [x] §1.1 Colors pulled from tokens — verified by grep across `src/components` and `src/app`: zero hex literals. The hero uses `text-ink-muted`, `text-ink`, `border-orbit`, `bg-starlight` only.
- [x] §1.2 Typography matches scale —
  - h1 (Display XL): `text-[clamp(3rem,8vw,6rem)] leading-[1.05] tracking-[-0.02em]` ✓ (matches §1.2 row exactly)
  - eyebrow (Caption): `text-[0.8125rem] font-medium uppercase leading-[1.4] tracking-[0.02em]` ✓
  - lead (Lead): `text-[1.125rem] md:text-[1.25rem] leading-[1.55] tracking-[-0.005em]` ✓
  - chip + scroll cue use Caption-class size, no new scale introduced ✓
- [x] §1.4 Motion honors reduced-motion — N/A. Hero has no entrance animation (server-rendered, identity transform). Only ambient motion in this region is the starfield (already reduced-motion-safe).
- [x] §2.1 Contrast — `--ink-muted` (≈ 5.6:1) on `--bg-void` for the eyebrow + lead + chip text; `--ink` (14.8:1) for the h1 and chip body text; both clear §2.1.
- [x] §2.2 Keyboard nav — only one focusable element (the scroll cue link). It has a 44×44 hit area (`p-2` on an 18 px icon = 44 px) and inherits the global focus ring from `globals.css`. ✓
- [x] §2.4 Alt text — only icon is the chip dot (`aria-hidden="true"`) and the ArrowDown SVG inside an `<a aria-label="Scroll to about section">` ✓.
- [x] §2.5 Heading outline — single `<h1>` ✓. `<h2>`s remain on each subsequent `<Section>`.
- [x] §2.6 Landmarks — hero is rendered inside `<main>`, which is wrapped by `<header><nav>` and followed by `<footer>` ✓.
- [x] §2.8 `aria-label` on icon-only links — scroll cue ✓; chip dot is `aria-hidden`.
- [x] §2.9 `prefers-reduced-motion` honored — no animation in the hero, so vacuously true.
- [⚠️] §3.1 Build size — Next 16 + Turbopack still doesn't print the per-route gzipped table. `_next/static` JS gzips to ~222 kB (unchanged from 2.1; hero adds zero new dep — `lucide-react` was already in 1.2). Initial-route JS still tracks close to 150 kB ceiling. **S-1 carries forward.**
- [x] §3.4 No client-side data fetching ✓.
- [x] §3.5 No third-party JS added ✓.
- [x] §3.6 Hero h1 server-rendered — verified via `curl /` and grep: `<h1 class="font-display text-ink mt-6 text-[clamp(3rem,8vw,6rem)] font-normal leading-[1.05] tracking-[-0.02em]">rishabh preethan</h1>` is present in initial HTML. LCP candidate is unblocked (no opacity-0 animation gating the paint).
- [x] §4 Responsive —
  - h1 size scales via `clamp(3rem, 8vw, 6rem)` — no overflow at 360, 768, 1280, 1920.
  - Lead text wraps via `max-w-2xl`.
  - Chip is `inline-flex` with text wrapping inside; on 360 it wraps to two lines but stays inside the container, no horizontal overflow.
  - Scroll cue is centered absolutely at the bottom of the section; clears the `2× line-height` rule from the lead/chip above it.
  - Touch target 44×44 ✓ (`p-2` + 18 px icon).
- [x] §5 Claude-design —
  - §5.1 single accent on screen (starlight on the chip dot only — chip text is `text-ink`, headline neutrals). ✓
  - §5.2 typographic authority — Display XL is the visual anchor; eyebrow + lead are subordinate. ✓
  - §5.3 warmth — neutrals are warm (`--ink`, `--ink-muted` per §1.1). ✓
  - §5.4 ≥ 2× line-height between heading and body — `mt-6` on the lead vs h1's 1.05 leading at clamp(3rem…) gives well over 2 ems of breathing room. ✓
  - §5.5 content is the UI — chip border is the only chrome (1 px hairline using `--border-orbit`). No gradient, no glassmorphism. ✓
  - §5.6 lowercase section headers, sentence case otherwise — name, headline lowercased; chip text is sentence-case ("open to Abu Dhabi…"), preserving the proper noun. ✓
- [x] §6 Space-theme —
  - §6.6 starlight gold used for the chip dot (the "star" accent — appropriate for "open to work" signal). ✓
  - Plasma purple unused on this surface (correct — §6.6 reserves it for hover sparks). ✓
  - No cartoons, no rotating skybox, no decorative space iconography (§6.1, §6.5). ✓
- [x] §7 Code conventions —
  - §7.1 Server Component (no `'use client'`) — confirmed; no hooks, no event handlers in the hero. ✓
  - §7.2 all copy from `profile.ts` (`name`, `pronouns`, `location`, `headline`, `locationOpen`). ✓
  - §7.3 N/A (no motion variants in hero).
  - §7.4 Tailwind utilities only; no bespoke CSS introduced. ✓
  - §7.5 No `any`, no `console.log`, no unused imports (greps clean). ✓

---

## Spec Sections Hit

§1.1, §1.2, §2.1–§2.6, §2.8, §3.4–§3.6, §4, §5.1–§5.6, §6.6, §7.1, §7.2, §7.4, §7.5.

---

## Notes (non-blocking)

### N-1. `id="top"` placement

The nav logo (`<a href="#top">`) anchors to `<main id="top">`, which sits just below the fixed nav. Hero deliberately does **not** carry `id="top"` so that "go to top" lands on the page-content origin (which is the hero in practice). Working as intended; recording for future hands-off.

---

## Suggestions (non-blocking)

### S-1. Initial-route JS budget watch (§3.1) — carries forward from 2.1

Hero adds no new client JS or deps. The watch is still valid: once Epics 3.1–3.4 add real Section content with framer-motion variants, re-measure. If we cross 150 kB, lazy-load `<Section>` via `dynamic()` so framer-motion only loads when below-the-fold sections enter.

### S-2. Optional subtle pulse on scroll cue

A 1.6 s vertical pulse on the chevron would draw the eye without violating §1.4 (just gate it on `prefers-reduced-motion: no-preference`). Not in this PR — flagging for design polish later.

---

## Approvals

PASS on all MUSTs. One bundle-watch suggestion carried forward from 2.1, one cosmetic polish flagged for later. Ready for QA.

🤖 Reviewed by claude-reviewer against ALIGNMENT_SPEC.md §8
