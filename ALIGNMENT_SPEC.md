# Alignment Spec

The single contract the Reviewer checks Developer output against. Any PR that violates a **MUST** rule is blocked. **SHOULD** rules are flagged but not blocking. Sections are numbered for PR references (e.g., "fails §3.2").

---

## §1 Design Tokens

### §1.1 Color (MUST)

CSS custom properties defined in `src/styles/tokens.css` and exposed to Tailwind via `@theme` in `src/app/globals.css`.

| Token | Value | Usage |
| --- | --- | --- |
| `--bg-void` | `#0a0b14` | Root page background |
| `--bg-nebula-1` | `#1a1f3a` | Nebula gradient inner stop |
| `--bg-nebula-2` | `#2d1b4e` | Nebula gradient outer stop |
| `--ink` | `#f2ede4` | Primary text, warm off-white |
| `--ink-muted` | `#9a9388` | Secondary text, captions, meta |
| `--ink-dim` | `#5c5a55` | Hairlines, dividers |
| `--accent-starlight` | `#e8d9b8` | Key CTA, open-to-work chip, subtle highlights |
| `--accent-plasma` | `#7c5cff` | Hover glow only, max 1 use per screen |
| `--border-orbit` | `rgba(242,237,228,0.08)` | 1px borders on cards |

Never hard-code hex values in components. Pull from tokens.

### §1.2 Typography (MUST)

| Role | Font | Size | Weight | Leading | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display XL (hero name) | Instrument Serif | `clamp(3rem, 8vw, 6rem)` | 400 | 1.05 | -0.02em |
| Display L (section heads) | Instrument Serif | `clamp(2rem, 4vw, 3rem)` | 400 | 1.1 | -0.015em |
| Body | Inter | `1rem` / mobile, `1.0625rem` / desktop | 400 | 1.6 | 0 |
| Lead (about) | Inter | `1.125rem` / 1.25rem | 400 | 1.55 | -0.005em |
| Caption / meta | Inter | `0.8125rem` | 500 | 1.4 | 0.02em uppercase |

All fonts loaded via `next/font` (Instrument Serif, Inter). No web font `<link>` tags.

### §1.3 Spacing (SHOULD)

Use Tailwind scale (`0.25rem` base). Section vertical rhythm: `py-24 md:py-32 lg:py-40`. Container: `max-w-6xl mx-auto px-6`.

### §1.4 Motion (MUST)

| Event | Duration | Easing | Notes |
| --- | --- | --- | --- |
| Entrance fade+rise | 500 ms | `cubic-bezier(0.22, 1, 0.36, 1)` | translateY 12→0, opacity 0→1 |
| Hover lift | 200 ms | `cubic-bezier(0.2, 0, 0, 1)` | Scale ≤ 1.015, shadow growth |
| Nav section-indicator | 300 ms | `ease-out` | Underline slide |
| Page anchor scroll | browser-smooth | — | Honors `prefers-reduced-motion: reduce` → instant |

All motion **MUST** be gated by `prefers-reduced-motion: reduce`. When reduced, duration = 0 and transforms = identity.

---

## §2 Accessibility (MUST)

- §2.1 Contrast: body text ≥ 4.5:1; large text ≥ 3:1. `--ink` on `--bg-void` = 14.8:1 ✓.
- §2.2 Keyboard nav: every interactive element reachable via Tab; visible focus ring (2px `--accent-starlight` outline + 2px offset).
- §2.3 No focus trap except mobile nav (which must release on Escape).
- §2.4 Alt text on every `<img>`; decorative images use `alt=""`.
- §2.5 Headings form a valid outline: one `<h1>` (hero name), `<h2>` for each section.
- §2.6 `<main>` landmark wraps content; `<nav>` wraps nav; `<footer>` wraps footer.
- §2.7 Color is never the sole conveyor of information.
- §2.8 `aria-label` on icon-only buttons; link text descriptive (no "click here").
- §2.9 `prefers-reduced-motion` honored (see §1.4).

---

## §3 Performance Budget (MUST)

- §3.1 `npm run build` output: initial route JS ≤ 150 kb gzipped.
- §3.2 No `<img>` raw — use `next/image` with width/height or `fill` + aspect-ratio parent.
- §3.3 Starfield: max 30 FPS; `cancelAnimationFrame` on tab hidden; star count scales to viewport (≤ 200 on ≤ 1280px wide, ≤ 350 on larger).
- §3.4 No client-side data fetching. All copy from `src/data/profile.ts`.
- §3.5 No third-party JS (no GTag, Intercom, etc.) unless added to this spec.
- §3.6 Hero `<h1>` server-rendered (LCP candidate).

---

## §4 Responsive (MUST)

Breakpoints: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536 (Tailwind defaults).

Test viewports for QA: **360×640** (small mobile), **768×1024** (tablet), **1280×800** (laptop), **1920×1080** (desktop).

Layout rules:
- §4.1 No horizontal overflow at any breakpoint from 320px up.
- §4.2 Touch targets ≥ 44×44 px on `coarse` pointer.
- §4.3 Nav collapses to hamburger below `md`.
- §4.4 Project grid: 1 col `sm`, 2 col `md`, 3 col `lg`.
- §4.5 Text reflows without clipping at any width.

---

## §5 Claude-Design Principles (MUST)

- §5.1 **Restraint**: no more than 2 accent colors visible on one screen.
- §5.2 **Typographic authority**: display type carries the hierarchy; decoration is subordinate.
- §5.3 **Warmth**: neutrals always lean warm (never cool grey/blue-grey for text).
- §5.4 **Whitespace**: at least `2× line-height` between a section heading and its body.
- §5.5 **Content is the UI**: chrome is minimal; no decorative borders, no gradient buttons, no glassmorphism fills.
- §5.6 **Prose voice**: body copy in first person, lowercase section headers, sentence case for everything else.

---

## §6 Space-Theme Rules (MUST)

- §6.1 No cartoon planets, no rocket ships, no "coming soon" astronauts.
- §6.2 Starfield density: subtle — stars should read as texture, not foreground.
- §6.3 Nebula colors: desaturated (max 25% chroma) so content always reads over them.
- §6.4 Motion speed: stars drift at ≤ 12 px/second perceived velocity.
- §6.5 No rotating skyboxes, no 3D scenes. 2D canvas only.
- §6.6 Accent: starlight gold `--accent-starlight` is the "star" accent; plasma purple is for hover-only sparks.

---

## §7 Code Conventions (SHOULD)

- §7.1 Server Components by default; `'use client'` only when hooks/events required.
- §7.2 `src/data/profile.ts` is the single copy source — no hard-coded strings in components.
- §7.3 Motion variants in `src/lib/motion.ts` — no inline `initial/animate` objects in components.
- §7.4 Tailwind utility classes over bespoke CSS; bespoke CSS only for canvas, tokens, and `@theme`.
- §7.5 No unused imports, no `any`, no `console.log` in merged code.

---

## §8 Reviewer Checklist

Before marking a PR as passing, the Reviewer walks this list:

- [ ] §1.1 Colors pulled from tokens, no hex literals in components
- [ ] §1.2 Typography matches scale (inspect `font-size`/`line-height`)
- [ ] §1.4 All motion honors reduced-motion
- [ ] §2   A11y: contrast, focus ring, keyboard flow, alt text
- [ ] §3.1 Build size check: `npm run build` output under budget
- [ ] §3.6 Hero h1 exists in server HTML (View Source shows it)
- [ ] §4   Layout works at 360 / 768 / 1280 viewports
- [ ] §5   Claude-design: restraint, warmth, typographic hierarchy
- [ ] §6   Space-theme: subtle, desaturated, slow motion
- [ ] §7   Code conventions: profile.ts used, motion.ts used, no any/console.log

Reviewer output format: `reviews/<slug>.md` with each checkbox ticked or explicitly failed with a §ref + one-line rationale.
