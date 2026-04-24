# Architecture

## High-Level Design

A single-page, statically-generated portfolio hosted on Vercel's Hobby (free) tier.

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
│  │  ┌─────────────┐  ┌──────────────────┐  ┌─────────┐   │  │
│  │  │  <Nav/>     │  │  <main> page.tsx │  │<Footer> │   │  │
│  │  └─────────────┘  │  ┌─────────────┐ │  └─────────┘   │  │
│  │                   │  │ <Starfield> │ │                │  │
│  │                   │  ├─────────────┤ │                │  │
│  │                   │  │  <Hero/>    │ │                │  │
│  │                   │  │  <About/>   │ │                │  │
│  │                   │  │  <Exp/>     │ │                │  │
│  │                   │  │  <Projects/>│ │                │  │
│  │                   │  │  <Skills/>  │ │                │  │
│  │                   │  │  <Edu/>     │ │                │  │
│  │                   │  │  <Contact/> │ │                │  │
│  │                   │  └─────────────┘ │                │  │
│  │                   └──────────────────┘                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

Data: src/data/profile.ts  (build-time, typed, no fetching)
```

No backend, no API routes, no database, no serverless functions invoked at runtime. Everything ships as pre-rendered HTML + hydrated React islands.

## Rendering Strategy

| Surface | Strategy | Reason |
| --- | --- | --- |
| Layout, nav, footer, sections | Server Components (default) | Content is static, zero JS needed |
| Starfield canvas | Client Component | Needs `useEffect` + canvas |
| Project card hover reveal | Client Component | Needs hover state |
| Scroll-linked fade-in | Client Component | Needs IntersectionObserver |
| Fonts | `next/font` (Instrument Serif, Inter) | Zero CLS, self-hosted by Next |

Build output: pre-rendered HTML for `/`, static assets in `_next/static/`. Zero runtime invocations on Vercel = zero function seconds consumed.

## Component Tree (LLD)

```
src/
├── app/
│   ├── layout.tsx              # Root layout: html/body, fonts, Nav, Footer
│   ├── page.tsx                # Single route: sections in order
│   ├── globals.css             # Tailwind import + base resets
│   └── favicon.ico
├── components/
│   ├── nav.tsx                 # Sticky top nav (client for mobile menu)
│   ├── footer.tsx              # Footer (server)
│   ├── starfield.tsx           # Canvas starfield (client)
│   ├── section.tsx             # Wrapper w/ anchor + fade-in (client)
│   └── sections/
│       ├── hero.tsx
│       ├── about.tsx
│       ├── experience.tsx
│       ├── projects.tsx
│       ├── skills.tsx
│       ├── education.tsx
│       └── contact.tsx
├── data/
│   └── profile.ts              # Typed source of truth for all copy
├── lib/
│   └── motion.ts               # Shared Framer Motion variants
└── styles/
    └── tokens.css              # CSS custom properties (colors, type, motion)
```

## Data Flow

```
src/data/profile.ts  ──(typed import)──>  src/components/sections/*.tsx
                                                     │
                                                     ▼
                                              React renders
                                                     │
                                                     ▼
                                              Pre-rendered HTML
```

Single source of truth. Updating profile = edit one file, rebuild.

## Performance Budgets

| Metric | Target | Enforcement |
| --- | --- | --- |
| Initial JS (gzipped) | ≤ 150 kb | `next build` output review in reviewer checklist |
| Lighthouse Performance | ≥ 95 | Manual spot check; reviewer flags regressions |
| LCP | < 2.0 s | Hero text is the LCP element — must be in server HTML |
| CLS | < 0.05 | `next/font` prevents font-swap CLS; reserve image aspect ratios |
| TBT | < 200 ms | Starfield + IO must use `requestIdleCallback` / `rAF` |
| Starfield CPU idle | ≤ 1 % on M1 | Pause when tab hidden; cap FPS to 30 |

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

No CMS, no MDX blog, no auth, no i18n, no theme toggle, no analytics (until you opt into Vercel Analytics free tier).
