# PR stub — [foundation] design system — tokens + fonts + base globals

Paste this into the GitHub PR description when you open it.

---

## Summary

- Design tokens landed as CSS custom properties in `src/styles/tokens.css`, mapped into Tailwind v4 via `@theme` in `globals.css`.
- Fonts wired through `next/font` (Instrument Serif for display, Inter for body).
- Motion primitives (variants, easings, viewport options) live in `src/lib/motion.ts` so no component inlines `initial/animate`.
- Placeholder page replaces create-next-app boilerplate; exercises the token layer.
- `next.config.ts` pins Turbopack root to this dir (avoids stray lockfile detection) and sets `output: "standalone"`.

## Task

- `STATUS.md` ID: **1.1**
- Branch: `feature/foundation-design-system`

## Alignment Spec Coverage

Hits: §1.1 (color tokens), §1.2 (typography), §1.4 (motion + reduced-motion), §2.2 (focus), §5 (Claude-design), §6 (space-theme), §7 (code conventions).

Verified: see [`reviews/foundation-design-system.md`](../reviews/foundation-design-system.md).

## QA

- Flows run: _none_ — pre-interactive feature. Playwright lands in Epic 4.1.
- Manual smoke checks: see [`qa/foundation-design-system.md`](../qa/foundation-design-system.md).

## Preview

Vercel preview URL will auto-generate once the repo is connected.

## Test Plan

- [x] `npm run build` succeeds (no errors, no warnings)
- [x] `npm run dev` loads with no console errors
- [x] Reviewer §8 checklist ticked
- [ ] QA Playwright flows pass — N/A for this feature
- [x] Tokens resolve in DevTools computed styles
- [x] Focus ring visible on keyboard Tab

🤖 Developed with spec-driven agents (dev/reviewer/qa)
