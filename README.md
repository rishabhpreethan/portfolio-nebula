# portfolio-nebula

Rishabh Preethan's personal portfolio. Space-themed, Claude-inspired, built spec-driven.

> Single-page Next.js static site. Zero backend. Deployable on Vercel Hobby (free) tier.

## Quickstart

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Build & Deploy

```bash
npm run build      # Next.js static production build
npm run start      # Serve the production build locally
```

Deploy: push to a GitHub repo, connect it in Vercel, done. No env vars required.

## Project Layout

```
ARCHITECTURE.md      # HLD + LLD
EVENT_MODEL.md       # client-side state transitions
ALIGNMENT_SPEC.md    # the contract reviewer checks against
STATUS.md            # epics, tasks, roles, status
BRANCHING.md         # branch + PR flow
agents/              # developer, reviewer, qa role specs
reviews/             # one review file per feature
qa/                  # one QA report + screenshots per feature
prs/                 # PR body stubs to paste into GitHub

src/
  app/               # routes, layout, globals
  components/        # UI components (sections under components/sections)
  data/profile.ts    # single source of truth for all copy
  lib/motion.ts      # shared Framer Motion variants
  styles/tokens.css  # design tokens (CSS vars)

tests/flows/         # Playwright user-flow specs
```

## Spec-Driven Workflow

Every feature branch goes through three roles:

1. **Developer** implements the minimum code to meet the ticket's ACs.
2. **Reviewer** audits against `ALIGNMENT_SPEC.md` and writes `reviews/<slug>.md`.
3. **QA** runs Playwright flows from `tests/flows/` and writes `qa/<slug>.md`.

Only then a PR is opened. See [BRANCHING.md](./BRANCHING.md) for the full flow.

## Content

All portfolio copy lives in [`src/data/profile.ts`](./src/data/profile.ts). Edit there, rebuild, redeploy.

## License

All rights reserved. Content belongs to Rishabh.
