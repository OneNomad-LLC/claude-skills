# claude-skills

OneNomad's library of Claude Code skills, shipped as plugins from one
marketplace.

## Install

```
/plugin marketplace add OneNomad-LLC/claude-skills
/plugin install <plugin>@claude-skills
```

## Plugins

| Plugin | What it does |
|---|---|
| [blueprint](plugins/blueprint) | Project onboarding. Interviews you in normal conversation, with a coverage tracker and scope pushback, until it can write a full SOW (product definition and technical plan) for a new idea or an existing codebase. Hands off to craft, a build plan and a kickoff prompt. |
| [craft](plugins/craft) | Premium web and app design. Runs a brief interview and a taste picker built from real example sites, sets an OKLCH token system with designed light and dark themes, builds a prototype for review, then production code in Next.js + Tailwind or Expo. Checks the result with rendered screenshots, lint and a critic agent. Handles redesigns of live sites without breaking URLs, SEO or tracking, and includes a scroll-told landing page mode. |
| [napkin](plugins/napkin) | Lazy senior architect mode, always on. Pushes designs toward the fewest components that meet the real requirements, sized for today's scale, with the number at which to revisit. Levels lite, full and ultra. |
| [pager](plugins/pager) | Lazy senior DevOps mode, always on. Pushes infrastructure toward the fewest moving parts, managed over self-hosted, with a verified rollout and a way back for every change. Live-system changes need an explicit go-ahead. Levels lite, full and ultra. |

## Adding a plugin

1. Create `plugins/<name>/.claude-plugin/plugin.json`, then put skills in
   `plugins/<name>/skills/<skill>/SKILL.md` and agents in `plugins/<name>/agents/`.
2. Add the plugin to `.claude-plugin/marketplace.json` with
   `"source": "./plugins/<name>"`.
3. Copy `LICENSE` into the plugin folder. Installs copy only that folder.
   Third-party material needs its notice in the plugin's `NOTICE`.
4. Bump `version` in both `plugin.json` and the marketplace entry for every
   change you want installs to pick up. Claude Code caches each installed
   version, so a new commit under the same version reaches nobody.

Secrets never go in this repo. Plugins read keys from the environment and
document them in a `.env.example`. A pre-commit hook runs gitleaks, falling
back to a pattern check when gitleaks isn't installed. In a fresh clone, turn
it on with `git config core.hooksPath .githooks`.

## Licence

Apache-2.0, unless a plugin's `NOTICE` says a part of it comes from elsewhere.
