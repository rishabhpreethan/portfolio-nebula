# Architecture

## High-Level Design

A single-page, statically-generated portfolio hosted on Vercel's Hobby (free) tier — with a cinematic interaction layer composited on top. Same rendering strategy as before: pre-rendered HTML, hydrated client islands for the motion machinery.

```
                           ┌──────────────────────────┐
                           │   Vercel Edge Network    │
                           │   (static HTML + JS)     │
                           └──────────────┬───────────┘
                                          │ HTTPS
                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       User's Browser                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   app/layout.tsx                      │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           <ScrollShell> (Lenis)                  │  │  │
│  │  │  ┌────────────┐ ┌────────────────┐ ┌──────────┐  │  │  │
│  │  │  │<ScrollProg>│ │ <Nav/>         │ │ <Cursor> │  │  │  │
│  │  │  └────────────┘ └────────────────┘ └──────────┘  │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │ <Starfield> (3 layers — back/mid/front)    │  │  │  │
│  │  │  ├────────────────────────────────────────────┤  │  │  │
│  │  │  │ <main> page.tsx                            │  │  │  │
│  │  │  │   <Hero/>   ← letter-reveal + parallax     │  │  │  │
│  │  │  │   <Reveal><About/></Reveal>                │  │  │  │
│  │  │  │   <Reveal><Experience/></Reveal>           │  │  │  │
│  │  │  │   <Reveal><Projects/></Reveal>  ← tilt     │  │  │  │
│  │  │  │   <Marquee skills/>                        │  │  │  │
│  │  │  │   <Reveal><Skills/></Reveal>               │  │  │  │
│  │  │  │   <Reveal><Education/></Reveal>            │  │  │  │
│  │  │  │   <Reveal><Contact/></Reveal>              │  │  │  │
│  │  │  ├────────────────────────────────────────────┤  │  │  │
│  │  │  │ <Footer>                                   │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

State spine:  src/lib/motion-store.ts  (cursor.x/y/variant/pressed,
              scroll.progress/velocity/direction, parallax.dx/dy)

Data:         src/data/profile.ts  (build-time, typed, no fetching)
```

No backend, no API routes, no database, no serverless functions invoked at runtime.

## Rendering Strategy

| Surface | Strategy | Reason |
| --- | --- | --- |
| Layout, page composition | Server Components | Content static; no JS for shell |
| Nav | Client Component | Mobile menu state, IO active-section |
| Hero h1 | Server Component | LCP candidate (§3.6); letter-reveal hydrates after mount |
| Section bodies (about, experience, etc.) | Server Components inside `<Reveal>` | Content static; only the wrapper hydrates |
| `<Cursor>`, `<ScrollShell>`, `<ScrollProgress>`, `<Starfield>`, `<Marquee>` | Client Components | All mouse/scroll/canvas |
| Project cards (`<Reveal>` + tilt) | Client Component | `mousemove` driven |
| Fonts | `next/font` (Instrument Serif, Inter) | Zero CLS, self-hosted by Next |

Build output: pre-rendered HTML for `/`, static assets in `_next/static/`. Zero runtime invocations on Vercel = zero function seconds consumed.

## Component Tree (LLD)

```
src/
├── app/
│   ├── layout.tsx              # Root: html/body, fonts, <ScrollShell>, <Cursor>, <ScrollProgress>, <Nav>, children, <Footer>
│   ├── page.tsx                # Composition: <Starfield>, <Hero>, <Reveal>-wrapped sections
│   ├── globals.css             # Tailwind import + base resets + cursor body styles
│   └── favicon.ico
├── components/
│   ├── nav.tsx                 # Sticky top nav (client; mobile menu + active-section IO)
│   ├── footer.tsx              # Footer (server)
│   ├── cursor.tsx              # § 9.1 — dot + ring + variant states (client)
│   ├── scroll-shell.tsx        # § 9.3 — Lenis wrapper (client)
│   ├── scroll-progress.tsx     # § 9.4 — top-edge bar (client)
│   ├── starfield.tsx           # § 6.7 + § 6.8 — 3-layer canvas + cursor gravity (client)
│   ├── reveal.tsx              # § 9.7 — clip-path heading + fade body + child stagger (client)
│   ├── parallax-layer.tsx      # § 6.7 — depth-driven translate (client)
│   ├── marquee.tsx             # § 9.9 — 60 s loop, IO pause, hover reverse (client)
│   ├── brand-icons.tsx         # Inline GitHub/LinkedIn SVGs (server)
│   └── sections/
│       ├── hero.tsx            # § 9.5 + § 9.6 — letter-reveal + mouse parallax
│       ├── about.tsx
│       ├── experience.tsx
│       ├── projects.tsx        # § 9.8 — card tilt
│       ├── skills.tsx
│       ├── education.tsx
│       └── contact.tsx
├── data/
│   └── profile.ts              # Typed source of truth for all copy
├── lib/
│   ├── motion.ts               # Framer Motion variants (entrance, hover, etc.)
│   ├── motion-store.ts         # § 7.3 — useSyncExternalStore for cursor + scroll + parallax
│   ├── magnetic.ts             # § 9.2 — useMagnetic(ref) hook
│   ├── parallax.ts             # § 9.5 — useParallax(ref, depth) hook
│   ├── tilt.ts                 # § 9.8 — useTilt(ref) hook
│   └── lenis-config.ts         # § 9.3 — Lenis options (duration, easing, gates)
└── styles/
    └── tokens.css              # CSS custom properties (colors, type, motion)
```

## Data + State Flow

```
                 ┌────────────────────────────┐
                 │   src/data/profile.ts      │
                 │   (typed; build-time)      │
                 └─────────────┬──────────────┘
                               │ static import
                               ▼
                        sections/*.tsx
                               │ render
                               ▼
                        Pre-rendered HTML

                 ┌────────────────────────────┐
                 │ src/lib/motion-store.ts    │   ← cursor/scroll/parallax
                 │ (useSyncExternalStore)     │     (live, ~60 Hz)
                 └─────────────┬──────────────┘
                               │ selector subscriptions
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
           <Cursor>       <Starfield>     <Reveal>, hooks
                            (gravity)
```

The motion-store is the **single client-side state spine** for live values. No component re-implements pointer/scroll listeners — they all subscribe via selectors. This keeps event handlers to one per global event type (one `pointermove`, one `scroll`), which is essential for the §10 perf budget.

## Performance Budgets

| Metric | Target | Enforcement |
| --- | --- | --- |
| Initial JS (gzipped) | ≤ 200 kb | `next build` size table; `_next/static` JS gzip total reviewed in `prs/<slug>.md` |
| Lighthouse Performance | ≥ 90 (was 95; cinematic motion costs a few points) | Manual spot check; reviewer flags regressions |
| LCP | < 2.0 s | Hero `<h1>` in server HTML; letter-reveal opacity starts at 1 (only clip-path animates) |
| CLS | < 0.05 | `next/font` prevents font-swap CLS; reserve image aspect ratios |
| TBT | < 250 ms | Lenis + cursor + starfield share one `requestAnimationFrame` loop where possible; `<Reveal>` uses native IntersectionObserver |
| Starfield CPU idle (no cursor, no scroll) | ≤ 1 % on M1 | Pause when tab hidden; cap FPS to 30 in pure ambient mode |
| Starfield CPU peak (cursor + fast scroll) | ≤ 8 % on M1 | FPS may rise to 60 here; gravity-well early-exits when cursor is far from any star |

## Allowed Dependencies

Adding a runtime dependency requires a line in this section.

| Package | Used in | Purpose |
| --- | --- | --- |
| `next` | everywhere | Framework |
| `react`, `react-dom` | everywhere | Framework |
| `framer-motion` | reveal, hero, project tilt | Variants + scroll-driven progress |
| `lenis` | scroll-shell | Smooth scroll (§9.3) |
| `lucide-react` | nav, footer, hero, contact | Icons |

Anything else gets a `chore: add <pkg> — <reason; spec ref>` commit and a row here, before any import.

## Deployment Topology

```
GitHub repo ──push──> Vercel (auto-detect Next.js) ──> rishabh.vercel.app
                              │
                              └── no env vars, no build secrets
                              └── static output, zero serverless invocations
```

Free-tier guardrails:
- No `next/dynamic` fetching from paid APIs
- No `revalidate` with remote fetches (we ship pure static)
- No `fetch` in server components against paid services

## Non-Goals (see plan)

No CMS, no MDX blog, no auth, no i18n, no theme toggle, no analytics (until you opt into Vercel Analytics free tier). Specifically out of scope for the cinematic phase: WebGL, Three.js, custom shaders, video backdrops, audio, full-page transitions between routes (we're a single page).
