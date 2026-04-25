# Status

Single source of truth for what's done, in-flight, and queued. Updated after each role hand-off.

**Legend:** 🟡 pending · 🔵 in-progress · 🟢 complete · 🔴 blocked

---

## Epic 0 — Project Meta *(on `main`)*

| ID | Task | Developer | Reviewer | QA | Status | PR |
| --- | --- | --- | --- | --- | --- | --- |
| 0.1 | Write spec docs (8 files) | claude-dev | — | — | 🔵 | — (on `main`) |
| 0.2 | Install Framer Motion + lucide-react | claude-dev | — | — | 🟡 | — (on `main`) |
| 0.3 | Update `.gitignore` + add `profile.ts` stub | claude-dev | — | — | 🟡 | — (on `main`) |

---

## Epic 1 — Foundation

| ID | Task | Branch | Developer | Reviewer | QA | Status | PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1.1 | Design system: tokens, fonts, globals | `feature/foundation-design-system` | ✅ claude-dev | ✅ claude-reviewer | ✅ claude-qa (pre-interactive) | 🟢 ready-to-merge | `prs/foundation-design-system.md` |
| 1.2 | Layout shell: nav + footer | `feature/foundation-layout-shell` | ✅ claude-dev | ⚠️ claude-reviewer (3 SHOULD suggestions) | ✅ claude-qa (manual smoke) | 🟢 ready-to-merge | `prs/foundation-layout-shell.md` |

---

## Epic 2 — Landing

| ID | Task | Branch | Developer | Reviewer | QA | Status | PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2.1 | Starfield background canvas | `feature/landing-starfield` | ✅ claude-dev | ✅ claude-reviewer | ✅ claude-qa (manual smoke) | 🟢 ready-to-merge | `prs/landing-starfield.md` |
| 2.2 | Hero section | `feature/landing-hero` | ✅ claude-dev | ✅ claude-reviewer | ✅ claude-qa (manual smoke) | 🟢 ready-to-merge | `prs/landing-hero.md` |

---

## Epic 3 — Content

| ID | Task | Branch | Developer | Reviewer | QA | Status | PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 3.1 | About + Experience timeline | `feature/content-about-experience` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
| 3.2 | Projects showcase (6 projects) | `feature/content-projects` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
| 3.3 | Skills constellation + Education | `feature/content-skills-education` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
| 3.4 | Contact section | `feature/content-contact` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |

---

## Epic 4 — QA & Deploy

| ID | Task | Branch | Developer | Reviewer | QA | Status | PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4.1 | Playwright setup + user-flow tests | `feature/qa-playwright-setup` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
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
