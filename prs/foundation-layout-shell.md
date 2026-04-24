# PR stub — [foundation] layout shell — sticky nav + footer + section wrapper

## Summary

- Sticky top nav: logo left, section links right, mobile hamburger below `md`. Scroll-linked backdrop-blur after 40px. IntersectionObserver highlights the in-view section link.
- Mobile drawer: full-screen overlay, body-scroll lock, Escape-to-close, focus returned to trigger on close.
- Footer: year + made-by line + GitHub / LinkedIn / email icon links.
- `<Section>` wrapper component: handles scroll-in fade+rise (one-shot per EVENT_MODEL).
- Inline GitHub + LinkedIn SVG (lucide-react v1.11 dropped trademarked brand icons).

## Task

- `STATUS.md` ID: **1.2**
- Branch: `feature/foundation-layout-shell` (stacked on `feature/foundation-design-system`)

## Alignment Spec Coverage

Hits: §1.2 (typography), §1.4 (motion variants), §2.2–§2.8 (a11y), §4.1–§4.5 (responsive), §5 (Claude-design), §7 (conventions).

Verified: [`reviews/foundation-layout-shell.md`](../reviews/foundation-layout-shell.md) — PASS with 3 SHOULD-level suggestions.

## QA

- Manual smoke — all flows expected (F-02, F-07, F-08) pass. Full Playwright lands in Epic 4.1.
- Report: [`qa/foundation-layout-shell.md`](../qa/foundation-layout-shell.md).

## Preview

Vercel preview URL auto-generates once repo is connected.

## Suggestions to address before merge to `main` (non-blocking)

- [ ] S-1: Focus trap in mobile menu (§2.3).
- [ ] S-2: Use `aria-current="location"` on active nav link.
- [ ] S-3: Watch initial-route gzipped JS as starfield/hero land; currently ≈ 220 kB total, budget is 150 kB **initial route** only.

## Test Plan

- [x] `npm run build` succeeds
- [x] `npm run dev` renders nav + sections + footer without console errors
- [x] Reviewer §8 checklist green (with advisories)
- [x] Manual nav scroll works at 360, 768, 1280
- [ ] Playwright flows F-02/F-07/F-08 — **pending Epic 4.1**

🤖 Developed with spec-driven agents (dev/reviewer/qa)
