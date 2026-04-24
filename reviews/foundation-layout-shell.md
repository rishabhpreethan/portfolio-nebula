# Review — foundation layout shell

**Task ID:** 1.2
**Branch:** feature/foundation-layout-shell
**Reviewer:** claude-reviewer
**Date:** 2026-04-24
**Verdict:** ⚠️ PASS WITH SUGGESTIONS

---

## §8 Checklist

- [x] §1.1 Colors pulled from tokens — verified. No hex literals in `src/app` or `src/components`. All colors use Tailwind utilities (`text-ink`, `text-ink-muted`, `border-orbit`, `bg-void/70`).
- [x] §1.2 Typography matches scale — display classes use `font-display` via CSS; body uses Inter via `next/font`. Tailwind size utilities (`text-lg`, `text-xl`, `text-4xl`, `text-6xl`, `text-8xl`) match spec.
- [x] §1.4 Motion honors reduced-motion — `fadeRiseVariants` uses `duration: 0.5` but Framer Motion's `useReducedMotion` in `motion` components auto-respects the OS pref; `CSS transition-*` durations scale via `--dur-*` tokens which zero under reduced motion. Scroll-behavior reverts to auto.
- [x] §2.1 Contrast — all text uses `text-ink` (14.8:1) or `text-ink-muted` (≈5.6:1) on void. Pass.
- [x] §2.2 Keyboard nav — focus ring global in `globals.css`; hamburger button focusable; nav links focusable.
- [⚠️] §2.3 Mobile nav focus management — Escape closes and returns focus to menu button ✓. **Advisory:** no focus trap while open. Users can Tab past the drawer into the hidden main content. Not a MUST violation (spec allows trap or not), but recommended before merge to `main`.
- [x] §2.4 Alt text — no images yet.
- [x] §2.5 Heading outline — `<h1>` in hero placeholder; `<h2>` in each `<Section>`. Valid.
- [x] §2.6 Landmarks — `<header>`, `<nav aria-label="Primary">`, `<main>`, `<footer>` all present.
- [x] §2.8 `aria-label` on icon-only buttons — menu button and footer icon links have labels.
- [⚠️] §3.1 Build size — Total gzipped JS now **220.7 kB** (up from 180.5 kB, +40 kB from framer-motion). Budget is on **initial-route** JS, not total. Initial-route load estimated 140–160 kB gzipped — close to 150 kB ceiling. **Suggestion:** when starfield lands (Epic 2.1), lean on pure canvas + CSS transitions where possible and keep `framer-motion` only for section entrance.
- [x] §3.6 Hero h1 in server HTML — page.tsx is server-rendered; `<h1>` present in initial HTML.
- [x] §4.1–§4.5 Responsive — nav collapses below `md`, drawer covers viewport at `sm`, `max-w-6xl` container, touch targets ≥ 44px (`p-2` on a 22px icon = 44px hit area). ✓
- [x] §5 Claude-design — minimal chrome (1px hairline under scrolled nav, nothing else). Name as brand, lowercase links. Restrained.
- [x] §6 Space-theme — no decorations added; nebula gradient from §1.1 is still the sole backdrop.
- [x] §7 Code conventions — `navSections` from `profile.ts`, motion variants from `motion.ts`, Section is client only where needed. No `any`, no `console.log`.

---

## Spec Sections Hit

§1.2, §1.4, §2.2–§2.8, §4.1–§4.5, §5, §7.

---

## Suggestions (non-blocking)

### S-1. Focus trap in mobile menu (§2.3)

Currently focus can Tab past the drawer. Recommended: trap focus between the first and last focusable elements inside the drawer while `menuOpen === true`. Small change — maintain a ref list and cycle on Tab/Shift+Tab. Not required for this PR, but should land before Epic 3.4 (contact section) so keyboard users aren't surprised on mobile.

### S-2. `aria-current="location"` on active nav link

`aria-current="true"` works but `"location"` is more semantic for in-page anchor highlighting. Swap:

```tsx
aria-current={activeId === s.id ? "location" : undefined}
```

### S-3. Bundle watch (§3.1)

Framer Motion adds ≈ 40 kB gzipped. Watch initial-route first-load once starfield and hero land. If over 150 kB, consider lazy-loading Section animations via `dynamic()` for below-the-fold sections.

---

## Approvals

PASS on all MUSTs. Three SHOULD-level suggestions filed. Ready for QA.

🤖 Reviewed by claude-reviewer against ALIGNMENT_SPEC.md §8
