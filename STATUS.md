# Status

Single source of truth for what's done, in-flight, and queued. Updated after each role hand-off.

**Legend:** 🟡 pending · 🔵 in-progress · 🟢 complete · 🔴 blocked / superseded

> **Direction change (2026-04-25):** project pivoted from "restraint-first" to "cinematic-with-discipline." Specs (`ALIGNMENT_SPEC.md` §1.4 / §3 / §5 / §6 / §8 / §9 / §10, `EVENT_MODEL.md`, `ARCHITECTURE.md`) rewritten to match. Original Epic 2 tasks 2.1 (Starfield) and 2.2 (Hero) are **already merged** as 🟢, but their code in `src/components/starfield.tsx` and `src/components/sections/hero.tsx` will be **rewritten** by 2.4 and 2.5 under the new spec. PRs #1–#4 stay in history.

---

## Epic 0 — Project Meta *(on `main`)*

| ID | Task | Developer | Reviewer | QA | Status | PR |
| --- | --- | --- | --- | --- | --- | --- |
| 0.1 | Write spec docs (8 files) | claude-dev | — | — | 🟢 | — (on `main`) |
| 0.2 | Install Framer Motion + lucide-react | claude-dev | — | — | 🟢 | — (on `main`) |
| 0.3 | Update `.gitignore` + add `profile.ts` stub | claude-dev | — | — | 🟢 | — (on `main`) |
| 0.4 | Cinematic spec amendments + STATUS reorg | claude | — | — | 🔵 | — (on `main`) |

---

## Epic 1 — Foundation

| ID | Task | Branch | Developer | Reviewer | QA | Status | PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1.1 | Design system: tokens, fonts, globals | `feature/foundation-design-system` | ✅ claude-dev | ✅ claude-reviewer | ✅ claude-qa | 🟢 merged | [#1](https://github.com/rishabhpreethan/portfolio-nebula/pull/1) |
| 1.2 | Layout shell: nav + footer | `feature/foundation-layout-shell` | ✅ claude-dev | ✅ claude-reviewer | ✅ claude-qa | 🟢 merged | [#2](https://github.com/rishabhpreethan/portfolio-nebula/pull/2) |

---

## Epic 2 — Landing (cinematic — see ALIGNMENT_SPEC §1.4 + §5 + §6 + §9)

| ID | Task | Branch | Developer | Reviewer | QA | Status | PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2.1 | Starfield (subtle, original) | `feature/landing-starfield` | ✅ | ✅ | ✅ | 🟢 merged — code superseded by 2.4 | [#3](https://github.com/rishabhpreethan/portfolio-nebula/pull/3) |
| 2.2 | Hero (static, original) | `feature/landing-hero` | ✅ | ✅ | ✅ | 🟢 merged — code superseded by 2.5 | [#4](https://github.com/rishabhpreethan/portfolio-nebula/pull/4) |
| 2.3 | Interaction shell — custom cursor, Lenis smooth scroll, scroll-progress bar, motion-store | `feature/landing-interaction-shell` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
| 2.4 | Reactive starfield — 3-layer parallax, cursor gravity-well, scroll-velocity drift (replaces 2.1 code) | `feature/landing-reactive-starfield` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
| 2.5 | Hero cinematic — letter-reveal, mouse-parallax, magnetic chip, animated scroll-cue (replaces 2.2 code) | `feature/landing-hero-cinematic` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
| 2.6 | Section reveal kit — `<Reveal>`, `<ParallaxLayer>`, `<Marquee>`, text-split util (replaces existing `<Section>`) | `feature/landing-reveal-kit` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |

---

## Epic 3 — Content

Each Epic-3 task consumes the §9 primitives delivered by 2.3–2.6 (`<Reveal>`, `<ParallaxLayer>`, `<Marquee>`, magnetic, tilt). No section hand-rolls its own motion.

| ID | Task | Branch | Developer | Reviewer | QA | Status | PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 3.1 | About + Experience timeline (with Reveal + parallax) | `feature/content-about-experience` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
| 3.2 | Projects showcase (6 projects, card tilt + skills marquee) | `feature/content-projects` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
| 3.3 | Skills constellation + Education | `feature/content-skills-education` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
| 3.4 | Contact section (magnetic links) | `feature/content-contact` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |

---

## Epic 4 — QA & Deploy

| ID | Task | Branch | Developer | Reviewer | QA | Status | PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4.1 | Playwright setup + user-flow tests (incl. cursor/reveal/coarse-pointer fallback) | `feature/qa-playwright-setup` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
| 4.2 | Vercel deploy config + README | `feature/deploy-vercel` | claude-dev | claude-reviewer | — | 🟡 | — |

---

## Role Hand-off Log

Append after each transition. Format: `YYYY-MM-DD | task ID | role | note`.

- 2026-04-24 | 0.1 | claude-dev | started docs
- 2026-04-24 | 0.1 | claude-dev | docs + profile.ts + deps committed on main
- 2026-04-24 | 1.1 | claude-dev | foundation design system implemented, build green
- 2026-04-24 | 1.1 | claude-reviewer | PASS — all §8 MUSTs green, build-size advisory
- 2026-04-24 | 1.1 | claude-qa | pre-interactive smoke checks PASS; Playwright deferred to Epic 4.1
- 2026-04-24 | 1.1 | claude | PR stub written at prs/foundation-design-system.md; ready for Rishabh to open
- 2026-04-24 | 1.2 | claude-dev | layout shell (nav, footer, Section wrapper) implemented; build green
- 2026-04-24 | 1.2 | claude-reviewer | PASS w/ suggestions — mobile focus trap (S-1), aria-current (S-2), bundle watch (S-3)
- 2026-04-24 | 1.2 | claude-qa | manual smoke PASS; Playwright deferred to 4.1
- 2026-04-24 | 1.2 | claude | PR stub at prs/foundation-layout-shell.md
- 2026-04-25 | 2.1 | claude-dev | starfield canvas implemented; tokens-only, rAF-capped, reduced-motion safe; build green
- 2026-04-25 | 2.1 | claude-reviewer | PASS — §1.1, §1.4, §3.3, §3.5, §3.6, §4, §6, §7 all green; S-1 bundle watch, N-1 spec phrasing note
- 2026-04-25 | 2.1 | claude-qa | manual smoke PASS for F-01 and F-06; Playwright deferred to 4.1
- 2026-04-25 | 2.1 | claude | PR stub at prs/landing-starfield.md
- 2026-04-25 | 2.1 | claude | branches + PRs pushed to origin (PRs #1, #2, #3)
- 2026-04-25 | 2.2 | claude-dev | hero section implemented; SSR <h1>, Display XL clamp, open-to-work chip; build green
- 2026-04-25 | 2.2 | claude-reviewer | PASS — §1.2, §3.6, §5, §6.6, §7 all green; S-1 bundle watch carries forward, S-2 cosmetic polish flagged
- 2026-04-25 | 2.2 | claude-qa | manual smoke PASS for F-01; Playwright deferred to 4.1
- 2026-04-25 | 2.2 | claude | PR stub at prs/landing-hero.md
- 2026-04-25 | 1.1, 1.2, 2.1, 2.2 | rishabh | merged PRs #1, #2, #3, #4 to main
- 2026-04-25 | 0.4 | rishabh | direction pivot — restraint → cinematic. Spec amendments authorized.
- 2026-04-25 | 0.4 | claude | rewrote ALIGNMENT_SPEC §1.4/§3/§5/§6/§8 + new §9/§10; rewrote EVENT_MODEL with cinematic-events + new state machines; updated ARCHITECTURE component tree + budgets; reorganized STATUS Epic 2 (2.1/2.2 marked merged but code-superseded; added 2.3–2.6)
