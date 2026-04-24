# Branching & PR Strategy

## Branches

- **`main`** — always deployable. Protected by convention: only Rishabh merges. Every commit on `main` must pass build + be covered by the Alignment Spec.
- **`feature/<epic>-<slug>`** — one branch per task in `STATUS.md`. Slug comes from the task title. Example: `feature/foundation-design-system`, `feature/landing-hero`.
- No long-lived dev/staging branches. `main` is the staging branch (Vercel preview covers it).

## Commit Message Prefixes

Each role signs its work via the prefix:

| Prefix | Role | Example |
| --- | --- | --- |
| `dev:` | Developer | `dev: add hero section with entrance animation` |
| `review:` | Reviewer | `review: approve hero against §5.2, §5.4` |
| `qa:` | QA | `qa: hero flow passes on 360/1024/1920` |
| `chore:` | Any role, scaffolding/deps | `chore: install framer-motion` |
| `fix:` | Developer responding to review | `fix: pull hero colors from tokens (§1.1)` |

Commit messages in imperative mood, first line ≤ 72 chars.

## Per-Feature Flow

```
          ┌─────────────────────────────────────────────────┐
          │ 1. Developer: git checkout -b feature/<slug>    │
          │    reads ALIGNMENT_SPEC + EVENT_MODEL + ticket  │
          │    implements minimal code to meet ACs          │
          │    self-checks: npm run build, npm run dev      │
          │    commits: dev: <change>                       │
          └──────────────────────┬──────────────────────────┘
                                 │
                                 ▼
          ┌─────────────────────────────────────────────────┐
          │ 2. Reviewer: loads diff                         │
          │    walks ALIGNMENT_SPEC §8 checklist            │
          │    writes reviews/<slug>.md (pass/fail + §refs) │
          │    commits: review: <verdict>                   │
          │    IF fail → hand back to Developer             │
          └──────────────────────┬──────────────────────────┘
                                 │ pass
                                 ▼
          ┌─────────────────────────────────────────────────┐
          │ 3. QA: runs relevant Playwright flows           │
          │    writes qa/<slug>.md (results + screenshots)  │
          │    commits: qa: <verdict>                       │
          │    IF fail → hand back to Developer             │
          └──────────────────────┬──────────────────────────┘
                                 │ pass
                                 ▼
          ┌─────────────────────────────────────────────────┐
          │ 4. PR opened to main (by claude / automated)    │
          │    body uses template below                     │
          │    reviews/<slug>.md + qa/<slug>.md linked      │
          └──────────────────────┬──────────────────────────┘
                                 │
                                 ▼
          ┌─────────────────────────────────────────────────┐
          │ 5. Rishabh merges (single-click on GitHub)      │
          │    STATUS.md updated to 🟢                      │
          └─────────────────────────────────────────────────┘
```

## PR Title Format

```
[<epic>] <feature> — <one-line outcome>
```

Examples:
- `[foundation] design system — tokens + fonts + base globals`
- `[landing] hero — name, role, scroll cue`

## PR Body Template

```markdown
## Summary

<1–3 bullets on what changed and why>

## Task

- `STATUS.md` ID: 1.1
- Branch: `feature/foundation-design-system`

## Alignment Spec Coverage

Hits: §1.1 (tokens), §1.2 (typography), §5.3 (warmth)
Verified: see `reviews/foundation-design-system.md`

## QA

- Flows run: _none yet (pre-interactive)_ / `tests/flows/landing-loads.spec.ts`
- Report: `qa/foundation-design-system.md`
- Screenshots: `qa/screenshots/foundation-design-system/`

## Preview

Vercel preview URL (auto-generated on push)

## Test Plan

- [ ] `npm run build` succeeds
- [ ] `npm run dev` loads with no console errors
- [ ] Reviewer §8 checklist ticked
- [ ] QA Playwright flows pass (if applicable)

🤖 Developed with spec-driven agents (dev/reviewer/qa)
```

## Rollback

If a merged PR breaks `main`:
1. `git revert <merge-sha>` on `main`.
2. Re-open the feature branch with a follow-up `fix:` commit.
3. Re-run Reviewer + QA on the fix.

## Notes for Rishabh

- Without a GitHub remote, PRs can't be created via `gh pr create`. Claude will instead:
  - Leave the branch locally with all role commits.
  - Write a PR-body stub at `prs/<slug>.md` that you can paste into GitHub's UI after you push.
- Once you add a GitHub remote (`git remote add origin …`), Claude can switch to `gh pr create` for a real PR. Just say the word.
