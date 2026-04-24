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
| 1.1 | Design system: tokens, fonts, globals | `feature/foundation-design-system` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
| 1.2 | Layout shell: nav + footer | `feature/foundation-layout-shell` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |

---

## Epic 2 — Landing

| ID | Task | Branch | Developer | Reviewer | QA | Status | PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2.1 | Starfield background canvas | `feature/landing-starfield` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |
| 2.2 | Hero section | `feature/landing-hero` | claude-dev | claude-reviewer | claude-qa | 🟡 | — |

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
