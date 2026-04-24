# Event Model

Every client-side state transition in the app. The point of this doc is: at any moment, you can answer "what state is this component in, what triggered it, and what happens next?" without reading code.

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

## Events Table

| Event ID | Trigger | From State | To State | Side Effects |
| --- | --- | --- | --- | --- |
| `APP_MOUNTED` | `useEffect` in root layout | — | `idle` | Starfield canvas initializes; IntersectionObservers attach |
| `PREFERS_REDUCED_MOTION` | `matchMedia('(prefers-reduced-motion)')` matches on mount OR changes | any | same state + `reducedMotion: true` | Starfield swaps to static gradient; Framer Motion uses 0 ms durations |
| `VIEWPORT_RESIZE` | `resize` event (debounced 150 ms) | any | same + `viewport: sm\|md\|lg\|xl` | Nav toggles mobile/desktop layout; starfield reseeds star density |
| `SCROLL_START` | `scroll` event first fires | `idle` | `scrolling` | Nav gains subtle backdrop blur after 40 px |
| `SCROLL_IDLE` | no scroll for 200 ms | `scrolling` | `idle` | — |
| `SECTION_ENTER` | IntersectionObserver entry with `isIntersecting: true` and `intersectionRatio ≥ 0.25` | section `dormant` | section `visible` | Fade-in + translateY(8→0) animation plays once; nav highlights active anchor |
| `SECTION_EXIT` | IO entry with `isIntersecting: false` | section `visible` | section `dormant` (stays) | Nav un-highlights anchor; animation is **not** re-played on re-enter |
| `NAV_LINK_CLICK` | user clicks a nav link | — | — | `element.scrollIntoView({ behavior: 'smooth' })`; URL hash updates; if reducedMotion → instant jump |
| `NAV_MOBILE_OPEN` | user taps hamburger (sm viewport) | nav `closed` | nav `open` | Body scroll locks; focus trapped to menu |
| `NAV_MOBILE_CLOSE` | tap backdrop, link, or Escape | nav `open` | nav `closed` | Body scroll unlocks; focus returns to hamburger button |
| `PROJECT_CARD_HOVER_IN` | `mouseenter` on card (pointer: fine only) | card `resting` | card `focused` | Card elevates (shadow + scale 1.015); stack tags reveal with 100 ms stagger |
| `PROJECT_CARD_HOVER_OUT` | `mouseleave` | card `focused` | card `resting` | Reverse animation |
| `PROJECT_CARD_FOCUS_KB` | `focus` via Tab key | card `resting` | card `focused` | Same visual as hover-in; ensures keyboard parity |
| `PROJECT_CARD_BLUR_KB` | `blur` | card `focused` | card `resting` | — |
| `STARFIELD_TAB_HIDDEN` | `visibilitychange` → `hidden` | starfield `animating` | starfield `paused` | `cancelAnimationFrame`; CPU goes to 0 |
| `STARFIELD_TAB_VISIBLE` | `visibilitychange` → `visible` | starfield `paused` | starfield `animating` | `requestAnimationFrame` resumes |
| `CONTACT_LINK_CLICK` | user clicks mailto/github/linkedin | — | — | `target="_blank"` for external; no app state change |

## Starfield State Machine

```
            ┌──────────────┐
            │ initializing │ ──(canvas ready)──┐
            └──────────────┘                   │
                                               ▼
  ┌────────── reducedMotion?(yes) ─────┬──────────────┐
  │                                    │              │
  ▼                                    ▼              │
┌─────────┐                      ┌─────────────┐      │
│ static  │ <────(toggle)─────── │  animating  │      │
│gradient │                      │  (30 fps)   │      │
└─────────┘                      └──────┬──────┘      │
                                        │              │
                                        │ tab hidden   │
                                        ▼              │
                                  ┌──────────┐         │
                                  │  paused  │─────────┘
                                  └──────────┘
                                  (tab visible)
```

Invariants:
- `rAF` handle cleared in `paused` (CPU = 0%)
- `static gradient` renders once, then no `rAF` loop
- Switching `reducedMotion` off (user disables it mid-session) → re-init animating

## Nav State

```
Desktop (>= md):
    always visible, horizontal, with active-section highlight

Mobile (< md):
    [closed] ──(tap hamburger)──> [open]
       ▲                              │
       └────(tap link / backdrop / Escape / link nav)────┘
```

Focus & scroll locking in `open`:
- Scroll-lock via `overflow: hidden` on `<html>`
- Focus trap: cycles through menu items
- Escape key returns to `closed`

## Anchor/URL Sync

- Nav click updates `window.location.hash` to `#about`, `#projects`, etc.
- Hash deep links on page load: scroll to section after mount (after fonts load, to avoid mis-offset).
- `scroll-padding-top` on `<html>` equals nav height so anchored scrolls don't hide under sticky nav.

## What is Explicitly NOT Tracked

- Section fade-in once played, never re-plays (one-shot, reduces jitter on long pages).
- No analytics events in this model (add in separate doc if/when analytics introduced).
- No error state (static site has nothing to error on client-side beyond canvas init; fallback is `static gradient`).
