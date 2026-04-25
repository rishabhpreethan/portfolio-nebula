# Event Model

Every client-side state transition in the app. The point of this doc is: at any moment, you can answer "what state is this component in, what triggered it, and what happens next?" without reading code.

> **Direction note (2026-04-25):** the model is now cinematic. New continuous events for cursor, scroll progress, scroll velocity, parallax, tilt, magnetic. Existing app-level / nav / project events are kept; the Starfield state machine was rewritten to be cursor-aware and scroll-aware.

## Global App States

```
    ┌─────────────┐   DOMContentLoaded    ┌──────────────┐
    │   loading   │ ────────────────────▶ │     idle     │
    └─────────────┘                        └──────┬───────┘
                                                  │
                                   user scrolls   │
                                                  ▼
                                           ┌──────────────┐
                                           │  scrolling   │
                                           └──────┬───────┘
                                                  │
                                   scroll settles │
                                                  ▼
                                           ┌──────────────┐
                                           │     idle     │
                                           └──────────────┘
```

## Foundational events table (kept from v1)

| Event ID | Trigger | From State | To State | Side Effects |
| --- | --- | --- | --- | --- |
| `APP_MOUNTED` | `useEffect` in root layout | — | `idle` | `<ScrollShell>` (Lenis) initializes; cursor mounts; starfield seeds; IntersectionObservers attach |
| `PREFERS_REDUCED_MOTION` | `matchMedia('(prefers-reduced-motion: reduce)')` matches on mount or changes | any | same + `reducedMotion: true` | Lenis bypassed (native scroll); cursor hidden (system cursor); starfield draws once; all framer-motion durations → 0 |
| `POINTER_COARSE` | `matchMedia('(pointer: coarse)')` matches on mount | any | same + `coarse: true` | Cursor disabled, magnetic disabled, tilt disabled, parallax disabled; reveals still play |
| `VIEWPORT_RESIZE` | `resize` event (debounced 150 ms) | any | same + `viewport: sm\|md\|lg\|xl` | Nav toggles mobile/desktop layout; starfield reseeds star density and depth-layer assignments |
| `SCROLL_START` | first `scroll` event | `idle` | `scrolling` | Nav gains backdrop blur after 40 px |
| `SCROLL_IDLE` | no scroll for 200 ms | `scrolling` | `idle` | Scroll-velocity store decays to 0 |
| `SECTION_ENTER` | IO entry, `intersectionRatio ≥ 0.25` | section `dormant` | section `revealing` → `visible` | `<Reveal>` runs heading clip-path + body fade+rise + child stagger (§9.7) |
| `SECTION_EXIT` | IO entry, `isIntersecting: false` | section `visible` | section `dormant` (sticky) | Nav un-highlights anchor; reveal does **not** replay (§5.8 motion budget) |
| `NAV_LINK_CLICK` | user clicks a nav link | — | — | Lenis `scrollTo({ target, offset: -nav-h })`; URL hash updates; reduced-motion → instant jump |
| `NAV_MOBILE_OPEN` | user taps hamburger (sm viewport) | nav `closed` | nav `open` | Body scroll locks; focus trapped to menu |
| `NAV_MOBILE_CLOSE` | tap backdrop, link, or Escape | nav `open` | nav `closed` | Body scroll unlocks; focus returns to hamburger button |
| `STARFIELD_TAB_HIDDEN` | `visibilitychange` → `hidden` | starfield `animating` | starfield `paused` | `cancelAnimationFrame`; CPU goes to 0 |
| `STARFIELD_TAB_VISIBLE` | `visibilitychange` → `visible` | starfield `paused` | starfield `animating` | `requestAnimationFrame` resumes |
| `CONTACT_LINK_CLICK` | user clicks mailto/github/linkedin | — | — | `target="_blank"` for external; no app state change |

## Cinematic events (new)

These are continuous (60 Hz-ish) or interaction-driven. They feed `src/lib/motion-store.ts`, which components subscribe to via selectors.

| Event ID | Trigger | Writes to motion-store | Side Effects |
| --- | --- | --- | --- |
| `CURSOR_MOVE` | `pointermove` on `window` (only on `pointer: fine`) | `cursor.x`, `cursor.y` | Cursor dot updates immediately; ring lerps next frame; starfield gravity-well recomputes; magnetic targets recompute pull |
| `CURSOR_VARIANT_CHANGE` | hovered element's `data-cursor` attribute changes (or `mouseenter`/`mouseleave` fires) | `cursor.variant: 'default' \| 'link' \| 'card' \| 'text' \| 'pressed'` | Ring scales / re-colors per §9.1 |
| `CURSOR_PRESSED` | `mousedown` / `mouseup` on any element | `cursor.pressed: bool` | Ring shrinks to 24 px while pressed |
| `SCROLL_PROGRESS` | Lenis `scroll` event (or native scroll) | `scroll.progress: 0..1` | Top progress bar `scaleX`; section enter checks |
| `SCROLL_VELOCITY` | derived from `SCROLL_PROGRESS` deltas, normalized 0..1 against a cap of 5000 px/s | `scroll.velocity: 0..1` | Starfield drift speed scales; mid/back parallax layers pick up velocity |
| `SCROLL_DIRECTION` | sign of velocity | `scroll.direction: 'up' \| 'down' \| 'idle'` | Reserved (no current consumers — future: nav reveal/hide) |
| `MOUSE_PARALLAX` | derived from `cursor.x/y` and viewport center | `parallax.dx`, `parallax.dy` (px) | Hero name + starfield front layer translate within ±8 px |
| `MAGNETIC_HOVER_ENTER` | cursor within 60 px of a `data-magnetic` element | per-element `magnetic.pull: { dx, dy }` | Target translates toward cursor per §9.2 |
| `MAGNETIC_HOVER_EXIT` | cursor leaves 60 px radius | per-element `magnetic.pull: { 0, 0 }` | Target snaps back over 300 ms ease-out |
| `LETTER_REVEAL_START` | hero `<h1>` mounts on the client | n/a (one-shot) | Each letter clip-path animates with 30 ms stagger; total ≤ 700 ms |
| `SECTION_REVEAL_PROGRESS` | IO entries fire as section crosses thresholds 0, 0.25, 0.5, 0.75, 1 | per-section `reveal.progress: 0..1` | Heading mask, body fade, child stagger driven |
| `PROJECT_CARD_TILT` | `mousemove` over a `data-tilt` card | per-card `tilt: { rx, ry }` (deg) | Card `rotateX/Y` per §9.8 |
| `PROJECT_CARD_TILT_RESET` | `mouseleave` from card | per-card `tilt: { 0, 0 }` | Card returns to flat |
| `MARQUEE_VIEWPORT_ENTER` | IO `isIntersecting: true` on marquee container | per-marquee `marquee.running: true` | Resume `transform` keyframe loop |
| `MARQUEE_VIEWPORT_EXIT` | IO `isIntersecting: false` | per-marquee `marquee.running: false` | Pause keyframe loop (`animation-play-state: paused`) |
| `MARQUEE_HOVER_REVERSE` | `mouseenter` on marquee | per-marquee `marquee.dir: -1` | 300 ms ease into reverse direction |

## Starfield state machine (cinematic)

```
                ┌──────────────┐
                │ initializing │ ─(canvas ready, depth-layers seeded)─┐
                └──────────────┘                                       │
                                                                       ▼
       ┌────────── reducedMotion?(yes) ────────────┬──────────────────────────┐
       │                                            │                          │
       ▼                                            ▼                          │
┌────────────┐                           ┌──────────────────┐                  │
│  static    │ ◀───(reducedMotion on)─── │   animating      │                  │
│ (one-shot) │                           │  (30..60 FPS)    │                  │
└────────────┘                           │                  │                  │
                                         │  modes:          │                  │
                                         │   • ambient drift│                  │
                                         │   • scroll-coupled│                 │
                                         │     drift (60 px/s│                 │
                                         │     at vmax)      │                 │
                                         │   • cursor gravity│                 │
                                         │     well (≤200    │                 │
                                         │     px/s²)        │                 │
                                         └────┬─────────────┘                  │
                                              │  tab hidden                    │
                                              ▼                                │
                                         ┌──────────┐                          │
                                         │  paused  │──────────────────────────┘
                                         └──────────┘
                                          (tab visible)
```

Invariants:
- `rAF` handle cleared in `paused` (CPU = 0%).
- `static (one-shot)` renders once, then no `rAF` loop, no event listeners except `change` on the reduced-motion media query.
- Switching `reducedMotion` off mid-session → re-init `animating`.
- `cursor gravity well` only applies on `pointer: fine` and stops contributing acceleration after the cursor leaves the 120 px radius (stars retain their slingshot velocity until friction damps them).

## Cursor state machine

```
              [pointer: coarse]
              [reduced motion ]
                     │
                  hidden ◀────────────────── [matchMedia change]
                     │
                     │  matchMedia → fine + no-prefer-reduced
                     ▼
                ┌─────────┐
                │ default │ ─── (mouseenter on data-cursor="link") ──▶ link
                └────┬────┘
                     │ mouseenter on data-cursor="card"  → card
                     │ mouseenter on long-text element    → text
                     │ mousedown                          → pressed
                     │
                     ▼
                  (states cycle as cursor moves over decorated elements)

  Any state ─── mousedown ─── → pressed
  pressed   ─── mouseup   ─── → previous state
```

## Reveal state machine (per section)

```
  dormant ──(IO ratio crosses 0.25)──▶ revealing
                                          │
                                          │ heading clip-path → 100% @ 800 ms
                                          │ body fade+rise     @ +100 ms
                                          │ children stagger   @ +180 ms each
                                          ▼
                                       visible (sticky)
                                          │
                                          │ never replays (§5.8)
                                          ▼
                                       (terminal)
```

## Anchor / URL Sync

- Nav click triggers `lenis.scrollTo('#section', { offset: -navHeight })`; updates `window.location.hash`.
- Hash deep links on page load: scroll to section after fonts + Lenis init complete.
- `scroll-padding-top` on `<html>` equals nav height for native fallback (reduced-motion / coarse).

## What is Explicitly NOT Tracked

- Section reveals are one-shot (§5.8); we deliberately do not store "should-replay" state.
- No analytics events in this model (add in separate doc if/when introduced).
- No error state (static site has nothing to error on client-side beyond canvas/Lenis init; fallback for both is `static`).
- Custom cursor does not write back to the motion-store while `hidden` (saves an event-listener storm on touch devices).
