# PR stub — [landing] hero — name, role, open-to-work chip, scroll cue

## Summary

- New `<Hero />` Server Component at `src/components/sections/hero.tsx`. The `<h1>` is rendered in initial HTML so LCP isn't gated on hydration or entrance animation — directly satisfies §3.6.
- Typography matches §1.2 row-for-row: Display XL `clamp(3rem, 8vw, 6rem)` with -0.02em tracking + 1.05 leading; Caption eyebrow; Lead role line.
- Open-to-work chip uses `--accent-starlight` for the dot only (per §6.6) — keeps §5.1 trivially satisfied (one accent on screen).
- Subtle scroll cue (`<a aria-label="…"><ArrowDown /></a>`) anchored to `#about`, with a 44×44 hit area for §4.2.
- All copy continues to come from `profile.ts` (§7.2). No new dependencies — `lucide-react` was already shipped in 1.2.

## Task

- `STATUS.md` ID: **2.2**
- Branch: `feature/landing-hero` (stacked on `feature/landing-starfield`)

## Alignment Spec Coverage

Hits: §1.1 (tokens), §1.2 (Display XL / Lead / Caption), §2.1–§2.6, §2.8, §3.4–§3.6 (LCP), §4 (responsive + touch target), §5.1–§5.6 (Claude-design), §6.6 (starlight accent), §7.1 (server-by-default), §7.2 (profile.ts), §7.4–§7.5.

Verified: [`reviews/landing-hero.md`](../reviews/landing-hero.md) — PASS with one bundle-watch suggestion (carried forward) and one cosmetic polish flag.

## QA

- Manual smoke — F-01 (landing loads, hero LCP) passes. Full Playwright lands in Epic 4.1.
- Report: [`qa/landing-hero.md`](../qa/landing-hero.md).

## Preview

Vercel preview URL auto-generates once a deployment is connected.

## Notes / Suggestions to address before merge to `main` (non-blocking)

- [ ] S-1: Re-measure initial-route gzipped JS once Epic 3.1+ adds real Section content. If we cross 150 kB, lazy-load `<Section>` via `dynamic()` so framer-motion only loads for below-the-fold sections.
- [ ] S-2: Optional 1.6 s vertical pulse on the scroll-cue chevron, gated on `prefers-reduced-motion: no-preference`. Polish-later.

## Test Plan

- [x] `npm run build` succeeds (clean static output)
- [x] `npm run dev` renders nav + hero + sections + footer + canvas without console errors
- [x] `curl /` shows `<h1>` in initial HTML (§3.6)
- [x] Reviewer §8 checklist green
- [x] Manual: Tab order reaches scroll cue with visible focus ring
- [x] Manual: scroll cue scrolls to `#about` (smooth / instant under reduced-motion)
- [x] Manual: no horizontal overflow at 360 / 768 / 1280 / 1920
- [ ] Playwright F-01 — **pending Epic 4.1**

🤖 Developed with spec-driven agents (dev/reviewer/qa)
