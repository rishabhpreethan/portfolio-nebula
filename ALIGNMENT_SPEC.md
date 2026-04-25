# Alignment Spec

The single contract the Reviewer checks Developer output against. Any PR that violates a **MUST** rule is blocked. **SHOULD** rules are flagged but not blocking. Sections are numbered for PR references (e.g., "fails §3.2").

> **Direction note (2026-04-25):** the project has shifted from "restraint-first" to "cinematic-with-discipline." §1.4 (motion), §5 (Claude-design), §6 (space-theme), §8 (reviewer checklist), and the new §9 + §10 reflect that change. §1.1/§1.2/§1.3 (tokens), §2 (a11y), §3.2–§3.6 (perf basics), §4 (responsive), §7 (code conventions) are unchanged.

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
| `--accent-starlight` | `#e8d9b8` | Open-to-work chip, scroll progress, cursor ring (idle) |
| `--accent-plasma` | `#7c5cff` | Cursor ring on link/card hover, magnetic glow, hover sparks |
| `--border-orbit` | `rgba(242,237,228,0.08)` | 1px borders on cards |
| `--border-orbit-strong` | `rgba(242,237,228,0.16)` | 1px borders on focused/hovered cards |

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

### §1.4 Motion vocabulary (MUST)

Motion is a **first-class** part of the experience. Every motion below has a single source-of-truth implementation in `src/lib/motion.ts` (variants) or `src/lib/motion-store.ts` (live values). Components consume — they never hand-roll.

| Pattern | Duration / Range | Easing | Notes |
| --- | --- | --- | --- |
| Entrance fade+rise | 500 ms | `cubic-bezier(0.22, 1, 0.36, 1)` | translateY 12→0, opacity 0→1 (kept for body copy) |
| Letter reveal (Display) | 30 ms / letter, ≤ 700 ms total | `easeOutSoft` | clip-path mask 0→100% per letter, 30 ms stagger |
| Heading reveal (clip-path) | 800 ms | `easeOutSoft` | top→bottom mask sweep |
| Mouse-parallax (display + hero layers) | 200 ms response | `easeOutSoft` | translate ≤ ±8 px from center; depth-scaled |
| Magnetic pull | 300 ms snap-back | `easeHover` | radius 60 px, target translates `(1 − dist/60) × 8 px` toward cursor |
| Custom cursor | 0 ms (dot) / 80 ms (ring follow) | `linear` | dot = exact pointer; ring = lerp(0.18) toward dot per frame |
| Scroll-driven section enter | 0..1 progress, max 800 ms | `easeOutSoft` | gated by IntersectionObserver `intersectionRatio` |
| Scroll progress bar | live | `linear` | scaleX(scroll/max) |
| Scroll velocity coupling | live | — | normalized 0..1 → starfield drift, blur, etc. |
| Project card tilt | 200 ms response | `easeOutSoft` | rotateX/Y ≤ ±10°, perspective 1000 px |
| Marquee | 60 s loop | `linear` | pauses when offscreen |
| Hover lift (cards) | 200 ms | `easeHover` | scale ≤ 1.02, shadow growth |

**Reduced motion (MUST):** under `prefers-reduced-motion: reduce`, every motion above collapses to identity (`transform: none`, `opacity: 1`) and durations to 0. The custom cursor is hidden (system cursor returns); Lenis smooth-scroll is bypassed (native scroll); marquee freezes mid-animation. Content must remain fully legible and reachable.

---

## §2 Accessibility (MUST)

- §2.1 Contrast: body text ≥ 4.5:1; large text ≥ 3:1. `--ink` on `--bg-void` = 14.8:1 ✓.
- §2.2 Keyboard nav: every interactive element reachable via Tab; visible focus ring (2px `--accent-starlight` outline + 2px offset). Custom cursor must not suppress system focus rings.
- §2.3 No focus trap except mobile nav (which must release on Escape).
- §2.4 Alt text on every `<img>`; decorative images use `alt=""`.
- §2.5 Headings form a valid outline: one `<h1>` (hero name), `<h2>` for each section.
- §2.6 `<main>` landmark wraps content; `<nav>` wraps nav; `<footer>` wraps footer.
- §2.7 Color is never the sole conveyor of information.
- §2.8 `aria-label` on icon-only buttons; link text descriptive (no "click here").
- §2.9 `prefers-reduced-motion` honored everywhere — see §1.4.
- §2.10 Custom cursor is **decorative only**. It must not replace focus rings, must not block hit-targets, and must be `pointer-events: none`. Falls back to system cursor on `pointer: coarse`.

---

## §3 Performance Budget (MUST)

- §3.1 `npm run build` output: initial route JS ≤ **200 kb gzipped** (raised from 150 kb to allow Lenis + cursor + tilt libs; still aggressive by 2026 standards).
- §3.2 No `<img>` raw — use `next/image` with width/height or `fill` + aspect-ratio parent.
- §3.3 Starfield: max 30 FPS in idle drift, max 60 FPS during cursor gravity-well or fast scroll. `cancelAnimationFrame` on tab hidden. Star count scales by viewport (≤ 200 on ≤ 1280 px wide, ≤ 400 on larger).
- §3.4 No client-side data fetching. All copy from `src/data/profile.ts`.
- §3.5 No third-party JS (no GTag, Intercom, etc.) unless added to this spec. Allowed motion deps: `framer-motion`, `lenis`, `lucide-react` (already in deps). Add a dep here before importing it.
- §3.6 Hero `<h1>` server-rendered (LCP candidate). Letter-reveal animations may animate it after mount, but the text MUST exist in initial HTML and the reveal MUST start from `opacity: 1` under reduced-motion (i.e., never gated on JS).

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
- §4.6 On `pointer: coarse`, all cursor-dependent effects (custom cursor, magnetic pull, card tilt, mouse-parallax) are disabled. Touch users get a static layout with scroll-driven reveals only.

---

## §5 Claude-Design Principles (MUST)

The "restraint-first" version of §5 (≤ 2 accents, no chrome) is retired. New principles:

- §5.1 **Typographic authority** — display type carries the hierarchy. Decoration is subordinate to letterforms.
- §5.2 **Warmth** — neutrals always lean warm (`--ink`, `--ink-muted`); never cool grey/blue-grey for text.
- §5.3 **Whitespace** — at least `2× line-height` between a section heading and its body.
- §5.4 **Prose voice** — body copy in first person, lowercase section headers, sentence case for everything else.
- §5.5 **Kinetic typography** — letterforms can move, split, mask, parallax. Display type animates; body text animates only on entry. Letters never disassemble for decoration alone — motion serves reveal or focus.
- §5.6 **Cursor-as-character** — the custom cursor is a first-class UI element. Its state expresses intent: idle (small dot + ring), link (ring scales + shifts to plasma), card (ring becomes square corners), pressed (ring shrinks). Never use the cursor to convey *information* (that's text's job).
- §5.7 **Scroll-as-narrative** — scrolling reveals chapters, not a list. Sections can dissolve/transform during transitions, but never disorient: forward scroll always advances; reverse scroll always reverses, exactly. Scroll-velocity may modulate ambient effects (starfield speed, blur, drift) but must never gate content visibility.
- §5.8 **Motion has a budget** — not every element animates. Pick one or two motion ideas per section. Reuse them. A page where everything moves equally is a page where nothing draws the eye.

---

## §6 Space-Theme Rules (MUST)

- §6.1 No cartoon planets, no rocket ships, no "coming soon" astronauts.
- §6.2 Starfield density: present, not overwhelming. Stars may now read as foreground when reacting to cursor or scroll velocity, but the page's body copy must still win the eye.
- §6.3 Nebula colors: desaturated (max 25% chroma) so content always reads over them.
- §6.4 Drift speed bands:
  - **Ambient drift** ≤ 12 px/s perceived velocity.
  - **Scroll-coupled drift** up to 60 px/s at maximum scroll velocity.
  - **Cursor gravity-well** acceleration ≤ 200 px/s² on stars within 120 px of cursor.
- §6.5 No 3D scenes. 2D canvas + CSS 3D transforms (rotateX/Y, perspective) only. No WebGL, no Three.js.
- §6.6 Accent assignments:
  - `--accent-starlight` — open-to-work chip, scroll progress bar, cursor ring (idle), highlight stars (largest 8% of starfield).
  - `--accent-plasma` — cursor ring on hover, magnetic glow, project-card focus halo.
  - Plasma is the "energy" accent; starlight is the "ambient" accent. Never use plasma for ambient (it'll feel cheap), never use starlight for hover (it'll feel flat).
- §6.7 **Layered parallax** — starfield renders in 3 depth layers (back / mid / front). Each translates at depth × scroll-velocity for a 3D-without-3D feel. Back layer: 0.2× scroll speed; mid: 0.5×; front: 1.0×.
- §6.8 **Cursor gravity well** — stars within 120 px of cursor accelerate toward it (capped at the §6.4 acceleration). Stars exit the well slingshot-style. No collision.

---

## §7 Code Conventions (SHOULD)

- §7.1 Server Components by default; `'use client'` only when hooks/events required.
- §7.2 `src/data/profile.ts` is the single copy source — no hard-coded strings in components.
- §7.3 Motion variants in `src/lib/motion.ts`; live motion values (cursor, scroll) in `src/lib/motion-store.ts` — no inline `initial/animate` objects in components, no ad-hoc subscriptions to mouse/scroll events.
- §7.4 Tailwind utility classes over bespoke CSS; bespoke CSS only for canvas, tokens, `@theme`, and global cursor styling.
- §7.5 No unused imports, no `any`, no `console.log` in merged code.
- §7.6 Animation hooks (`useMagnetic`, `useTilt`, `useParallax`) live in `src/lib/`, not inline. They consume motion-store state.

---

## §8 Reviewer Checklist

Before marking a PR as passing, the Reviewer walks this list:

**Foundation (every PR):**
- [ ] §1.1 Colors pulled from tokens, no hex literals in components
- [ ] §1.2 Typography matches scale (inspect `font-size`/`line-height`)
- [ ] §1.4 All motion has a corresponding entry in §1.4 table OR §9
- [ ] §1.4 Reduced-motion gate present and tested (DevTools rendering emulator)
- [ ] §2 A11y: contrast, focus ring, keyboard flow, alt text, §2.10 cursor non-blocking
- [ ] §3.1 Build size check: `_next/static` JS gzip stays under 200 kb total (initial-route subset is the budget)
- [ ] §3.6 Hero h1 exists in server HTML (View Source shows it)
- [ ] §4 Layout works at 360 / 768 / 1280 viewports
- [ ] §4.6 `pointer: coarse` falls back to no-cursor / no-tilt / no-parallax
- [ ] §5 Claude-design: typographic authority, warmth, kinetic typography, motion budget respected
- [ ] §6 Space-theme: drift speeds within §6.4 bands, accent assignments respected (§6.6)
- [ ] §7 Code conventions: profile.ts used, motion.ts + motion-store.ts used, no any/console.log

**If the PR adds an interactive primitive (cursor, magnetic, parallax, tilt, marquee):**
- [ ] §9 Implementation matches the §9.x spec exactly (constants, easings, ranges)
- [ ] §10.1 Initial-route JS budget: PR's contribution to the budget is documented in `prs/<slug>.md`
- [ ] §10.2 GPU-only animation properties (`transform`, `opacity`, `filter`); no `top/left/width/height` animation
- [ ] §10.3 Tab hidden → animation paused (verified via Performance panel)

Reviewer output format: `reviews/<slug>.md` with each checkbox ticked or explicitly failed with a §ref + one-line rationale.

---

## §9 Interaction Primitives

These are the building blocks of the cinematic layer. Each has a single canonical implementation; sections compose them.

### §9.1 Custom cursor (MUST on `pointer: fine`)

- Two layers: 6 px filled dot + 32 px outlined ring.
- Dot follows pointer with 0 ms lag (re-render every `mousemove`).
- Ring lerps toward dot at `0.18` per frame (~80 ms ease-in feel).
- Hidden default cursor on `body`; system cursor restored under §4.6 (`coarse`) or §1.4 (reduced-motion).
- States (driven by `data-cursor` attribute on hovered element):
  - `default` — ring 32 px, color `--accent-starlight`, alpha 0.6.
  - `link` — ring 64 px, color `--accent-plasma`, alpha 0.9, mix-blend-mode: difference.
  - `card` — ring becomes 80 × 80 square with rounded corners; tracks card edge.
  - `text` — ring shrinks to thin vertical line (text-cursor affordance) on long-form copy.
  - `pressed` — ring shrinks to 24 px on `mousedown`.
- `pointer-events: none` on both layers (§2.10).

### §9.2 Magnetic targets (SHOULD)

- Add `data-magnetic` attribute to any element to opt in.
- Within 60 px of the target's bounding-rect center, the target translates `(1 − dist/60) × 8 px` toward the cursor.
- Snaps back via 300 ms ease-out on leave.
- Implemented as `useMagnetic(ref)` hook in `src/lib/magnetic.ts`.

### §9.3 Smooth scroll (MUST on `pointer: fine`, off otherwise)

- `lenis` v1.x; `duration: 1.2`, `easing: t => 1 - Math.pow(1 - t, 4)` (easeOutQuart-ish).
- Disabled on `pointer: coarse` (touch users get native momentum scroll).
- Disabled under `prefers-reduced-motion: reduce`.
- Mounted in `<ScrollShell>` at the root layout.

### §9.4 Scroll progress bar (SHOULD)

- 1 px tall, fixed at top of viewport, above nav.
- `scaleX` from 0..1 mapped to `scrollTop / scrollMax`.
- Color `--accent-starlight`, `transform-origin: left`.
- No animation duration — it tracks scroll exactly.

### §9.5 Mouse-parallax (SHOULD)

- Container declares depth via `data-parallax-depth="0..1"`.
- Translates `((mouseX − vw/2) × depth × 8 / (vw/2), (mouseY − vh/2) × depth × 8 / (vh/2))` px.
- 200 ms ease-out response (CSS transition, not rAF).
- Implemented as `useParallax(ref, depth)` hook.

### §9.6 Letter reveal (SHOULD on hero h1, optional elsewhere)

- Splits text into `<span aria-hidden>` per letter; preserves a single visually-hidden full-text span for screen readers.
- Each letter clip-paths from `inset(100% 0 0 0)` → `inset(0 0 0 0)` over 700 ms with 30 ms stagger.
- Triggered on mount (no IO needed — hero is above the fold).
- Skipped under reduced-motion (text appears immediately).

### §9.7 Section reveal kit (MUST on every section past hero)

- Implemented as `<Reveal>` wrapper in `src/components/reveal.tsx`.
- IntersectionObserver triggers when 25% in view.
- Heading: clip-path mask reveal (top→bottom, 800 ms).
- Body: fade+rise (500 ms, starts 100 ms after heading).
- Children with `data-stagger` get 80 ms stagger between them.
- One-shot per element (does not replay on re-enter), to keep §5.8 (motion budget) honest.

### §9.8 Project card tilt (SHOULD)

- On `mousemove` over a `data-tilt` card, `rotateX/Y` based on cursor offset from card center, max ±10°, perspective 1000 px.
- 200 ms ease-out CSS transition.
- Resets on `mouseleave`.
- Disabled on `pointer: coarse` (§4.6).

### §9.9 Marquee (SHOULD)

- 60 s linear loop, `transform: translateX(-50%)` of a duplicated content row.
- Pauses when the marquee container is offscreen (IntersectionObserver, `isIntersecting: false`).
- Direction reverses on hover (300 ms easing into reverse).

---

## §10 Animation Performance Budget (MUST)

- §10.1 Initial-route gzipped JS ≤ 200 kb (also restated in §3.1). Animation libs that add to this budget MUST be lazy-loaded or code-split.
- §10.2 GPU-only: only `transform`, `opacity`, `filter` may be animated. Never animate `top/left/width/height/margin/padding`.
- §10.3 Tab hidden → all animation loops pause (`requestAnimationFrame` cancelled, Lenis stopped, marquee paused). CPU goes to 0% within 100 ms of `visibilitychange: hidden`.
- §10.4 FPS targets: 60 FPS on M1 desktop / Chrome, 30 FPS minimum on a 2020 mid-tier Android. The cursor and starfield are the only continuous-rAF consumers; everything else is scroll- or pointer-event-driven.
- §10.5 Lenis must not run during reduced-motion or coarse-pointer sessions (§9.3).
- §10.6 `prefers-reduced-motion: reduce` cuts every motion in §1.4 / §9 to identity transforms. The page must still tell its full story under reduced-motion (text appears, layout is correct, scroll progress still visible).
